import { mkdir, writeFile } from 'node:fs/promises'
const origin = new URL(process.argv[2] || 'https://regiamare.com').origin
const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text()
const property = [...sitemap.matchAll(/<loc>([^<]+\/property\/[^<]+)<\/loc>/g)][0]?.[1]
const paths = ['/', '/services', '/purchases', '/sales', '/about', '/blog', '/robots.txt', '/llms.txt', '/pagina-inexistente-seo-audit']
if (property) paths.push(new URL(property).pathname)
const results = []
for (const path of paths) {
  const response = await fetch(`${origin}${path}`)
  const body = await response.text()
  const schemas = []
  for (const match of body.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g)) {
    try { const schema = JSON.parse(match[1]); schemas.push(...(schema['@graph'] || [schema]).map(node => node['@type'])) }
    catch { schemas.push('INVALID_JSON') }
  }
  results.push({ path, status: response.status, contentType: response.headers.get('content-type'),
    title: body.match(/<title>([^<]*)<\/title>/)?.[1] || null,
    description: body.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/)?.[1] || null,
    canonical: body.match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/)?.[1] || null,
    h1: (body.match(/<h1(?:\s|>)/g) || []).length, schemas,
    ...(path.endsWith('.txt') ? { plainText: !body.trimStart().startsWith('<'), sample: body.slice(0, 160) } : {}) })
}
const aiResponse = await fetch(origin, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot)' } })
const report = { checked_at: new Date().toISOString(), origin, ai_search_home_status: aiResponse.status, results }
await mkdir('docs/seo', { recursive: true })
const path = `docs/seo/audit-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
await writeFile(path, JSON.stringify(report, null, 2), { flag: 'wx' })
console.log(JSON.stringify({ report: path, ...report }))
