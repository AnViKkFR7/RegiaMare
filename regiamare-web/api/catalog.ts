import { publicSite, propertyHtml, escapeHtml as escape } from '../server/page.js'
import { loadPublicProperties, propertyPath, indexableProperty } from '../src/lib/properties.js'
import { staticMetadata } from '../src/lib/seo.js'

export async function GET(req: Request) {
  try {
    const { client, origin } = publicSite()
    const url = new URL(req.url)
    const value = url.searchParams.get('page') || '1'
    const page = /^[1-9]\d{0,3}$/.test(value) ? Number(value) : 0
    const zone = (url.searchParams.get('zone') || '').trim()
    const all = await loadPublicProperties(client)
    const properties = all.filter(property => !zone || [property.attributes.zone, property.attributes.city]
      .some(value => value?.toLowerCase() === zone.toLowerCase()))
      .sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at) || a.id.localeCompare(b.id))
    const pageSize = 20
    const pageCount = Math.ceil(properties.length / pageSize)
    const missing = page < 1 || (page > 1 && page > pageCount)
    const metadata = staticMetadata('/purchases', origin)
    const canonical = new URL('/purchases', origin)
    if (page > 1) canonical.searchParams.set('page', String(page))
    metadata.canonical = canonical.href
    // Los filtros no generan una colección de páginas duplicadas indexables.
    metadata.index = !missing && !zone
    if (page > 1) metadata.title = `Viviendas · Página ${page} | Regia Mare Properties`
    metadata.graph = metadata.graph?.map(node => node['@type'] === 'WebPage'
      ? { ...node, '@id': `${canonical.href}#webpage`, url: canonical.href, name: metadata.title } : node)
    const current = missing ? [] : properties.slice((page - 1) * pageSize, page * pageSize)
    metadata.graph?.push({ '@type': 'ItemList', name: 'Propiedades publicadas',
      itemListElement: current.filter(indexableProperty).map((property, position) => ({ '@type': 'ListItem',
        position: (page - 1) * pageSize + position + 1, name: property.title, url: new URL(propertyPath(property), origin).href })) })
    const pageUrl = (number: number) => {
      const link = new URL('/purchases', origin)
      if (number > 1) link.searchParams.set('page', String(number))
      if (zone) link.searchParams.set('zone', zone)
      return escape(link.href)
    }
    const content = missing ? '<main class="container"><h1>Página no encontrada</h1><a href="/purchases">Ver propiedades</a></main>'
      : `<main class="container"><h1>Viviendas en Sitges, Barcelona y la Costa Dorada</h1><p>Consulta las características y el estado de cada propiedad y contacta con la agencia para confirmar disponibilidad.</p>
      ${zone ? `<p>Zona: ${escape(zone)}</p>` : ''}
      <div class="properties-grid">${current.map(property => {
        const image = property.media.find(media => media.media_type === 'image' && media.is_primary) ?? property.media.find(media => media.media_type === 'image')
        const a = property.attributes
        return `<article><a href="${escape(propertyPath(property))}">${image ? `<img src="${escape(image.url)}" alt="${escape(image.alt_text || property.title)}" loading="lazy" style="max-width:100%;height:auto" />` : ''}<h2>${escape(property.title)}</h2></a>
          <p>${escape([a.city, a.zone].filter(Boolean).join(' · '))}</p>
          ${a.vendido ? '<p>Vendido</p>' : a.reservada ? '<p>Reservado</p>' : ''}
          ${typeof a.price === 'number' ? `<p>${escape(a.price.toLocaleString('es-ES'))} €</p>` : ''}</article>`
      }).join('')}</div>${!properties.length ? '<p>No hay propiedades que coincidan con esta consulta.</p>' : ''}
      <nav aria-label="Paginación">${page > 1 ? `<a href="${pageUrl(page - 1)}">Anterior</a>` : ''} ${page < pageCount ? `<a href="${pageUrl(page + 1)}">Siguiente</a>` : ''}</nav></main>`
    if (missing) { metadata.title = 'Página no encontrada | Regia Mare Properties'; metadata.graph = []; metadata.canonical = undefined }
    return await propertyHtml({ title: metadata.title, metadata, content, index: metadata.index, status: missing ? 404 : 200 })
  } catch {
    return new Response('No se han podido cargar las propiedades.', { status: 503,
      headers: { 'X-Robots-Tag': 'noindex', 'Cache-Control': 'no-store', 'Retry-After': '60' } })
  }
}
export const config = { runtime: 'nodejs' }
