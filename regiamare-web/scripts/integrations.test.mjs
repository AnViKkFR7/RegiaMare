import { build } from 'esbuild'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import ts from 'typescript'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'

await build({ entryPoints: ['api/lead.ts', 'api/track.ts', 'api/blog.ts'], bundle: true,
  outdir: 'node_modules/.tmp/integrations', format: 'esm', platform: 'node', packages: 'external', jsx: 'automatic' })
const { POST: lead } = await import('../node_modules/.tmp/integrations/lead.js')
const { POST: track } = await import('../node_modules/.tmp/integrations/track.js')
const { GET: blog } = await import('../node_modules/.tmp/integrations/blog.js')
const company = 'eac2ccbe-cc36-40cd-bb7e-d5fe44de972d'
Object.assign(process.env, { VITE_COMPANY_ID: company, SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'server-key', VITE_SUPABASE_ANON_KEY: 'anon-key', SITE_URL: 'https://regiamare.example' })
let enabled = true
let fail = false
let inserted
let failInsert = false
const leadSchema = readFileSync('../DB_SCHEMA.sql', 'utf8').match(/CREATE TABLE public\.lead \(([\s\S]*?)\r?\n\);/)[1]
const leadColumns = new Set([...leadSchema.matchAll(/^\s{2}(\w+)\s+(?:uuid|text|boolean|timestamp)/gm)].map(match => match[1]))
const published = { id: 'post-1', company_id: company, status: 'published', slug: 'guia-sitges',
  title: 'Guía <Sitges>', heading: 'Vivir en la costa', intro: 'Una introducción', body: '## Consejos\n\n**Hola**\n\n<script>alert(1)</script>\n\n[bad](javascript:alert(1))',
  seo_title: 'SEO "Sitges"', seo_description: 'Casas & mar', seo_og_image_url: null,
  published_at: '2026-10-01T00:00:00Z', updated_at: '2026-10-01T00:00:00Z' }
const fixtures = [published, { ...published, id: 'draft', slug: 'borrador', status: 'draft' },
  { ...published, id: 'other', slug: 'otra-empresa', company_id: 'other-company' },
  { ...published, id: 'old', slug: null }]
const originalFetch = globalThis.fetch
globalThis.fetch = async (input, init) => {
  const url = new URL(typeof input === 'string' ? input : input.url ?? String(input))
  if (fail) return Response.json({ message: 'Database unavailable', code: 'TEST' }, { status: 500 })
  if (url.pathname.endsWith('/companies')) return Response.json([{ id: company }])
  if (url.pathname.endsWith('/items')) return Response.json([])
  if (url.pathname.endsWith('/company_modules')) return Response.json([{ is_enabled: enabled }])
  if (url.pathname.endsWith('/lead')) {
    const payload = JSON.parse(init.body)
    const unknown = Object.keys(payload).filter(key => !leadColumns.has(key))
    if (unknown.length) return Response.json({ code: 'PGRST204', message: `Unknown columns: ${unknown.join(',')}` }, { status: 400 })
    if (failInsert) return Response.json({ code: 'TEST', message: 'Insert failed' }, { status: 500 })
    inserted = payload
    return new Response(null, { status: 201 })
  }
  if (url.pathname.endsWith('/blog_posts')) {
    let rows = fixtures.filter(post => post.company_id === url.searchParams.get('company_id')?.slice(3)
      && post.status === url.searchParams.get('status')?.slice(3))
    if (url.searchParams.has('slug')) {
      const filter = url.searchParams.get('slug')
      rows = filter === 'not.is.null' ? rows.filter(post => post.slug !== null) : rows.filter(post => post.slug === filter.slice(3))
    }
    return Response.json(rows)
  }
  if (url.pathname.endsWith('/blog_media')) {
    assert.equal(url.searchParams.get('post_id'), 'in.(post-1)')
    return Response.json([{ id: 'image', post_id: 'post-1', url_externa: 'https://images.example/cover.jpg',
      is_cover_image: true, alt_text: 'Costa de Sitges', sort_order: 0 }])
  }
  throw new Error(`Unexpected request ${url.pathname}`)
}
const request = body => new Request('https://regiamare.example/api/lead', { method: 'POST', body: JSON.stringify(body) })
const values = { company_id: company, name: 'Visitante', email: 'test@example.com', source_item: 'Casa · public-id',
  source_referrer: 'https://source.example', utm_source: 'newsletter', utm_medium: 'email', utm_campaign: 'octubre',
  utm_term: 'costa', utm_content: 'enlace', consent_given: true, consent_text_version: 'v1' }

test('leads fija empresa, respeta CRM y guarda atribución/consentimiento', async () => {
  assert.equal((await lead(request({ ...values, company_id: 'other-company' }))).status, 400)
  assert.equal((await lead(request(null))).status, 400)
  enabled = false
  assert.equal((await lead(request(values))).status, 503)
  enabled = true
  assert.equal((await lead(request(values))).status, 201)
  for (const key of ['company_id', 'source_item', 'source_referrer', 'consent_given', 'consent_text_version']) assert.equal(inserted[key], values[key])
  for (const key of ['source', 'medium', 'term', 'content']) assert.equal(inserted[`source_utm_${key}`], values[`utm_${key}`])
  assert.equal(inserted.source_campaign, values.utm_campaign)
  assert.equal(Object.keys(inserted).some(key => key.startsWith('utm_')), false)
  assert.equal((await lead(request({ ...values, consent_text_version: '' }))).status, 201)
  assert.equal(inserted.consent_given, false)
  assert.equal((await lead(request({ ...values, consent_given: false }))).status, 201)
  assert.equal(inserted.consent_given, false)
  inserted = undefined
  assert.equal((await lead(request({ ...values, company_website: 'bot' }))).status, 200)
  assert.equal(inserted, undefined)
  delete process.env.VITE_COMPANY_ID
  assert.equal((await lead(request(values))).status, 503)
  process.env.VITE_COMPANY_ID = company
})
test('analytics sin configuración responde 204 sin fallar al importar', async () => {
  assert.equal((await track(request({}))).status, 204)
})
test('un fallo al insertar una solicitud nunca se confirma como guardado', async () => {
  failInsert = true
  inserted = undefined
  try {
    assert.equal((await lead(request(values))).status, 500)
    assert.equal(inserted, undefined)
  } finally { failInsert = false }
})
test('cliente conserva cinco UTM de entrada y solo cuenta envíos guardados', async () => {
  await build({ entryPoints: ['src/lib/leads.ts'], bundle: true, outfile: 'node_modules/.tmp/integrations/client.mjs',
    format: 'esm', platform: 'browser', define: { 'import.meta.env.VITE_COMPANY_ID': JSON.stringify(company) } })
  const browser = new EventTarget()
  browser.location = new URL('https://regiamare.example/?utm_source=news&utm_medium=email&utm_campaign=oct&utm_term=costa&utm_content=hero')
  globalThis.window = browser
  globalThis.document = { referrer: 'https://source.example/landing' }
  const savedFetch = globalThis.fetch
  let count = 0
  let status = 201
  let payload
  browser.addEventListener('moira:lead-sent', () => { count++ })
  globalThis.fetch = async (_url, init) => { payload = JSON.parse(init.body); return new Response(null, { status }) }
  try {
    const { submitLead } = await import('../node_modules/.tmp/integrations/client.mjs')
    browser.location = new URL('https://regiamare.example/property/public-id')
    assert.equal((await submitLead(values)).ok, true)
    assert.equal(payload.source_path, '/property/public-id')
    assert.equal(payload.source_referrer, 'https://source.example/landing')
    for (const [key, value] of Object.entries({ utm_source: 'news', utm_medium: 'email', utm_campaign: 'oct', utm_term: 'costa', utm_content: 'hero' })) assert.equal(payload[key], value)
    assert.equal(count, 1)
    status = 200
    assert.equal((await submitLead(values)).ok, false)
    assert.equal(count, 1)
    status = 500
    assert.equal((await submitLead(values)).ok, false)
    assert.equal(count, 1)
  } finally {
    globalThis.fetch = savedFetch
    delete globalThis.window
    delete globalThis.document
  }
})
test('blog entrega Markdown seguro, alt y SEO en HTML inicial', async () => {
  const response = await blog(new Request('https://regiamare.example/api/blog?slug=guia-sitges'))
  assert.equal(response.status, 200)
  const html = await response.text()
  assert.match(html, /<title>SEO &quot;Sitges&quot;<\/title>/)
  assert.match(html, /rel="canonical" href="https:\/\/regiamare.example\/blog\/guia-sitges"/)
  assert.match(html, /property="og:image" content="https:\/\/images.example\/cover.jpg"/)
  assert.match(html, /<strong>Hola<\/strong>/)
  assert.match(html, /alt="Costa de Sitges"/)
  assert.doesNotMatch(html, /<script>alert|href="javascript:/)
})
test('Vercel descubre la configuración de API y el blog arranca sin bundling', async () => {
  const configPath = ts.findConfigFile('api', ts.sys.fileExists)
  assert.equal(configPath?.replaceAll('\\', '/'), 'api/tsconfig.json')
  const absoluteConfig = resolve(configPath)
  const { config, error } = ts.readConfigFile(absoluteConfig, ts.sys.readFile)
  assert.equal(error, undefined)
  const parsed = ts.parseJsonConfigFileContent(config, ts.sys, dirname(absoluteConfig), {}, absoluteConfig)
  assert.ok(parsed.fileNames.length > 0)
  assert.equal(parsed.options.jsx, ts.JsxEmit.ReactJSX)
  // El trazador de Vercel busca .ts para imports .js, pero no busca .tsx.
  // Evitar que el bundle de esbuild oculte una dependencia ausente en producción.
  const apiSource = readFileSync('api/blog.ts', 'utf8')
  for (const imported of ts.preProcessFile(apiSource).importedFiles) {
    if (!imported.fileName.startsWith('.') || !imported.fileName.endsWith('.js')) continue
    assert.ok(ts.sys.fileExists(resolve('api', imported.fileName.replace(/\.js$/, '.ts'))), imported.fileName)
  }
  const program = ts.createProgram(parsed.fileNames, {
    ...parsed.options, noEmit: false, rootDir: process.cwd(), outDir: 'node_modules/.tmp/vercel-runtime',
  })
  const emitted = program.emit()
  assert.equal(emitted.emitSkipped, false)
  const component = readFileSync('node_modules/.tmp/vercel-runtime/src/routes/Blog/BlogContent.js', 'utf8')
  assert.doesNotMatch(component, /<article/)
  const { GET } = await import('../node_modules/.tmp/vercel-runtime/api/blog.js')
  const response = await GET(new Request('https://regiamare.example/blog/guia-sitges'))
  assert.equal(response.status, 200)
  assert.match(await response.text(), /<strong>Hola<\/strong>/)
  const { GET: property } = await import('../node_modules/.tmp/vercel-runtime/api/property.js')
  assert.equal((await property(new Request('https://regiamare.example/property/inexistente'))).status, 404)
  const { GET: sitemap } = await import('../node_modules/.tmp/vercel-runtime/api/sitemap.js')
  assert.equal((await sitemap()).status, 200)
})
test('blog lista publicaciones y devuelve 404 para inexistentes, borradores y otra empresa', async () => {
  assert.equal((await blog(new Request('https://regiamare.example/api/blog'))).status, 200)
  for (const slug of ['inexistente', 'borrador', 'otra-empresa', 'INVALID']) {
    assert.equal((await blog(new Request(`https://regiamare.example/api/blog?slug=${slug}`))).status, 404)
  }
})
test('blog sin variables de dominio usa el dominio fijo del sitio', async () => {
  const saved = { site: process.env.SITE_URL, vite: process.env.VITE_SITE_URL }
  delete process.env.SITE_URL
  delete process.env.VITE_SITE_URL
  try {
    const response = await blog(new Request('https://visitor-host.example/blog/guia-sitges'))
    assert.equal(response.status, 200)
    assert.match(await response.text(), /rel="canonical" href="https:\/\/regiamare.com\/blog\/guia-sitges"/)
  } finally {
    if (saved.site === undefined) delete process.env.SITE_URL; else process.env.SITE_URL = saved.site
    if (saved.vite === undefined) delete process.env.VITE_SITE_URL; else process.env.VITE_SITE_URL = saved.vite
  }
})
test('sitemap excluye borradores, otra empresa y posts sin slug', async () => {
  const response = await blog(new Request('https://regiamare.example/api/blog?sitemap=1'))
  assert.equal(response.status, 200)
  const xml = await response.text()
  assert.match(xml, /\/blog\/guia-sitges/)
  assert.doesNotMatch(xml, /borrador|otra-empresa|\/null/)
})
test('errores de blog son 503, nunca listas vacías ni 404', async () => {
  fail = true
  assert.equal((await blog(new Request('https://regiamare.example/api/blog'))).status, 503)
  fail = false
})
test.after(() => { globalThis.fetch = originalFetch })
