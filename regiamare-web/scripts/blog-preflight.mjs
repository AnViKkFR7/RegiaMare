import { createClient } from '@supabase/supabase-js'

try { process.loadEnvFile('.env') } catch { /* En Vercel las variables ya están cargadas. */ }
const company = process.env.VITE_COMPANY_ID
const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY
if (!company || !url || !key) throw new Error('Faltan VITE_COMPANY_ID, VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY')
const client = createClient(url, key, { auth: { persistSession: false } })
const seen = new Set()
const invalid = []
for (let start = 0; ; start += 1000) {
  const { data, error } = await client.from('blog_posts').select('id,slug')
    .eq('company_id', company).eq('status', 'published').order('id').range(start, start + 999)
  if (error) throw new Error(`No se pudo auditar el blog: ${error.message}`)
  for (const post of data ?? []) {
    const slug = post.slug?.toLowerCase()
    if (!slug || slug.length > 120 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug) || seen.has(slug)) invalid.push(post.id)
    if (slug) seen.add(slug)
  }
  if (!data || data.length < 1000) break
}
if (invalid.length) {
  console.error('Corregir los slugs de estos posts antes de publicar:', invalid.join(', '))
  process.exitCode = 1
} else console.log(`Preflight correcto: ${seen.size} publicaciones con slugs válidos y únicos.`)
