const ENDPOINT = '/api/lead'
const COMPANY_ID = import.meta.env.VITE_COMPANY_ID

export interface LeadInput {
  name: string
  email?: string
  phone?: string
  message?: string
  /** Campo trampa: debe llegar vacío. Ver el input oculto del formulario. */
  company_website?: string
}

export type LeadResult =
  | { ok: true }
  | { ok: false; reason: 'invalid' | 'network' | 'server' }

/**
 * Envía una solicitud. A diferencia de la analítica no usa sendBeacon:
 * aquí hay que saber si ha llegado para poder decírselo a la persona.
 */
export async function submitLead(input: LeadInput): Promise<LeadResult> {
  if (!COMPANY_ID) {
    console.warn('[leads] VITE_COMPANY_ID no está configurado — solicitud descartada')
    return { ok: false, reason: 'invalid' }
  }
  if (!input.name?.trim() || (!input.email?.trim() && !input.phone?.trim())) {
    return { ok: false, reason: 'invalid' }
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_id: COMPANY_ID,
        ...input,
        source_path: window.location.pathname,
        source_campaign: new URLSearchParams(window.location.search).get('utm_campaign') ?? undefined,
      }),
    })
    if (response.ok) return { ok: true }
    return { ok: false, reason: response.status === 400 ? 'invalid' : 'server' }
  } catch {
    return { ok: false, reason: 'network' }
  }
}
