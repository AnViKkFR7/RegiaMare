import { createClient } from '@supabase/supabase-js'
import { build } from 'esbuild'
import { mkdir, writeFile } from 'node:fs/promises'

try { process.loadEnvFile('.env') } catch { /* Variables ya configuradas en CI. */ }
const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY
if (!url || !key) throw new Error('Faltan URL y clave anon de Supabase')
await build({ entryPoints: ['src/lib/properties.ts'], bundle: true, packages: 'external',
  platform: 'node', format: 'esm', outfile: 'node_modules/.tmp/items-preflight.mjs' })
const { loadPublicProperties, PROPERTY_COMPANY_ID, PROPERTY_ITEM_TYPE, UUID_PATTERN } = await import('../node_modules/.tmp/items-preflight.mjs')
if (process.env.VITE_COMPANY_ID !== PROPERTY_COMPANY_ID) throw new Error('La empresa configurada no coincide con el alcance de RegiaMare')
const client = createClient(url, key, { auth: { persistSession: false } })
const properties = await loadPublicProperties(client)
// Solo slugs públicos de la misma empresa: no consultar otros tenants o estados.
const slugs = new Map()
for (let offset = 0; ; offset += 500) {
  const { data, error } = await client.from('items').select('id,item_type,slug')
    .eq('company_id', PROPERTY_COMPANY_ID).eq('status', 'published').order('id').range(offset, offset + 499)
  if (error) throw new Error(`No se pudo verificar el espacio de slugs: ${error.message}`)
  for (const item of data ?? []) {
    if (!item.slug) continue
    const normalized = item.slug.toLowerCase()
    slugs.set(normalized, [...(slugs.get(normalized) ?? []), { id: item.id, item_type: item.item_type }])
  }
  if (!data || data.length < 500) break
}
const publicKeys = ['operation_type', 'property_type', 'province', 'city', 'zone', 'built_surface',
  'usable_surface', 'plot_surface', 'bedrooms', 'bathrooms', 'condition', 'description', 'price', 'vendido', 'reservada']
const items = properties.map(property => ({ id: property.id, company_id: property.company_id,
  item_type: property.item_type, title: property.title, summary: property.description ?? null,
  slug: property.slug ?? null, seo_title: property.seo_title ?? null, seo_description: property.seo_description ?? null,
  seo_og_image_url: property.seo_og_image_url ?? null, updated_at: property.updated_at,
  attributes: Object.fromEntries(publicKeys.filter(key => property.attributes[key] !== undefined).map(key => [key, property.attributes[key]])),
  cover: property.media.find(image => image.media_type === 'image' && image.is_primary)
    ?? property.media.find(image => image.media_type === 'image') ?? null,
}))
const issues = items.flatMap(item => {
  const errors = []
  if (!item.slug) errors.push('missing_slug')
  else if (item.slug.length > 120 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) || UUID_PATTERN.test(item.slug)) errors.push('invalid_slug')
  if (item.slug && slugs.get(item.slug.toLowerCase())?.length > 1) errors.push('duplicate_slug')
  if (!item.seo_title) errors.push('missing_seo_title')
  else if (item.seo_title.length > 70) errors.push('invalid_seo_title')
  if (!item.seo_description) errors.push('missing_seo_description')
  else if (item.seo_description.length > 160) errors.push('invalid_seo_description')
  if (item.seo_og_image_url && (!/^https:\/\//i.test(item.seo_og_image_url) || item.seo_og_image_url.length > 2048)) errors.push('invalid_og_image')
  return errors.length ? [{ id: item.id, issues: errors }] : []
})
const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
await mkdir('docs/items-seo/exports', { recursive: true })
const snapshot = `docs/items-seo/exports/published-${timestamp}.json`
await writeFile(snapshot, JSON.stringify({ exported_at: new Date().toISOString(), company_id: PROPERTY_COMPANY_ID,
  item_type: PROPERTY_ITEM_TYPE, access: 'anon; published only', items }, null, 2), { flag: 'wx' })
const report = `docs/items-seo/exports/preflight-${timestamp}.json`
await writeFile(report, JSON.stringify({ count: items.length, snapshot, issues,
  public_collisions: [...slugs.values()].filter(group => group.length > 1),
  limitations: 'Anon no permite auditar colisiones con borradores/archivados. Ejecutar ITEMS_SEO_PREFLIGHT.sql con el responsable antes del lote SQL.' }, null, 2), { flag: 'wx' })
console.log(JSON.stringify({ count: items.length, with_issues: issues.length, snapshot, report }))
