// Dominio público de este sitio. No se deriva del Host enviado por el visitante.
export const DEFAULT_SITE_URL = 'https://regiamare.com'

export function siteOrigin(configured?: string): string {
  const url = new URL(configured?.trim() || DEFAULT_SITE_URL)
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Public site URL must use HTTPS without credentials')
  return url.origin
}
