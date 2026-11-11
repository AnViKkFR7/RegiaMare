import type { SeoMetadata } from './seo'
import { safeJsonLd, seoImage } from './seo'
export function applySeo(meta: SeoMetadata) {
  document.querySelectorAll('[data-seo],[data-item-seo],[data-blog-seo]').forEach(element => element.remove())
  document.title = meta.title
  document.documentElement.lang = meta.language || document.documentElement.lang || 'es'
  const image = seoImage(meta.image)
  const tags = [['name', 'description', meta.description], ['name', 'robots', meta.index === false ? 'noindex,follow' : 'index,follow,max-image-preview:large'],
    ['property', 'og:site_name', 'Regia Mare Properties'], ['property', 'og:locale', 'es_ES'], ['property', 'og:type', meta.type || 'website'],
    ['property', 'og:title', meta.title], ['property', 'og:description', meta.description],
    ['name', 'twitter:card', image ? 'summary_large_image' : 'summary'], ['name', 'twitter:title', meta.title], ['name', 'twitter:description', meta.description],
    ...(meta.canonical ? [['property', 'og:url', meta.canonical]] : []), ...(image ? [['property', 'og:image', image], ['name', 'twitter:image', image]] : [])]
  for (const [attribute, name, content] of tags) {
    const element = document.createElement('meta')
    element.setAttribute(attribute, name); element.content = content; element.dataset.seo = ''; document.head.append(element)
  }
  if (meta.canonical) {
    const link = document.createElement('link'); link.rel = 'canonical'; link.href = meta.canonical; link.dataset.seo = ''; document.head.append(link)
  }
  if (meta.graph?.length) {
    const script = document.createElement('script'); script.type = 'application/ld+json'; script.dataset.seo = ''
    script.textContent = safeJsonLd(meta.graph); document.head.append(script)
  }
}
