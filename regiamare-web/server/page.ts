import { createClient } from '@supabase/supabase-js'
import { renderDocument, publicFrame } from './html.js'
import type { SeoMetadata } from '../src/lib/seo.js'
export { escapeHtml } from './html.js'
import { PROPERTY_COMPANY_ID } from '../src/lib/properties.js'
import { siteOrigin } from '../src/lib/siteConfig.js'

export function publicSite() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Missing public Supabase configuration')
  if (process.env.VITE_COMPANY_ID?.trim() !== PROPERTY_COMPANY_ID) throw new Error('Invalid company configuration for RegiaMare')
  const origin = siteOrigin(process.env.SITE_URL?.trim() || process.env.VITE_SITE_URL?.trim())
  return { origin, client: createClient(url, key, { auth: { persistSession: false } }) }
}

export async function propertyHtml({ title, description = '', canonical, image, content, index = false, status = 200, metadata }:
  { title: string; description?: string; canonical?: string; image?: string; content: string; index?: boolean; status?: number; metadata?: SeoMetadata }) {
  const html = renderDocument(metadata || { title, description, canonical, image, index }, publicFrame(content))
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store', ...(index ? {} : { 'X-Robots-Tag': 'noindex' }) } })
}
