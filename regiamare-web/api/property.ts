import { publicSite, propertyHtml, escapeHtml as escape } from '../server/page.js'
import { indexableProperty, loadPublicProperty, propertyPath, propertySeo, UUID_PATTERN } from '../src/lib/properties.js'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const reference = url.pathname.startsWith('/property/')
      ? url.pathname.slice('/property/'.length) : url.searchParams.get('reference') || ''
    const { client, origin } = publicSite()
    const property = await loadPublicProperty(client, reference)
    if (!property) return await propertyHtml({ title: 'Propiedad no encontrada | Regia Mare Properties', status: 404,
      content: '<main class="container"><h1>Propiedad no encontrada</h1><a href="/purchases">Ver propiedades</a></main>' })
    const index = indexableProperty(property)
    const canonical = index ? new URL(propertyPath(property), origin).href : undefined
    if (UUID_PATTERN.test(reference) && canonical) return new Response(null, { status: 308,
      headers: { Location: canonical, 'Cache-Control': 'no-store' } })
    const seo = propertySeo(property)
    const attributes = property.attributes
    const details: [string, unknown][] = [['Localidad', attributes.city], ['Zona', attributes.zone],
      ['Tipo', attributes.property_type], ['Operación', attributes.operation_type], ['Precio', typeof attributes.price === 'number' ? `${attributes.price.toLocaleString('es-ES')} €` : undefined],
      ['Superficie construida', typeof attributes.built_surface === 'number' ? `${attributes.built_surface} m²` : undefined],
      ['Dormitorios', attributes.bedrooms], ['Baños', attributes.bathrooms], ['Estado', attributes.condition]]
    const content = `<main class="property-detail container"><nav><a href="/purchases">Propiedades</a></nav>
      <h1>${escape(property.title)}</h1>
      ${property.description ? `<p>${escape(property.description)}</p>` : ''}
      ${attributes.vendido ? '<p>Vendido</p>' : attributes.reservada ? '<p>Reservado</p>' : ''}
      <dl>${details.filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([label, value]) => `<dt>${escape(label)}</dt><dd>${escape(String(value))}</dd>`).join('')}</dl>
      ${attributes.description ? `<section><h2>Descripción</h2><p style="white-space:pre-line">${escape(attributes.description)}</p></section>` : ''}
      <section aria-label="Imágenes">${property.media.filter(image => image.media_type === 'image')
        .map(image => `<img src="${escape(image.url)}" alt="${escape(image.alt_text || property.title)}" loading="lazy" style="max-width:100%;height:auto" />`).join('')}</section>
      <a href="mailto:info@regiamare.com">Consultar esta propiedad</a></main>`
    return await propertyHtml({ title: seo.title, description: seo.description, image: seo.image, canonical, content, index })
  } catch (error) {
    console.error('[property] load failed', error instanceof Error ? error.message : 'Database error')
    return new Response('<!doctype html><html lang="es"><head><title>Error de carga</title><meta name="robots" content="noindex" /></head><body><main><h1>No se ha podido cargar la propiedad</h1><p>Inténtalo de nuevo más tarde.</p></main></body></html>',
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex', 'Retry-After': '60' } })
  }
}
export const config = { runtime: 'nodejs' }
