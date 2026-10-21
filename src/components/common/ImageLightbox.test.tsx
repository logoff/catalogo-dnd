import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ImageLightbox from './ImageLightbox'

const IMAGES = ['/images/a.jpg', '/images/b.jpg', '/images/c.jpg']

function renderLightbox(props: Partial<Parameters<typeof ImageLightbox>[0]> = {}) {
  const onClose = vi.fn()
  const result = render(<ImageLightbox images={IMAGES} isOpen onClose={onClose} {...props} />)
  return { ...result, onClose }
}

// Imagen principal visible (las miniaturas tienen alt «Miniatura N»)
const mainImageAlt = () => screen.getByAltText(/^Imagen \d+$/).getAttribute('alt')

describe('ImageLightbox', () => {
  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('no renderiza nada cerrado', () => {
    const { container } = renderLightbox({ isOpen: false })
    expect(container).toBeEmptyDOMElement()
  })

  it('no renderiza nada sin imágenes', () => {
    const { container } = renderLightbox({ images: [] })
    expect(container).toBeEmptyDOMElement()
  })

  it('abre en la imagen indicada', () => {
    renderLightbox({ initialIndex: 1 })
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    expect(mainImageAlt()).toBe('Imagen 2')
  })

  it('no muestra contador ni navegación con una sola imagen', () => {
    renderLightbox({ images: ['/images/a.jpg'] })
    expect(screen.queryByText('1 / 1')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Siguiente')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Anterior')).not.toBeInTheDocument()
  })

  describe('navegación', () => {
    it('avanza y retrocede con los botones, dando la vuelta en los extremos', () => {
      renderLightbox()
      fireEvent.click(screen.getByLabelText('Anterior'))
      expect(screen.getByText('3 / 3')).toBeInTheDocument()
      fireEvent.click(screen.getByLabelText('Siguiente'))
      expect(screen.getByText('1 / 3')).toBeInTheDocument()
    })

    it('avanza y retrocede con las flechas del teclado', () => {
      renderLightbox()
      fireEvent.keyDown(document, { key: 'ArrowRight' })
      expect(screen.getByText('2 / 3')).toBeInTheDocument()
      fireEvent.keyDown(document, { key: 'ArrowLeft' })
      fireEvent.keyDown(document, { key: 'ArrowLeft' })
      expect(screen.getByText('3 / 3')).toBeInTheDocument()
    })

    it('salta a la imagen de la miniatura pulsada', () => {
      renderLightbox()
      fireEvent.click(screen.getByAltText('Miniatura 3'))
      expect(screen.getByText('3 / 3')).toBeInTheDocument()
      expect(mainImageAlt()).toBe('Imagen 3')
    })
  })

  describe('cierre', () => {
    it('se cierra con Escape', () => {
      const { onClose } = renderLightbox()
      fireEvent.keyDown(document, { key: 'Escape' })
      expect(onClose).toHaveBeenCalledOnce()
    })

    it('se cierra con el botón Cerrar', () => {
      const { onClose } = renderLightbox()
      fireEvent.click(screen.getByLabelText('Cerrar'))
      expect(onClose).toHaveBeenCalledOnce()
    })

    it('se cierra al pulsar el fondo, pero no la imagen ni los controles', () => {
      const { onClose } = renderLightbox()
      fireEvent.click(screen.getByAltText('Imagen 1'))
      fireEvent.click(screen.getByLabelText('Siguiente'))
      fireEvent.click(screen.getByAltText('Miniatura 1'))
      expect(onClose).not.toHaveBeenCalled()

      fireEvent.click(screen.getByText('1 / 3').parentElement!)
      expect(onClose).toHaveBeenCalledOnce()
    })

    it('deja de escuchar el teclado al cerrarse', () => {
      const { rerender, onClose } = renderLightbox()
      rerender(<ImageLightbox images={IMAGES} isOpen={false} onClose={onClose} />)
      fireEvent.keyDown(document, { key: 'Escape' })
      expect(onClose).not.toHaveBeenCalled()
    })
  })

  it('bloquea el scroll de la página mientras está abierto', () => {
    const { rerender, onClose } = renderLightbox()
    expect(document.body.style.overflow).toBe('hidden')
    rerender(<ImageLightbox images={IMAGES} isOpen={false} onClose={onClose} />)
    expect(document.body.style.overflow).toBe('')
  })

  describe('al reabrirse', () => {
    it('vuelve a la imagen inicial aunque se hubiera navegado', () => {
      const { rerender, onClose } = renderLightbox({ initialIndex: 0 })
      fireEvent.keyDown(document, { key: 'ArrowRight' })
      expect(screen.getByText('2 / 3')).toBeInTheDocument()

      rerender(<ImageLightbox images={IMAGES} initialIndex={0} isOpen={false} onClose={onClose} />)
      rerender(<ImageLightbox images={IMAGES} initialIndex={0} isOpen onClose={onClose} />)
      expect(screen.getByText('1 / 3')).toBeInTheDocument()
    })

    it('abre en la nueva imagen inicial', () => {
      const { rerender, onClose } = renderLightbox({ initialIndex: 0 })
      rerender(<ImageLightbox images={IMAGES} initialIndex={0} isOpen={false} onClose={onClose} />)
      rerender(<ImageLightbox images={IMAGES} initialIndex={2} isOpen onClose={onClose} />)
      expect(screen.getByText('3 / 3')).toBeInTheDocument()
    })
  })
})
