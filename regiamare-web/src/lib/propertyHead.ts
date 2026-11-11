import type { Property } from '../types'
import { propertyMetadata } from './seo'
import { applySeo } from './seoHead'
import { siteOrigin } from './siteConfig'

export function setPropertyHead(property: Property | null, title = 'Propiedad no encontrada | Regia Mare Properties') {
  applySeo(property ? propertyMetadata(property, siteOrigin(import.meta.env.VITE_SITE_URL)) : { title, description: '', index: false })
}
