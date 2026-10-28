import { readFile, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
const folder = 'docs/items-seo'
const editorial = JSON.parse(await readFile(`${folder}/proposals.editorial.json`, 'utf8'))
const snapshot = JSON.parse(await readFile(`${folder}/${editorial.snapshot}`, 'utf8'))
assert.equal(snapshot.company_id, 'eac2ccbe-cc36-40cd-bb7e-d5fe44de972d')
assert.equal(snapshot.item_type, 'regiamare_property')
assert.equal(editorial.items.length, snapshot.items.length)
const slugs = new Set()
const checks = []
const rows = await Promise.all(editorial.items.map(async item => {
  const previous = snapshot.items.find(row => row.id === item.id)
  assert.ok(previous, item.id)
  assert.ok(item.slug.length <= 120 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug))
  assert.ok(item.seo_title.length <= 70 && item.seo_description.length <= 160)
  assert.ok(!slugs.has(item.slug)); slugs.add(item.slug)
  assert.ok(!previous.slug || previous.slug === item.slug, 'No cambiar slugs existentes sin plan de redirects')
  let image = null
  if (previous.cover?.url?.startsWith('https://')) {
    try {
      const response = await fetch(previous.cover.url, { method: 'HEAD', signal: AbortSignal.timeout(15000) })
      const valid = response.ok && response.url.startsWith('https://') && response.headers.get('content-type')?.startsWith('image/')
      checks.push({ id: item.id, url: previous.cover.url, status: response.status, valid: !!valid })
      if (valid) image = previous.cover.url
    } catch { checks.push({ id: item.id, url: previous.cover.url, valid: false }) }
  }
  return { id: item.id, company_id: snapshot.company_id, item_type: snapshot.item_type,
    slug: item.slug, seo_title: item.seo_title, seo_description: item.seo_description, seo_og_image_url: image }
}))
const csv = value => value == null ? '' : `"${String(value).replaceAll('"', '""')}"`
const keys = ['id', 'company_id', 'item_type', 'slug', 'seo_title', 'seo_description', 'seo_og_image_url']
await writeFile(`${folder}/proposals.csv`, [keys.join(','), ...rows.map(row => keys.map(key => csv(row[key])).join(','))].join('\n') + '\n')
await writeFile(`${folder}/proposals.json`, JSON.stringify({ status: 'PENDIENTE DE REVISIÓN; NO APLICADO', snapshot: editorial.snapshot, items: rows, image_checks: checks }, null, 2))
const quote = value => value == null ? 'NULL' : `'${String(value).replaceAll("'", "''")}'`
const values = rows.map(row => {
  const old = snapshot.items.find(item => item.id === row.id)
  return '(' + [...keys.map(key => row[key]), old.updated_at, old.slug, old.seo_title, old.seo_description, old.seo_og_image_url].map(quote).join(', ') + ')'
}).join(',\n')
const template = await readFile(`${folder}/ITEMS_SEO_VALUES_TEMPLATE.sql`, 'utf8')
await writeFile(`${folder}/PROPOSED_ITEMS_SEO_VALUES.sql`, template.replace('__REVIEWED_VALUES__', () => values).replaceAll('__EXPECTED_COUNT__', String(rows.length)))
await writeFile(`${folder}/PROPOSALS.md`, `# Propuesta SEO — pendiente de aprobación\n\nPreparada desde el snapshot público aprobado. No aplicada en Supabase.\n\n| Propiedad | Slug propuesto | Título SEO | Descripción SEO | OG |\n|---|---|---|---|---|\n${rows.map(row => `| ${snapshot.items.find(item => item.id === row.id).title.trim().replaceAll('|', '\\|')} | ${row.slug} | ${row.seo_title} | ${row.seo_description} | ${row.seo_og_image_url ? 'Portada HTTPS comprobada' : 'NULL'} |`).join('\n')}\n\nNo se cambia ningún slug anterior: los ocho estaban vacíos. Las fichas UUID se conservan y redirigirán 308 a estos slugs una vez cargados. Revisar CSV y SQL antes de ejecutar; el SQL termina en ROLLBACK. La plantilla local reproduce las guardas del roadmap porque la plantilla del repositorio CRM no está incluida aquí.\n`)
console.log(JSON.stringify({ proposed: rows.length, verified_images: rows.filter(row => row.seo_og_image_url).length, sql_executed: false }))
