import { createClient } from '@supabase/supabase-js'
import { propertyHtml } from '../server/page.js'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { loadBlog } from '../src/lib/blog.js'
import { GET as loadSitemap } from './sitemap.js'
import { siteOrigin } from '../src/lib/siteConfig.js'
import BlogContent from '../src/routes/Blog/BlogContent.js'
import { blogMetadata } from '../src/lib/seo.js'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const sitemap = url.pathname === '/sitemap.xml' || url.searchParams.get('sitemap') === '1'
  const slug = url.pathname.startsWith('/blog/')
    ? url.pathname.slice('/blog/'.length)
    : url.searchParams.get('slug') ?? undefined
  const page = Math.max(1, Math.min(10000, Number(url.searchParams.get('page')) || 1)) | 0
  try {
    const companyId = process.env.VITE_COMPANY_ID
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY
    const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
    if (!companyId || !anonKey || !supabaseUrl) throw new Error('Missing blog configuration')
    const origin = siteOrigin(process.env.SITE_URL?.trim() || process.env.VITE_SITE_URL?.trim())
    const client = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } })
    if (sitemap) {
      return loadSitemap()
    }
    const posts = await loadBlog(client, companyId, { slug, page })
    const missing = (slug !== undefined || page > 1) && posts.length === 0
    const metadata = missing ? { title: 'Página no encontrada | Regia Mare Properties', description: '', index: false }
      : blogMetadata(slug ? posts[0] : undefined, page, origin)
    if (!slug && !posts.length) metadata.index = false
    const content = missing ? '<h1>Esta página no existe</h1><a href="/blog">Volver al blog</a>'
      : renderToStaticMarkup(createElement(BlogContent, { posts, detail: !!slug, page }))
    return await propertyHtml({ title: metadata.title, metadata, index: metadata.index,
      content: `<main class="blog-page container">${content}</main>`, status: missing ? 404 : 200 })
  } catch (error) {
    console.error('[blog] load failed', error instanceof Error ? error.message : 'Database error')
    return new Response('No se ha podido cargar el blog. Inténtalo de nuevo más tarde.', { status: 503, headers: { 'Retry-After': '60' } })
  }
}

export const config = { runtime: 'nodejs' }
