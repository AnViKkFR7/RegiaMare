import { staticPages } from '../server/static-pages.generated.js'
export async function GET(req: Request) {
  const url = new URL(req.url)
  const path = url.pathname === '/api/page' ? url.searchParams.get('path') || '/' : url.pathname
  const page = staticPages[path] || staticPages['*']
  if (!page) return new Response('Build de páginas no disponible', { status: 503, headers: { 'X-Robots-Tag': 'noindex' } })
  return new Response(page.html, { status: page.status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=0, must-revalidate',
      ...(page.index ? {} : { 'X-Robots-Tag': 'noindex' }) } })
}
export const config = { runtime: 'nodejs' }
