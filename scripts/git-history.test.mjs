import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { execFileSync } from 'child_process'
import { mkdtempSync, mkdirSync, renameSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { isShallow, monthBounds, monthChanges } from './git-history.mjs'

let repo

// Commit con fecha fija (de autor y de commit)
function commit(message, date) {
  execFileSync('git', ['add', '-A'], { cwd: repo })
  execFileSync('git', ['commit', '-q', '-m', message], {
    cwd: repo,
    env: {
      ...process.env,
      GIT_AUTHOR_DATE: date,
      GIT_COMMITTER_DATE: date,
      GIT_AUTHOR_NAME: 'Test',
      GIT_AUTHOR_EMAIL: 'test@example.com',
      GIT_COMMITTER_NAME: 'Test',
      GIT_COMMITTER_EMAIL: 'test@example.com',
    },
  })
}

const write = (file, json) => {
  mkdirSync(join(repo, file, '..'), { recursive: true })
  writeFileSync(join(repo, file), JSON.stringify(json))
}

beforeAll(() => {
  repo = mkdtempSync(join(tmpdir(), 'catalogo-git-'))
  execFileSync('git', ['init', '-q', '-b', 'main'], { cwd: repo })
  write('data/novels/fr/a.json', { slug: 'a', v: 1 })
  write('data/novels/fr/viejo.json', { slug: 'viejo' })
  commit('octubre', '2026-10-20T10:00:00+02:00')
  // 31 de octubre a las 23:30 en Madrid: aún es octubre
  write('data/novels/fr/a.json', { slug: 'a', v: 2 })
  commit('última hora de octubre', '2026-10-31T23:30:00+01:00')
  write('data/novels/fr/b.json', { slug: 'b' })
  write('data/novels/fr/a.json', { slug: 'a', v: 3 })
  mkdirSync(join(repo, 'data/novels/dl'), { recursive: true })
  renameSync(join(repo, 'data/novels/fr/viejo.json'), join(repo, 'data/novels/dl/viejo.json'))
  commit('noviembre', '2026-11-10T10:00:00+01:00')
  write('data/novels/fr/c.json', { slug: 'c' })
  commit('diciembre', '2026-12-01T00:30:00+01:00')
})

afterAll(() => rmSync(repo, { recursive: true, force: true }))

describe('historial de git', () => {
  it('los límites del mes van en hora de Madrid', () => {
    expect(monthBounds('2026-11')).toEqual({
      start: '2026-11-01T00:00:00+01:00',
      end: '2026-12-01T00:00:00+01:00',
    })
    expect(monthBounds('2026-07').start).toBe('2026-07-01T00:00:00+02:00')
  })

  it('compara el estado al empezar y al acabar el mes, con los movidos como cambios', () => {
    const { changes } = monthChanges(repo, '2026-11')
    const byFile = Object.fromEntries(changes.map((c) => [c.file, c]))
    expect(Object.keys(byFile).sort()).toEqual([
      'data/novels/dl/viejo.json',
      'data/novels/fr/a.json',
      'data/novels/fr/b.json',
    ])
    expect(byFile['data/novels/fr/a.json']).toMatchObject({ before: { v: 2 }, after: { v: 3 } })
    expect(byFile['data/novels/fr/b.json'].before).toBeNull()
    expect(byFile['data/novels/dl/viejo.json'].before).toEqual({ slug: 'viejo' })
  })

  it('sin historial antes del mes, todo es nuevo', () => {
    const { changes } = monthChanges(repo, '2026-10')
    expect(changes.every((c) => c.before === null)).toBe(true)
    expect(changes).toHaveLength(2)
  })

  it('lee aparte los archivos que se piden en la revisión de llegada', () => {
    const { extra } = monthChanges(repo, '2026-12', ['data/novels/fr/c.json', 'no/existe.json'])
    expect(extra).toEqual([{ slug: 'c' }, null])
  })

  it('sabe si el clon es superficial', () => {
    expect(isShallow(repo)).toBe(false)
  })
})
