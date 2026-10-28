import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import { loadBlog, blogSeo } from '../../lib/blog'
import { siteOrigin } from '../../lib/siteConfig'
import type { BlogPost } from '../../lib/blog'
import type { Language } from '../../types'
import BlogContent from './BlogContent'
import NotFound from '../NotFound/NotFound'
import './Blog.css'

export default function Blog({ language }: { language: Language }) {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const page = Math.max(1, Math.min(10000, Number(params.get('page')) || 1)) | 0
  const [result, setResult] = useState<{ key: string; posts?: BlogPost[]; error?: boolean } | null>(null)
  const key = `${slug ?? ''}:${page}`
  useEffect(() => {
    let active = true
    loadBlog(supabase, import.meta.env.VITE_COMPANY_ID, { slug, page }).then(
      posts => { if (active) setResult({ key, posts }) },
      () => { if (active) setResult({ key, error: true }) },
    )
    return () => { active = false }
  }, [slug, page, key])
  useEffect(() => {
    if (result?.key !== key || !result.posts || (slug && !result.posts.length)) return
    const seo = blogSeo(slug ? result.posts[0] : undefined)
    document.title = seo.title
    document.querySelectorAll('[data-blog-seo]').forEach(element => element.remove())
    const baseUrl = siteOrigin(import.meta.env.VITE_SITE_URL)
    const canonical = new URL(slug ? `/blog/${slug}` : '/blog', baseUrl)
    if (!slug && page > 1) canonical.searchParams.set('page', String(page))
    const tags = [
      ['name', 'description', seo.description], ['property', 'og:title', seo.title],
      ['property', 'og:description', seo.description], ['property', 'og:url', canonical.href],
      ['property', 'og:type', slug ? 'article' : 'website'],
      ...(seo.image ? [['property', 'og:image', seo.image]] : []),
    ]
    for (const [attribute, name, content] of tags) {
      const meta = document.createElement('meta')
      meta.setAttribute(attribute, name); meta.content = content; meta.dataset.blogSeo = ''
      document.head.append(meta)
    }
    const link = document.createElement('link')
    link.rel = 'canonical'; link.href = canonical.href; link.dataset.blogSeo = ''
    document.head.append(link)
    return () => { document.querySelectorAll('[data-blog-seo]').forEach(element => element.remove()) }
  }, [result, key, slug, page])
  if (result?.key === key && slug && result.posts?.length === 0) return <NotFound language={language} />
  return <div className="blog-page container">
    {result?.key !== key ? <p role="status">Cargando…</p>
      : result.error ? <p role="alert">No se ha podido cargar el blog. <button onClick={() => window.location.reload()}>Reintentar</button></p>
      : <BlogContent posts={result.posts ?? []} detail={!!slug} page={page} />}
  </div>
}
