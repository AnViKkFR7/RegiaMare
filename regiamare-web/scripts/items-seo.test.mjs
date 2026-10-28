import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { createClient } from '@supabase/supabase-js'
import { createServer } from 'node:http'
import { once } from 'node:events'
import { readFileSync } from 'node:fs'

await build({ entryPoints: ['api/property.ts', 'api/sitemap.ts', 'src/lib/properties.ts'], bundle: true,
  outdir: 'node_modules/.tmp/items-tests', format: 'esm', platform: 'node', packages: 'external' })
const { GET: property } = await import('../node_modules/.tmp/items-tests/api/property.js')
const { GET: sitemap } = await import('../node_modules/.tmp/items-tests/api/sitemap.js')
const core = await import('../node_modules/.tmp/items-tests/src/lib/properties.js')
const company = core.PROPERTY_COMPANY_ID
const itemType = core.PROPERTY_ITEM_TYPE
const id = '11111111-1111-4111-8111-111111111111'
const attr = (key, value) => ({ id: key, item_id: id, value_text: typeof value === 'string' ? value : null,
  value_number: typeof value === 'number' ? value : null,
  attribute_definitions: { company_id: company, item_type: itemType, key, data_type: typeof value === 'number' ? 'number' : 'text' } })
const publicItem = { id, company_id: company, item_type: itemType, status: 'published', title: 'Casa <costa> $&',
  summary: 'Resumen público & seguro', slug: 'casa-costa', seo_title: 'Casa "costa"', seo_description: 'Descripción <segura>',
  seo_og_image_url: 'https://images.example/og.jpg', created_at: '2026-01-01', updated_at: '2026-10-01',
  attribute_values: [attr('description', '<script>alert(1)</script> Casa junto al mar.'), attr('price', 100000),
    attr('city', 'Sitges'), attr('bedrooms', 2)],
  item_media: [{ id: 'cover', item_id: id, file_type: 'image', url_externa: 'https://images.example/cover.jpg',
    alt_text: 'La casa y su terraza', sort_order: 2, is_cover: true },
    { id: 'bad', item_id: id, file_type: 'image', url_externa: 'javascript:alert(1)', sort_order: 0 }] }
const make = (changes) => ({ ...publicItem, ...changes })
const initial = [publicItem,
  make({ id: '22222222-2222-4222-8222-222222222222', slug: 'sin-seo', seo_title: null, seo_description: null, seo_og_image_url: 'http://insecure.example/image.jpg' }),
  make({ id: '33333333-3333-4333-8333-333333333333', slug: null }),
  make({ id: '44444444-4444-4444-8444-444444444444', slug: 'borrador', status: 'draft' }),
  make({ id: '55555555-5555-4555-8555-555555555555', slug: 'archivado', status: 'archived' }),
  make({ id: '66666666-6666-4666-8666-666666666666', slug: 'otra-empresa', company_id: 'another-company' }),
  make({ id: '77777777-7777-4777-8777-777777777777', slug: 'otro-tipo', item_type: 'other-type' })]
let rows = initial
let failing = false
let base
let server
const originalFetch = globalThis.fetch
const client = createClient('https://example.supabase.co', 'anon-key', { auth: { persistSession: false } })
Object.assign(process.env, { VITE_COMPANY_ID: company, SUPABASE_URL: 'https://example.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'anon-key', SITE_URL: 'https://regiamare.example', SUPABASE_SERVICE_ROLE_KEY: 'MUST-NOT-BE-USED' })

before(async () => {
  globalThis.fetch = async (input, init) => {
    const url = new URL(typeof input === 'string' ? input : input.url ?? String(input))
    if (url.hostname === '127.0.0.1') return originalFetch(input, init)
    assert.equal(url.hostname, 'example.supabase.co')
    assert.equal(new Headers(init.headers).get('Authorization'), 'Bearer anon-key')
    if (failing) return Response.json({ message: 'Unavailable', code: 'TEST' }, { status: 500 })
    assert.equal(url.searchParams.get('company_id'), `eq.${company}`)
    assert.equal(url.searchParams.get('status'), 'eq.published')
    if (url.pathname.endsWith('/blog_posts')) return Response.json([{ slug: 'blog-publico' }])
    assert.ok(url.pathname.endsWith('/items'))
    assert.equal(url.searchParams.get('item_type'), `eq.${itemType}`)
    let result = rows.filter(row => row.company_id === company && row.item_type === itemType && row.status === 'published')
    for (const key of ['id', 'slug']) {
      const filter = url.searchParams.get(key)
      if (filter?.startsWith('eq.')) result = result.filter(row => row[key] === filter.slice(3))
    }
    const start = Number(url.searchParams.get('offset') ?? 0)
    const limit = Number(url.searchParams.get('limit') ?? 1000)
    return Response.json(result.slice(start, start + limit))
  }
  server = createServer(async (req, res) => {
    const result = req.url.startsWith('/sitemap.xml') ? await sitemap()
      : await property(new Request(`http://127.0.0.1${req.url}`))
    res.writeHead(result.status, Object.fromEntries(result.headers))
    res.end(await result.text())
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  base = `http://127.0.0.1:${server.address().port}`
})
after(async () => {
  globalThis.fetch = originalFetch
  await new Promise(resolve => server.close(resolve))
})

test('HTML HTTP inicial contiene SEO, canonical, contenido y alt sin JavaScript', async () => {
  const response = await fetch(`${base}/property/casa-costa?company_id=another-company`)
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('cache-control'), 'no-store')
  const html = await response.text()
  assert.match(html, /<title>Casa &quot;costa&quot;<\/title>/)
  assert.match(html, /name="description" content="Descripción &lt;segura&gt;"/)
  assert.match(html, /rel="canonical" href="https:\/\/regiamare.example\/property\/casa-costa"/)
  assert.match(html, /name="robots" content="index,follow"/)
  assert.match(html, /property="og:image" content="https:\/\/images.example\/og.jpg"/)
  assert.match(html, /alt="La casa y su terraza"/)
  assert.match(html, /<h1>Casa &lt;costa&gt; \$&amp;<\/h1>/)
  assert.doesNotMatch(html, /<script>alert|src="javascript:|MUST-NOT-BE-USED/)
})
test('fallback SEO usa título/resumen y omite OG inseguro sin imágenes aptas', async () => {
  const response = await fetch(`${base}/property/sin-seo`)
  const html = await response.text()
  assert.equal(response.status, 200)
  assert.match(html, /<title>Casa &lt;costa&gt; \$&amp;<\/title>/)
  assert.match(html, /name="description" content="Resumen público &amp; seguro"/)
  assert.doesNotMatch(html, /property="og:image"/)
})
test('UUID publicado redirige 308 al slug sin queries ni contenido duplicado', async () => {
  const response = await fetch(`${base}/property/${id}?utm_source=old`, { redirect: 'manual' })
  assert.equal(response.status, 308)
  assert.equal(response.headers.get('location'), 'https://regiamare.example/property/casa-costa')
  assert.equal(await response.text(), '')
})
test('sin SITE_URL ni VITE_SITE_URL las fichas, redirects y sitemap usan regiamare.com', async () => {
  const saved = { site: process.env.SITE_URL, vite: process.env.VITE_SITE_URL }
  delete process.env.SITE_URL
  delete process.env.VITE_SITE_URL
  try {
    const response = await fetch(`${base}/property/casa-costa`, { headers: { 'X-Forwarded-Host': 'otro-sitio.example' } })
    assert.equal(response.status, 200)
    assert.match(await response.text(), /rel="canonical" href="https:\/\/regiamare.com\/property\/casa-costa"/)
    const redirect = await fetch(`${base}/property/${id}`, { redirect: 'manual' })
    assert.equal(redirect.status, 308)
    assert.equal(redirect.headers.get('location'), 'https://regiamare.com/property/casa-costa')
    const map = await fetch(`${base}/sitemap.xml`)
    assert.equal(map.status, 200)
    assert.match(await map.text(), /https:\/\/regiamare.com\/property\/casa-costa/)
  } finally {
    if (saved.site === undefined) delete process.env.SITE_URL; else process.env.SITE_URL = saved.site
    if (saved.vite === undefined) delete process.env.VITE_SITE_URL; else process.env.VITE_SITE_URL = saved.vite
  }
})
test('un dominio configurado explícitamente sin HTTPS sigue siendo un error', async () => {
  const previous = process.env.SITE_URL
  process.env.SITE_URL = 'http://regiamare.example'
  try { assert.equal((await fetch(`${base}/property/casa-costa`)).status, 503) }
  finally { process.env.SITE_URL = previous }
})
test('UUID sin slug mantiene ficha con noindex, sin canonical UUID', async () => {
  const response = await fetch(`${base}/property/33333333-3333-4333-8333-333333333333`)
  assert.equal(response.status, 200)
  const html = await response.text()
  assert.match(html, /name="robots" content="noindex,follow"/)
  assert.doesNotMatch(html, /rel="canonical"/)
})
test('borradores, archivados, referencias inválidas, tenant/tipo ajenos son 404/noindex', async () => {
  for (const reference of ['borrador', 'archivado', 'otra-empresa', 'otro-tipo', 'inexistente', 'INVALID', '%ZZ',
    '44444444-4444-4444-8444-444444444444', '66666666-6666-4666-8666-666666666666']) {
    const response = await fetch(`${base}/property/${reference}`)
    assert.equal(response.status, 404, reference)
    assert.equal(response.headers.get('x-robots-tag'), 'noindex')
    assert.doesNotMatch(await response.text(), /Resumen público/)
  }
})
test('sitemap solo contiene slugs publicados válidos, sin UUID ni lastmod de mantenimiento', async () => {
  const response = await fetch(`${base}/sitemap.xml`)
  assert.equal(response.status, 200)
  const xml = await response.text()
  assert.match(xml, /\/property\/casa-costa/)
  assert.match(xml, /\/blog\/blog-publico/)
  assert.doesNotMatch(xml, /borrador|archivado|otra-empresa|otro-tipo|33333333|lastmod|\?utm/)
})
test('publicar/archivar se refleja en HTML y sitemap sin caché anterior', async () => {
  rows = initial.map(row => row.id === id ? { ...row, status: 'archived' } : row)
  try {
    assert.equal((await fetch(`${base}/property/casa-costa`)).status, 404)
    assert.doesNotMatch(await (await fetch(`${base}/sitemap.xml`)).text(), /\/property\/casa-costa/)
  } finally { rows = initial }
})
test('errores Supabase son 503/reintento; loaders propagan el fallo', async () => {
  failing = true
  try {
    const response = await fetch(`${base}/property/casa-costa`)
    assert.equal(response.status, 503)
    assert.equal(response.headers.get('x-robots-tag'), 'noindex')
    assert.equal((await fetch(`${base}/sitemap.xml`)).status, 503)
    await assert.rejects(core.loadPublicProperties(client))
    await assert.rejects(core.loadPublicProperty(client, 'casa-costa'))
  } finally { failing = false }
})
test('paginación recupera más de 500 publicados sin mezclar otros estados', async () => {
  rows = Array.from({ length: 501 }, (_, index) => make({ id: `fixture-${index}`, slug: `casa-${index}` }))
  try {
    assert.equal((await core.loadPublicProperties(client)).length, 501)
    const xml = await (await fetch(`${base}/sitemap.xml`)).text()
    assert.match(xml, /\/property\/casa-500/)
    assert.equal((xml.match(/\/property\//g) ?? []).length, 501)
  } finally { rows = initial }
})
test('slugs duplicados no resuelven silenciosamente a una ficha cualquiera', async () => {
  rows = [...initial, make({ id: 'duplicate' })]
  try { assert.equal((await fetch(`${base}/property/casa-costa`)).status, 503) }
  finally { rows = initial }
})
test('portada is_cover y enlaces slug; preservación UUID sin slug', () => {
  const item = core.transformPublicProperty(publicItem)
  assert.equal(item.media.find(image => image.is_primary).id, 'cover')
  assert.equal(item.media.length, 1)
  assert.equal(core.propertyPath(item), '/property/casa-costa')
  assert.equal(core.propertyPath({ id, slug: null }), `/property/${id}`)
  assert.equal(core.propertySeo({ ...item, seo_og_image_url: 'http://unsafe.example/image.jpg' }).image, 'https://images.example/cover.jpg')
})
test('lote editorial respeta límites, IDs, portadas verificadas y SQL termina sin commit', () => {
  const proposal = JSON.parse(readFileSync('docs/items-seo/proposals.json', 'utf8'))
  assert.equal(proposal.items.length, 8)
  assert.equal(new Set(proposal.items.map(row => row.slug)).size, 8)
  for (const item of proposal.items) {
    assert.equal(item.company_id, company); assert.equal(item.item_type, itemType)
    assert.ok(item.slug.length <= 120 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug))
    assert.ok(item.seo_title.length <= 70 && item.seo_description.length <= 160)
    if (item.seo_og_image_url) assert.ok(proposal.image_checks.some(check => check.id === item.id && check.valid && check.url === item.seo_og_image_url))
  }
  const sql = readFileSync('docs/items-seo/PROPOSED_ITEMS_SEO_VALUES.sql', 'utf8')
  assert.ok(sql.trimEnd().endsWith('ROLLBACK;'))
  assert.doesNotMatch(sql, /__REVIEWED_VALUES__|__EXPECTED_COUNT__/)
  const update = sql.slice(sql.indexOf('UPDATE public.items'), sql.indexOf('FROM _regiamare_seo_batch b\nWHERE'))
  assert.doesNotMatch(update, /\b(title|summary|status|price)\s*=/)
})
