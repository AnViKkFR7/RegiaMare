import { siteTemplate, routeAssets } from './site-template.generated.js'
import { safeJsonLd, seoImage, BRAND } from '../src/lib/seo.js'
import type { SeoMetadata } from '../src/lib/seo.js'
export const escapeHtml = (value: string) => value.replace(/[&<>"']/g,
  char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)
export function publicFrame(content: string): string {
  return `<header><nav class="container" aria-label="Navegación principal"><a href="/">Regia Mare Properties</a> · <a href="/services">Servicios</a> · <a href="/purchases">Propiedades</a> · <a href="/sales">Vender</a> · <a href="/about">Quiénes somos</a></nav></header>${content}<footer class="container"><p>${BRAND.name} · <a href="tel:+34669887791">${BRAND.phone}</a> · <a href="mailto:${BRAND.email}">${BRAND.email}</a></p>${BRAND.offices.map(office => `<address>${escapeHtml(office.street)}, ${office.postcode} ${office.locality}</address>`).join('')}<a href="/blog">Blog</a> · <a href="/privacy">Privacidad</a> · <a href="/legal">Aviso legal</a></footer>`
}
export function seoHead(meta: SeoMetadata): string {
  const image = seoImage(meta.image)
  return `<title>${escapeHtml(meta.title)}</title>
<meta data-seo name="description" content="${escapeHtml(meta.description)}" />
<meta data-seo name="robots" content="${meta.index === false ? 'noindex,follow' : 'index,follow,max-image-preview:large'}" />
${meta.canonical ? `<link data-seo rel="canonical" href="${escapeHtml(meta.canonical)}" />` : ''}
<meta data-seo property="og:site_name" content="Regia Mare Properties" />
<meta data-seo property="og:locale" content="es_ES" />
<meta data-seo property="og:type" content="${meta.type || 'website'}" />
<meta data-seo property="og:title" content="${escapeHtml(meta.title)}" />
<meta data-seo property="og:description" content="${escapeHtml(meta.description)}" />
${meta.canonical ? `<meta data-seo property="og:url" content="${escapeHtml(meta.canonical)}" />` : ''}
${image ? `<meta data-seo property="og:image" content="${escapeHtml(image)}" />` : ''}
<meta data-seo name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}" />
<meta data-seo name="twitter:title" content="${escapeHtml(meta.title)}" />
<meta data-seo name="twitter:description" content="${escapeHtml(meta.description)}" />
${image ? `<meta data-seo name="twitter:image" content="${escapeHtml(image)}" />` : ''}
${meta.graph?.length ? `<script data-seo type="application/ld+json">${safeJsonLd(meta.graph)}</script>` : ''}`
}
export function renderDocument(meta: SeoMetadata, body: string, template = siteTemplate): string {
  const pathname = meta.canonical ? new URL(meta.canonical).pathname : ''
  const assets = routeAssets[Object.keys(routeAssets).find(path => pathname.startsWith(path)) || '']
  const head = seoHead(meta) + (assets ? assets.css.map(path => `<link rel="stylesheet" href="${escapeHtml(path)}" />`).join('')
    + (assets.script ? `<link rel="modulepreload" href="${escapeHtml(assets.script)}" />` : '') : '')
  return template.replace(/<html lang="[^"]+">/, `<html lang="${meta.language || 'es'}">`)
    .replace(/<title>[^<]*<\/title>/, () => head)
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`)
}
