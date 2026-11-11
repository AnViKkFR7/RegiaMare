import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import { loadBlog } from '../../lib/blog'
import { blogMetadata } from '../../lib/seo'
import { applySeo } from '../../lib/seoHead'
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
    if (result?.key !== key || !result.posts || ((slug || page > 1) && !result.posts.length)) {
      applySeo({ title: result?.error ? 'Error de carga | Regia Mare Properties' : 'Blog | Regia Mare Properties', description: '', index: false })
      return
    }
    const metadata = blogMetadata(slug ? result.posts[0] : undefined, page, siteOrigin(import.meta.env.VITE_SITE_URL))
    metadata.index = result.posts.length > 0
    applySeo(metadata)
  }, [result, key, slug, page])
  if (result?.key === key && (slug || page > 1) && result.posts?.length === 0) return <NotFound language={language} />
  return <div className="blog-page container">
    {result?.key !== key ? <p role="status">Cargando…</p>
      : result.error ? <p role="alert">No se ha podido cargar el blog. <button onClick={() => window.location.reload()}>Reintentar</button></p>
      : <BlogContent posts={result.posts ?? []} detail={!!slug} page={page} />}
  </div>
}
