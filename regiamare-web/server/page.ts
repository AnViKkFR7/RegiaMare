import { createClient } from '@supabase/supabase-js'
import { readFile } from 'node:fs/promises'
import { PROPERTY_COMPANY_ID } from '../src/lib/properties.js'

export const escapeHtml = (value: string) => value.replace(/[&<>"']/g,
  char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)

export function publicSite() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY
  const site = process.env.SITE_URL || process.env.VITE_SITE_URL
  if (!url || !key || !site || process.env.VITE_COMPANY_ID !== PROPERTY_COMPANY_ID) throw new Error('Invalid public site configuration')
  const origin = new URL(site)
  if (origin.protocol !== 'https:') throw new Error('SITE_URL must use HTTPS')
  return { origin: origin.origin, client: createClient(url, key, { auth: { persistSession: false } }) }
}

export async function propertyHtml({ title, description = '', canonical, image, content, index = false, status = 200 }:
  { title: string; description?: string; canonical?: string; image?: string; content: string; index?: boolean; status?: number }) {
  const head = `<title>${escapeHtml(title)}</title>
    <meta data-item-seo name="description" content="${escapeHtml(description)}" />
    <meta data-item-seo name="robots" content="${index ? 'index,follow' : 'noindex,follow'}" />
    ${canonical ? `<link data-item-seo rel="canonical" href="${escapeHtml(canonical)}" />` : ''}
    <meta data-item-seo property="og:title" content="${escapeHtml(title)}" />
    <meta data-item-seo property="og:description" content="${escapeHtml(description)}" />
    <meta data-item-seo property="og:type" content="website" />
    ${canonical ? `<meta data-item-seo property="og:url" content="${escapeHtml(canonical)}" />` : ''}
    ${image ? `<meta data-item-seo property="og:image" content="${escapeHtml(image)}" />` : ''}`
  const template = await readFile(`${process.cwd()}/dist/index.html`, 'utf8')
  const html = template.replace('<html lang="en">', '<html lang="es">')
    .replace(/<title>[^<]*<\/title>/, () => head)
    .replace('<div id="root"></div>', () => `<div id="root"><header><a href="/">Regia Mare Properties</a></header>${content}</div>`)
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store', ...(index ? {} : { 'X-Robots-Tag': 'noindex' }) } })
}
