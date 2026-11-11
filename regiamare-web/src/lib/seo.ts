import type { Property } from '../types/index.js'
import type { BlogPost } from './blog.js'
import { httpsUrl, blogSeo } from './blog.js'
import { propertyPath, propertySeo, indexableProperty } from './properties.js'
import { siteOrigin } from './siteConfig.js'

export interface SeoMetadata {
  title: string; description: string; canonical?: string; image?: string
  index?: boolean; type?: 'website' | 'article'; language?: string; graph?: Record<string, unknown>[]
}
export const BRAND = {
  name: 'Regia Mare Properties', phone: '+34 669 887 791', email: 'info@regiamare.com',
  instagram: 'https://www.instagram.com/regiamareproperties/',
  offices: [
    { name: 'Sitges', street: "Carrer d'Antoni Gaudí, 18", locality: 'Sitges', region: 'Barcelona', postcode: '08870' },
    { name: 'Coma-ruga', street: 'Avinguda Palfuriana, 126', locality: 'Coma-ruga', region: 'Tarragona', postcode: '43880' },
  ],
}
export const STATIC_SEO: Record<string, { title: string; description: string; name: string; index?: boolean }> = {
  '/': { title: 'Inmobiliaria en Sitges y Coma-ruga | Regia Mare Properties', name: 'Inicio',
    description: 'Compra, venta y alquiler de viviendas en Sitges, Barcelona y la Costa Dorada. Asesoramiento inmobiliario con oficinas en Sitges y Coma-ruga.' },
  '/services': { title: 'Servicios inmobiliarios en Sitges y Coma-ruga | Regia Mare', name: 'Servicios',
    description: 'Asesoramiento para comprar, vender o alquilar, valoración de inmuebles, presentación de viviendas y acompañamiento al comprador internacional.' },
  '/purchases': { title: 'Viviendas en Sitges, Barcelona y Costa Dorada | Regia Mare', name: 'Propiedades',
    description: 'Consulta las viviendas publicadas por Regia Mare Properties. Fotografías, características y contacto directo para preguntar por cada inmueble.' },
  '/sales': { title: 'Vender una vivienda en Sitges y Coma-ruga | Regia Mare', name: 'Vender una propiedad',
    description: 'Solicita asesoramiento para vender tu vivienda. Contacta con Regia Mare Properties para valorar el inmueble y preparar su comercialización.' },
  '/about': { title: 'Regia Mare Properties | Inmobiliaria en Sitges y Coma-ruga', name: 'Quiénes somos',
    description: 'Conoce Regia Mare Properties, nuestros servicios inmobiliarios y las oficinas de Sitges y Coma-ruga. Contacto por teléfono, email y formulario.' },
  '/privacy': { title: 'Política de privacidad | Regia Mare Properties', name: 'Privacidad', description: 'Información sobre el tratamiento de datos personales y los derechos de las personas usuarias.', index: false },
  '/legal': { title: 'Aviso legal | Regia Mare Properties', name: 'Aviso legal', description: 'Información legal de Regia Mare Properties y condiciones de uso de este sitio web.', index: false },
  '/cookies': { title: 'Política de cookies | Regia Mare Properties', name: 'Cookies', description: 'Información sobre cookies y preferencias de medición de este sitio web.', index: false },
}

export function businessGraph(origin = siteOrigin()): Record<string, unknown>[] {
  return [
    { '@type': 'RealEstateAgent', '@id': `${origin}/#agency`, name: BRAND.name, alternateName: 'Regiamare',
      url: origin, telephone: BRAND.phone, email: BRAND.email, logo: `${origin}/logo-header.png`,
      image: `${origin}/hero-image.jpg`, sameAs: [BRAND.instagram],
      address: { '@type': 'PostalAddress', streetAddress: BRAND.offices[0].street, addressLocality: 'Sitges', addressRegion: 'Barcelona', postalCode: '08870', addressCountry: 'ES' },
      location: BRAND.offices.map(office => ({ '@type': 'Place', name: `Regia Mare Properties · ${office.name}`,
        address: { '@type': 'PostalAddress', streetAddress: office.street, addressLocality: office.locality,
          addressRegion: office.region, postalCode: office.postcode, addressCountry: 'ES' } })),
      areaServed: ['Sitges', 'Barcelona', 'Coma-ruga', 'Sant Pere de Ribes', 'Vilanova i la Geltrú'].map(name => ({ '@type': 'Place', name })) },
    { '@type': 'WebSite', '@id': `${origin}/#website`, url: origin, name: BRAND.name, inLanguage: 'es', publisher: { '@id': `${origin}/#agency` } },
  ]
}
export function breadcrumbGraph(entries: { name: string; url: string }[], origin = siteOrigin()): Record<string, unknown> {
  return { '@type': 'BreadcrumbList', itemListElement: entries.map((entry, index) => ({ '@type': 'ListItem', position: index + 1,
    name: entry.name, item: new URL(entry.url, origin).href })) }
}
export function staticMetadata(path: string, origin = siteOrigin()): SeoMetadata {
  const page = STATIC_SEO[path]
  if (!page) return { title: 'Página no encontrada | Regia Mare Properties', description: 'La página solicitada no existe.', index: false, graph: [] }
  const canonical = new URL(path, origin).href
  const graph = [...businessGraph(origin), { '@type': path === '/about' ? 'AboutPage' : 'WebPage', '@id': `${canonical}#webpage`,
    url: canonical, name: page.title, description: page.description, inLanguage: 'es', isPartOf: { '@id': `${origin}/#website` },
    about: { '@id': `${origin}/#agency` } }]
  if (path !== '/') graph.push(breadcrumbGraph([{ name: 'Inicio', url: '/' }, { name: page.name, url: path }], origin))
  if (path === '/services') {
    for (const [key, name] of [['sales', 'Venta de propiedades'], ['valuation', 'Valoración de inmuebles'],
      ['staging', 'Presentación de viviendas'], ['rental', 'Alquiler de propiedades'], ['international', 'Asesoramiento internacional'], ['legal', 'Asesoramiento legal']]) {
      graph.push({ '@type': 'Service', '@id': `${canonical}#${key}`, name, url: canonical, provider: { '@id': `${origin}/#agency` } })
    }
  }
  return { ...page, canonical, image: `${origin}/hero-image.jpg`, index: page.index !== false, graph }
}
export function propertyMetadata(property: Property, origin = siteOrigin()): SeoMetadata {
  const seo = propertySeo(property)
  if (!indexableProperty(property)) return { ...seo, index: false }
  const canonical = new URL(propertyPath(property), origin).href
  const a = property.attributes
  const type = /casa|villa|chalet/i.test(a.property_type || '') ? 'House'
    : /piso|apartamento|ático|duplex|dúplex|planta baja/i.test(a.property_type || '') ? 'Apartment' : 'Place'
  const home: Record<string, unknown> = { '@type': type, '@id': `${canonical}#property`, name: property.title, url: canonical,
    ...(seo.image ? { image: seo.image } : {}),
    ...(a.city ? { address: { '@type': 'PostalAddress', addressLocality: a.city, ...(a.province ? { addressRegion: a.province } : {}), addressCountry: 'ES' } } : {}) }
  if (type !== 'Place') {
    if (Number.isFinite(a.bedrooms) && a.bedrooms >= 0) home.numberOfBedrooms = a.bedrooms
    if (Number.isFinite(a.built_surface) && a.built_surface > 0) home.floorSize = { '@type': 'QuantitativeValue', value: a.built_surface, unitCode: 'MTK' }
  }
  const listing: Record<string, unknown> = { '@type': 'RealEstateListing', '@id': `${canonical}#listing`, url: canonical,
    name: seo.title, description: seo.description, inLanguage: 'es', mainEntity: { '@id': `${canonical}#property` },
    isPartOf: { '@id': `${origin}/#website` }, publisher: { '@id': `${origin}/#agency` } }
  // No inferir disponibilidad de "published" ni inventar la periodicidad de un alquiler.
  if (a.operation_type === 'Venta' && !a.vendido && !a.reservada && Number.isFinite(a.price) && a.price > 0) {
    listing.offers = { '@type': 'Offer', price: a.price, priceCurrency: 'EUR', url: canonical, seller: { '@id': `${origin}/#agency` } }
  }
  return { ...seo, canonical, index: true, graph: [...businessGraph(origin), listing, home,
    breadcrumbGraph([{ name: 'Inicio', url: '/' }, { name: 'Propiedades', url: '/purchases' }, { name: property.title, url: propertyPath(property) }], origin)] }
}
export function blogMetadata(post: BlogPost | undefined, page = 1, origin = siteOrigin()): SeoMetadata {
  const seo = blogSeo(post)
  const canonical = new URL(post ? `/blog/${post.slug}` : '/blog', origin)
  if (!post && page > 1) canonical.searchParams.set('page', String(page))
  const node = post ? { '@type': 'BlogPosting', '@id': `${canonical.href}#article`, headline: post.title,
    description: seo.description, mainEntityOfPage: canonical.href, publisher: { '@id': `${origin}/#agency` },
    ...(post.published_at ? { datePublished: post.published_at } : {}),
    ...(post.updated_at ? { dateModified: post.updated_at } : {}), ...(seo.image ? { image: seo.image } : {}) }
    : { '@type': 'CollectionPage', '@id': `${canonical.href}#webpage`, name: seo.title, url: canonical.href }
  return { ...seo, canonical: canonical.href, type: post ? 'article' : 'website', index: true,
    graph: [...businessGraph(origin), node, breadcrumbGraph([{ name: 'Inicio', url: '/' }, { name: 'Blog', url: '/blog' },
      ...(post ? [{ name: post.title, url: `/blog/${post.slug}` }] : [])], origin)] }
}
export const safeJsonLd = (graph: Record<string, unknown>[]) => JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
  .replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
export const seoImage = (value?: string) => httpsUrl(value)
