// Diagnóstico de solo lectura: no envía formularios, emails ni inserta solicitudes.
import { createClient } from '@supabase/supabase-js'
process.loadEnvFile('.env')
const company = 'eac2ccbe-cc36-40cd-bb7e-d5fe44de972d'
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
const client = createClient(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL, key,
  { auth: { persistSession: false } })
const checks = []
for (const columns of ['utm_source', 'source_campaign,source_utm_source,source_utm_medium,source_utm_term,source_utm_content,source_item,consent_given,consent_text_version']) {
  const { error } = await client.from('lead').select(columns).eq('company_id', company).limit(0)
  checks.push({ columns, valid: !error, code: error?.code ?? null, message: error?.message ?? null })
}
const { data: crm, error } = await client.from('company_modules').select('is_enabled')
  .eq('company_id', company).eq('module_key', 'crm').maybeSingle()
console.log(JSON.stringify({ access: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'server' : 'anon', schema: checks,
  crm: { enabled_if_visible: crm?.is_enabled ?? null, code: error?.code ?? null } }, null, 2))
