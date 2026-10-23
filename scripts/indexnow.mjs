// Envía a IndexNow (Bing, Yandex y otros) todas las URLs del sitemap publicado.
// La clave es pública: IndexNow la comprueba en https://catalogodnd.es/<clave>.txt
const SITE_URL = 'https://catalogodnd.es'
const KEY = '9b83714c2adf48a683932d8d2916a037'

const sitemap = await (await fetch(`${SITE_URL}/sitemap.xml`)).text()
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: new URL(SITE_URL).host,
    key: KEY,
    keyLocation: `${SITE_URL}/${KEY}.txt`,
    urlList,
  }),
})

// 200 y 202 son respuestas correctas (202: clave pendiente de validar)
console.log(`IndexNow: ${response.status} ${response.statusText} (${urlList.length} URLs)`)
if (!response.ok) {
  console.error(await response.text())
  process.exit(1)
}
