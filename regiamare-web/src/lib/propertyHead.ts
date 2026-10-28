import type { Property } from '../types'
import { indexableProperty, propertyPath, propertySeo } from './properties'

export function setPropertyHead(property: Property | null, title = 'Propiedad no encontrada | Regia Mare Properties') {
  document.querySelectorAll('[data-item-seo]').forEach(element => element.remove())
  const seo = property ? propertySeo(property) : null
  document.title = seo?.title ?? title
  const canonical = property && indexableProperty(property)
    ? new URL(propertyPath(property), import.meta.env.VITE_SITE_URL || window.location.origin).href : null
  const tags = [['name', 'robots', canonical ? 'index,follow' : 'noindex,follow'],
    ['name', 'description', seo?.description ?? ''], ['property', 'og:title', document.title],
    ['property', 'og:description', seo?.description ?? ''], ['property', 'og:type', 'website'],
    ...(canonical ? [['property', 'og:url', canonical]] : []),
    ...(seo?.image ? [['property', 'og:image', seo.image]] : [])]
  for (const [attribute, name, content] of tags) {
    const tag = document.createElement('meta')
    tag.setAttribute(attribute, name); tag.content = content; tag.dataset.itemSeo = ''
    document.head.append(tag)
  }
  if (canonical) {
    const link = document.createElement('link')
    link.rel = 'canonical'; link.href = canonical; link.dataset.itemSeo = ''
    document.head.append(link)
  }
}
