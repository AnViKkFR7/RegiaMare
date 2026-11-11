import { test } from 'node:test'
import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { readFile } from 'node:fs/promises'

await build({ entryPoints: ['api/page.ts', 'api/catalog.ts', 'src/lib/seo.ts', 'server/html.ts'], bundle: true,
  outdir: 'node_modules/.tmp/seo-tests', format: 'esm', platform: 'node', packages: 'external' })
const { GET: page } = await import('../node_modules/.tmp/seo-tests/api/page.js')
const { GET: catalog } = await import('../node_modules/.tmp/seo-tests/api/catalog.js')
const seo = await import('../node_modules/.tmp/seo-tests/src/lib/seo.js')
const { renderDocument } = await import('../node_modules/.tmp/seo-tests/server/html.js')
const company = 'eac2ccbe-cc36-40cd-bb7e-d5fe44de972d'
const originalFetch = globalThis.fetch
let failure = false
const rows = Array.from({ length: 21 }, (_, index) => ({ id: `property-${index}`, company_id: company,
  item_type: 'regiamare_property', status: 'published', title: `Casa ${index}`, slug: `casa-${index}`,
  summary: 'Resumen', created_at: `2026-01-${String(index + 1).padStart(2, '0')}`, attribute_values: [], item_media: [] }))
Object.assign(process.env, { VITE_COMPANY_ID: company, SUPABASE_URL: 'https://example.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'anon-key', SITE_URL: 'https://regiamare.com' })
globalThis.fetch = async (input) => {
  const url = new URL(typeof input === 'string' ? input : input.url ?? String(input))
  assert.equal(url.searchParams.get('company_id'), `eq.${company}`)
  assert.equal(url.searchParams.get('item_type'), 'eq.regiamare_property')
  assert.equal(url.searchParams.get('status'), 'eq.published')
  if (failure) return Response.json({ code: 'TEST', message: 'Database error' }, { status: 500 })
  return Response.json(rows)
}
test.after(() => { globalThis.fetch = originalFetch })
const jsonLd = html => JSON.parse(html.match(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)[1])

test('páginas estáticas entregan contenido, canonical, JSON-LD y contacto sin JS', async () => {
  for (const path of ['/', '/services', '/sales', '/about']) {
    const response = await page(new Request(`https://regiamare.com${path}`))
    assert.equal(response.status, 200)
    const html = await response.text()
    assert.match(html, /<html lang="es">/)
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1)
    assert.match(html, /name="description" content="[^"]{40,160}"/)
    assert.match(html, /rel="canonical"/)
    assert.match(html, /twitter:card/)
    assert.ok(jsonLd(html)['@graph'].some(node => node['@type'] === 'RealEstateAgent'))
    assert.match(html, /info@regiamare.com/)
    assert.doesNotMatch(html, /B-12345678/)
  }
})
test('robots permite rastreo público e indica el sitemap; llms contiene fuentes coherentes', async () => {
  const robots = await readFile('dist/robots.txt', 'utf8')
  assert.match(robots, /User-agent: \*/)
  assert.match(robots, /Allow: \/\n/)
  assert.doesNotMatch(robots, /Disallow: \/\s*$/m)
  assert.match(robots, /Sitemap: https:\/\/regiamare.com\/sitemap.xml/)
  const llms = await readFile('dist/llms.txt', 'utf8')
  assert.ok(llms.startsWith('# Regia Mare Properties'))
  assert.match(llms, /https:\/\/regiamare.com\/purchases/)
  assert.match(llms, /info@regiamare.com/)
})
test('URLs inexistentes devuelven 404 real y noindex, también por el rewrite', async () => {
  for (const url of ['https://regiamare.com/esto-no-existe', 'https://regiamare.com/api/page?path=/esto-no-existe']) {
    const response = await page(new Request(url))
    assert.equal(response.status, 404)
    assert.equal(response.headers.get('x-robots-tag'), 'noindex')
    assert.match(await response.text(), /noindex,follow/)
  }
})
test('catálogo HTTP entrega enlaces, paginación y ItemList con aislamiento por tenant', async () => {
  const first = await catalog(new Request('https://regiamare.com/purchases'))
  const html = await first.text()
  assert.equal(first.status, 200)
  assert.match(html, /href="\/property\/casa-0"/)
  assert.match(html, /href="https:\/\/regiamare.com\/purchases\?page=2"/)
  assert.equal(jsonLd(html)['@graph'].find(node => node['@type'] === 'ItemList').itemListElement.length, 20)
  const second = await catalog(new Request('https://regiamare.com/purchases?page=2'))
  assert.equal(second.status, 200)
  const html2 = await second.text()
  assert.match(html2, /rel="canonical" href="https:\/\/regiamare.com\/purchases\?page=2"/)
  assert.match(html2, /\/property\/casa-20/)
  assert.equal((await catalog(new Request('https://regiamare.com/purchases?page=3'))).status, 404)
})
test('filtros de catálogo llevan noindex y errores no producen listas vacías', async () => {
  const response = await catalog(new Request('https://regiamare.com/purchases?zone=Sitges'))
  assert.equal(response.headers.get('x-robots-tag'), 'noindex')
  failure = true
  try { assert.equal((await catalog(new Request('https://regiamare.com/purchases'))).status, 503) }
  finally { failure = false }
})
test('JSON-LD escapa cierres de script y no inventa oferta para vendido/reservado/alquiler', () => {
  const property = { id: 'public', title: '</script><script>attack</script>', slug: 'public', description: 'Texto',
    attributes: { operation_type: 'Venta', price: 100000, bedrooms: 2, built_surface: 60, city: 'Sitges', province: 'Barcelona', property_type: 'Piso' }, media: [] }
  const metadata = seo.propertyMetadata(property)
  const graph = metadata.graph
  assert.equal(graph.find(node => node['@type'] === 'RealEstateListing').offers.price, 100000)
  for (const attrs of [{ vendido: true }, { reservada: true }, { operation_type: 'Alquiler' }]) {
    const changed = seo.propertyMetadata({ ...property, attributes: { ...property.attributes, ...attrs } })
    assert.equal(changed.graph.find(node => node['@type'] === 'RealEstateListing').offers, undefined)
  }
  const serialized = seo.safeJsonLd(graph)
  assert.doesNotMatch(serialized, /<\/script>/)
  assert.equal(JSON.parse(serialized)['@graph'].find(node => node['@type'] === 'Apartment').name, property.title)
  const html = renderDocument(metadata, '<main><h1>Texto público</h1></main>')
  assert.match(html, /rel="stylesheet" href="\/assets\/PropertyDetail-/)
  assert.doesNotMatch(html, /<script>attack/)
})
