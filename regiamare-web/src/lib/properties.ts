import type { SupabaseClient } from '@supabase/supabase-js'
import type { Property, ItemMedia, PropertyAttributes } from '../types/index.js'
import { transformAttributesToPropertyAttributes } from '../services/attributeTransformer.js'
import type { AttributeValue } from '../services/attributeTransformer.js'
import { httpsUrl, validSlug } from './blog.js'

// Configuración del sitio: nunca se acepta empresa/tipo desde la URL del visitante.
export const PROPERTY_COMPANY_ID = 'eac2ccbe-cc36-40cd-bb7e-d5fe44de972d'
export const PROPERTY_ITEM_TYPE = 'regiamare_property'
export const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
export const PROPERTY_COLUMNS = 'id,company_id,item_type,status,title,summary,slug,seo_title,seo_description,seo_og_image_url,created_at,updated_at'
const publicColumns = `${PROPERTY_COLUMNS},attribute_values(id,item_id,attribute_id,value_text,value_number,value_boolean,value_date,value_json,value_text_array,value_number_array,attribute_definitions(id,company_id,item_type,key,label,data_type,is_filterable,is_required)),item_media(id,item_id,file_type,url_externa,title,alt_text,sort_order,is_cover,created_at)`

export interface PublicPropertyRow {
  id: string; company_id: string; item_type: string; status: string; title: string; summary: string | null
  slug: string | null; seo_title: string | null; seo_description: string | null; seo_og_image_url: string | null
  created_at: string; updated_at: string; attribute_values: AttributeValue[]
  item_media: { id: string; item_id: string; file_type: ItemMedia['media_type']; url_externa: string
    title: string | null; alt_text: string | null; sort_order: number; is_cover: boolean; created_at: string }[]
}

export function propertyPath(property: Pick<Property, 'id' | 'slug'>): string {
  return `/property/${property.slug && validSlug(property.slug) && !UUID_PATTERN.test(property.slug) ? property.slug : property.id}`
}
export function indexableProperty(property: Pick<Property, 'slug'>): boolean {
  return !!property.slug && validSlug(property.slug) && !UUID_PATTERN.test(property.slug)
}

export function transformPublicProperty(row: PublicPropertyRow): Property {
  const attributes = transformAttributesToPropertyAttributes((row.attribute_values ?? []).filter(value =>
    value.item_id === row.id && value.attribute_definitions?.company_id === PROPERTY_COMPANY_ID
    && value.attribute_definitions.item_type === PROPERTY_ITEM_TYPE))
  const media: ItemMedia[] = (row.item_media ?? []).filter(image => image.item_id === row.id && httpsUrl(image.url_externa))
    .sort((a, b) => a.sort_order - b.sort_order || a.id.localeCompare(b.id))
    .map(image => ({ id: image.id, item_id: image.item_id, media_type: image.file_type,
      url: image.url_externa, alt_text: image.alt_text ?? image.title ?? '', display_order: image.sort_order,
      is_primary: image.is_cover === true, created_at: image.created_at }))
  return { id: row.id, company_id: row.company_id, item_type: row.item_type, status: 'published',
    title: row.title, description: row.summary ?? undefined, slug: row.slug, seo_title: row.seo_title,
    seo_description: row.seo_description, seo_og_image_url: row.seo_og_image_url,
    created_at: row.created_at, updated_at: row.updated_at, attributes: attributes as PropertyAttributes, media }
}

export function publicPropertiesQuery(client: SupabaseClient, columns = publicColumns) {
  return client.from('items').select(columns).eq('company_id', PROPERTY_COMPANY_ID)
    .eq('item_type', PROPERTY_ITEM_TYPE).eq('status', 'published')
}

export async function loadPublicProperty(client: SupabaseClient, reference: string): Promise<Property | null> {
  const byId = UUID_PATTERN.test(reference)
  if (!byId && !validSlug(reference)) return null
  const { data, error } = await publicPropertiesQuery(client).eq(byId ? 'id' : 'slug', reference).maybeSingle()
  if (error) throw error
  if (!data) return null
  return transformPublicProperty(data as unknown as PublicPropertyRow)
}

export async function loadPublicProperties(client: SupabaseClient): Promise<Property[]> {
  const properties: Property[] = []
  for (let start = 0; ; start += 500) {
    const { data, error } = await publicPropertiesQuery(client).order('created_at', { ascending: false })
      .order('id', { ascending: false }).range(start, start + 499)
    if (error) throw error
    properties.push(...(data ?? []).map(row => transformPublicProperty(row as unknown as PublicPropertyRow)))
    if (!data || data.length < 500) return properties
  }
}

export function propertySeo(property: Property) {
  const cover = property.media.find(image => image.media_type === 'image' && image.is_primary)
    ?? property.media.find(image => image.media_type === 'image')
  return { title: property.seo_title || property.title, description: property.seo_description || property.description || '',
    image: httpsUrl(property.seo_og_image_url) || httpsUrl(cover?.url) }
}
