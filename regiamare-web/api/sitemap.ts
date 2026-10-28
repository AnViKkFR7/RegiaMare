import { publicSite, escapeHtml } from '../server/page.js'
import { publicPropertiesQuery, indexableProperty, propertyPath, PROPERTY_COMPANY_ID } from '../src/lib/properties.js'
import { validSlug } from '../src/lib/blog.js'

export async function GET() {
  try {
    const { client, origin } = publicSite()
    const paths = new Set(['/', '/services', '/purchases', '/sales', '/about', '/blog'])
    for (let start = 0; ; start += 500) {
      const { data, error } = await publicPropertiesQuery(client, 'id,slug').order('id').range(start, start + 499)
        .returns<{ id: string; slug: string | null }[]>()
      if (error) throw error
      for (const item of data ?? []) if (indexableProperty(item)) paths.add(propertyPath(item))
      if (!data || data.length < 500) break
    }
    for (let start = 0; ; start += 500) {
      const { data, error } = await client.from('blog_posts').select('slug').eq('company_id', PROPERTY_COMPANY_ID)
        .eq('status', 'published').not('slug', 'is', null).order('id').range(start, start + 499)
      if (error) throw error
      for (const post of data ?? []) if (validSlug(post.slug)) paths.add(`/blog/${post.slug}`)
      if (!data || data.length < 500) break
    }
    // updated_at también cambia por mantenimiento: omitir lastmod hasta contar
    // con una fecha que represente únicamente cambios editoriales.
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...paths].map(path => `<url><loc>${escapeHtml(new URL(path, origin).href)}</loc></url>`).join('')}</urlset>`,
      { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'no-store' } })
  } catch {
    return new Response('No se ha podido cargar el sitemap.', { status: 503,
      headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex', 'Retry-After': '60' } })
  }
}
export const config = { runtime: 'nodejs' }
