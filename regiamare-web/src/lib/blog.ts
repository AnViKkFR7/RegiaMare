import type { SupabaseClient } from '@supabase/supabase-js'

export interface BlogMedia {
  id: string; post_id: string; url_externa: string; alt_text: string | null
  title: string | null; sort_order: number; is_cover_image: boolean
}
export interface BlogPost {
  id: string; title: string; heading: string | null; intro: string | null; body: string
  slug: string; seo_title: string | null; seo_description: string | null
  seo_og_image_url: string | null; published_at: string | null; updated_at: string
  media: BlogMedia[]; cover: BlogMedia | null
}
export const BLOG_PAGE_SIZE = 12
export const validSlug = (slug: string) => slug.length <= 120 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
export const httpsUrl = (value: string | null | undefined) => {
  try { return value && new URL(value).protocol === 'https:' ? value : undefined } catch { return undefined }
}
const columns = 'id,title,heading,intro,body,slug,seo_title,seo_description,seo_og_image_url,published_at,updated_at'

export async function loadBlog(client: SupabaseClient, companyId: string, options: { slug?: string; page?: number } = {}) {
  if (!companyId) throw new Error('Missing company configuration')
  let query = client.from('blog_posts').select(columns)
    .eq('company_id', companyId).eq('status', 'published')
  if (options.slug !== undefined) {
    if (!validSlug(options.slug)) return []
    const { data, error } = await query.eq('slug', options.slug).maybeSingle()
    if (error) throw error
    return attachMedia(client, data ? [data] : [])
  }
  const start = ((options.page ?? 1) - 1) * BLOG_PAGE_SIZE
  query = query.not('slug', 'is', null).order('published_at', { ascending: false }).order('id', { ascending: false })
    .range(start, start + BLOG_PAGE_SIZE)
  const { data, error } = await query
  if (error) throw error
  return attachMedia(client, (data ?? []).filter(post => validSlug(post.slug)))
}

async function attachMedia(client: SupabaseClient, posts: Omit<BlogPost, 'media' | 'cover'>[]): Promise<BlogPost[]> {
  if (!posts.length) return []
  const { data, error } = await client.from('blog_media')
    .select('id,post_id,url_externa,title,alt_text,sort_order,is_cover_image')
    .in('post_id', posts.map(post => post.id)).eq('file_type', 'image').order('sort_order')
  if (error) throw error
  return posts.map(post => {
    const media = ((data ?? []) as BlogMedia[]).filter(image => image.post_id === post.id)
    return { ...post, media, cover: media.find(image => image.is_cover_image) ?? null }
  })
}

export function blogSeo(post?: BlogPost) {
  return {
    title: post?.seo_title || post?.title || 'Blog | Regia Mare Properties',
    description: post?.seo_description || post?.intro || post?.heading || 'Actualidad y consejos inmobiliarios de Regia Mare Properties.',
    image: httpsUrl(post?.seo_og_image_url) || httpsUrl(post?.cover?.url_externa),
  }
}
