import { createClient } from '@supabase/supabase-js'
import { readFile } from 'node:fs/promises'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { blogSeo, loadBlog } from '../src/lib/blog.js'
import { GET as loadSitemap } from './sitemap.js'
import BlogContent from '../src/routes/Blog/BlogContent.js'

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)

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
    const siteUrl = process.env.SITE_URL ?? process.env.VITE_SITE_URL
    if (!companyId || !anonKey || !supabaseUrl || !siteUrl) throw new Error('Missing blog configuration')
    const origin = new URL(siteUrl)
    if (origin.protocol !== 'https:') throw new Error('SITE_URL must use HTTPS')
    const client = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } })
    if (sitemap) {
      return loadSitemap()
    }
    const posts = await loadBlog(client, companyId, { slug, page })
    const missing = slug !== undefined && posts.length === 0
    const seo = blogSeo(slug ? posts[0] : undefined)
    const canonical = new URL(slug ? `/blog/${encodeURIComponent(slug)}` : '/blog', origin)
    if (!slug && page > 1) canonical.searchParams.set('page', String(page))
    const title = missing ? 'Página no encontrada | Regia Mare Properties' : seo.title
    const meta = `<title>${escapeHtml(title)}</title>
      <meta name="description" content="${escapeHtml(seo.description)}" />
      ${missing ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${escapeHtml(canonical.href)}" />`}
      <meta property="og:title" content="${escapeHtml(title)}" />
      <meta property="og:description" content="${escapeHtml(seo.description)}" />
      <meta property="og:url" content="${escapeHtml(canonical.href)}" />
      <meta property="og:type" content="${slug ? 'article' : 'website'}" />
      ${seo.image && !missing ? `<meta property="og:image" content="${escapeHtml(seo.image)}" />` : ''}`
    const content = missing ? '<h1>Esta página no existe</h1><a href="/blog">Volver al blog</a>'
      : renderToStaticMarkup(createElement(BlogContent, { posts, detail: !!slug, page }))
    const template = await readFile(`${process.cwd()}/dist/index.html`, 'utf8')
    const html = template.replace('<html lang="en">', '<html lang="es">')
      .replace(/<title>[^<]*<\/title>/, meta.replace(/<(meta|link) /g, '<$1 data-blog-seo '))
      .replace('<div id="root"></div>', `<div id="root"><header><a href="/">Regia Mare Properties</a></header><main class="blog-page container">${content}</main></div>`)
    return new Response(html, { status: missing ? 404 : 200, headers: {
      'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache',
    } })
  } catch (error) {
    console.error('[blog] load failed', error instanceof Error ? error.message : 'Database error')
    return new Response('No se ha podido cargar el blog. Inténtalo de nuevo más tarde.', { status: 503, headers: { 'Retry-After': '60' } })
  }
}

export const config = { runtime: 'nodejs' }
