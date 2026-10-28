import { createClient } from '@supabase/supabase-js'

// La URL del proyecto no es secreta: se reutiliza VITE_SUPABASE_URL si no hay
// SUPABASE_URL aparte.
const MAX = { name: 120, email: 160, phone: 40, message: 4000, path: 300, campaign: 120 }

const clean = (value: unknown, max: number): string | null => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim().slice(0, max)
  return trimmed.length > 0 ? trimmed : null
}

// Validación mínima: que parezca un email. No se comprueba que exista.
const looksLikeEmail = (value: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)

// Export nombrado POST (no `export default`): Vercel ignora en silencio un
// default que devuelve Response y la petición se queda colgada.
export async function POST(req: Request) {
  const company_id = process.env.VITE_COMPANY_ID?.trim()
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!company_id || !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(company_id)) {
    return new Response('Service unavailable', { status: 503 })
  }
  if (!url || !key) return new Response('Server error', { status: 500 })
  const supabase = createClient(url, key, { auth: { persistSession: false } })
  let body: Record<string, unknown>
  try {
    body = await req.json()
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid body')
  } catch {
    return new Response('Bad request', { status: 400 })
  }

  if (body.company_id !== company_id) return new Response('Bad request', { status: 400 })
  const name = clean(body.name, MAX.name)
  const email = clean(body.email, MAX.email)
  const phone = clean(body.phone, MAX.phone)
  const message = clean(body.message, MAX.message)

  // El nombre y alguna forma de contestar son imprescindibles.
  if (!company_id || !name || (!email && !phone)) {
    return new Response('Bad request', { status: 400 })
  }
  if (email && !looksLikeEmail(email)) {
    return new Response('Bad request', { status: 400 })
  }

  // Trampa anti-bots: se responde 200 para que el bot no reintente.
  if (clean(body.company_website, 200)) return new Response('OK', { status: 200 })

  // company_id debe existir — evita meter solicitudes en otra empresa.
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('id')
    .eq('id', company_id)
    .maybeSingle()
  if (companyError) return new Response('Server error', { status: 500 })
  if (!company) return new Response('Bad request', { status: 400 })

  const { data: crm, error: moduleError } = await supabase.from('company_modules')
    .select('is_enabled').eq('company_id', company_id).eq('module_key', 'crm').maybeSingle()
  if (moduleError) {
    console.error('[lead] module lookup failed', moduleError.code)
    return new Response('Server error', { status: 500 })
  }
  if (crm?.is_enabled !== true) return new Response('Service unavailable', { status: 503 })

  const { error } = await supabase.from('lead').insert({
    company_id,
    name,
    email,
    phone,
    message,
    source_path: clean(body.source_path, MAX.path),
    source_item: clean(body.source_item, 200),
    source_referrer: clean(body.source_referrer, 2048),
    source_campaign: clean(body.utm_campaign ?? body.source_campaign, MAX.campaign),
    ...Object.fromEntries(['source', 'medium', 'term', 'content']
      .map(key => [`source_utm_${key}`, clean(body[`utm_${key}`], MAX.campaign)])),
    consent_given: body.consent_given === true && !!clean(body.consent_text_version, 120),
    consent_text_version: clean(body.consent_text_version, 120),
  })

  if (error) {
    console.error('[lead] insert failed', error.code)
    return new Response('Server error', { status: 500 })
  }

  return new Response('OK', { status: 201 })
}

export const config = { runtime: 'nodejs' }
