# Configuración de Email con Supabase Edge Functions

Este proyecto utiliza Supabase Edge Functions con Resend para enviar emails desde el formulario de ventas/valoración.

## 🚀 Ventajas sobre EmailJS

- ✅ **Más seguro**: Las credenciales están en el servidor, no en el cliente
- ✅ **Sin límites de cliente**: La función se ejecuta en el servidor de Supabase
- ✅ **Mejor control**: Puedes personalizar completamente la lógica de envío
- ✅ **Integrado**: Usa la misma infraestructura de Supabase que ya tienes
- ✅ **Sin dependencias externas**: No necesitas EmailJS

## 📋 Requisitos Previos

1. **Supabase CLI instalado:**
   ```bash
   npm install -g supabase
   ```

2. **Cuenta de Resend (gratis hasta 3,000 emails/mes):**
   - Visita [https://resend.com](https://resend.com)
   - Crea una cuenta gratuita
   - Verifica tu dominio (o usa el dominio de prueba `onboarding.resend.dev`)

## 🔧 Configuración Paso a Paso

### 1. Obtener API Key de Resend

1. Ve a [https://resend.com/api-keys](https://resend.com/api-keys)
2. Haz clic en "Create API Key"
3. Dale un nombre descriptivo: `Regiamare Production`
4. Selecciona el permiso: "Sending access"
5. Copia la API key (empezará con `re_`)

### 2. Configurar dominio en Resend (Opcional pero recomendado)

**Opción A: Usar dominio de prueba** (más rápido para testing)
- Usa `noreply@onboarding.resend.dev` como remitente
- Los emails llegarán pero con advertencia de "via resend.com"

**Opción B: Configurar tu dominio** (recomendado para producción)
1. Ve a "Domains" en Resend
2. Haz clic en "Add Domain"
3. Introduce tu dominio: `regiamare.com`
4. Añade los registros DNS que te proporciona Resend:
   - SPF
   - DKIM
   - DMARC (opcional pero recomendado)
5. Verifica el dominio (puede tardar hasta 72h)

### 3. Iniciar sesión en Supabase CLI

```bash
# Inicia sesión en Supabase
supabase login

# Vincula tu proyecto (necesitas el Project ID de Supabase Dashboard)
cd regiamare-web
supabase link --project-ref TU_PROJECT_ID
```

Para obtener tu Project ID:
- Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Selecciona tu proyecto
- Ve a "Settings" → "General"
- Copia el "Project ID"

### 4. Configurar secretos en Supabase

Los secretos son variables de entorno seguras que solo existen en el servidor:

```bash
# Configurar API Key de Resend
supabase secrets set RESEND_API_KEY=re_tu_api_key_aqui

# Ver secretos configurados (sin mostrar valores)
supabase secrets list
```

### 5. Desplegar la Edge Function

```bash
# Desplegar la función send-email
supabase functions deploy send-email --no-verify-jwt

# El flag --no-verify-jwt permite llamadas sin autenticación
# (necesario para formularios públicos)
```

### 6. Personalizar el remitente del email

Edita `supabase/functions/send-email/index.ts`, línea ~103:

```typescript
from: 'Regiamare Properties <noreply@regiamare.com>',  // Cambia esto
to: ['gasa.aaron@gmail.com'],  // Email destino
```

**Importante:** El email de `from` debe:
- Usar dominio verificado en Resend, o
- Usar `onboarding.resend.dev` para pruebas

### 7. Verificar el despliegue

```bash
# Ver logs de la función en tiempo real
supabase functions logs send-email --tail

# Probar la función localmente antes de desplegar
supabase start
supabase functions serve send-email --env-file .env
```

## 🧪 Testing

### Test local (antes de desplegar)

1. Crea un archivo `.env.local` con:
   ```
   RESEND_API_KEY=re_tu_api_key
   ```

2. Ejecuta la función localmente:
   ```bash
   supabase start
   supabase functions serve send-email --env-file .env.local
   ```

3. Prueba con curl:
   ```bash
   curl -X POST http://localhost:54321/functions/v1/send-email \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "phone": "123456789",
       "address": "Calle Test 123",
       "propertyType": "Piso",
       "message": "Este es un mensaje de prueba"
     }'
   ```

### Test desde la aplicación

1. Asegúrate de que el servidor Vite esté corriendo: `npm run dev`
2. Ve a `/sales`
3. Rellena y envía el formulario
4. Revisa los logs: `supabase functions logs send-email --tail`
5. Verifica el email en `gasa.aaron@gmail.com`

## 🔍 Troubleshooting

### Error: "RESEND_API_KEY not configured"
- Verifica que el secreto esté configurado: `supabase secrets list`
- Vuelve a configurarlo: `supabase secrets set RESEND_API_KEY=re_...`
- Redesplega la función: `supabase functions deploy send-email --no-verify-jwt`

### Error: "Failed to send email"
- Revisa los logs: `supabase functions logs send-email`
- Verifica que la API key de Resend sea válida
- Comprueba que el dominio del remitente esté verificado (o usa onboarding.resend.dev)

### Email no llega
- Revisa la carpeta de spam
- Verifica que el email destino sea correcto en el código
- Comprueba el dashboard de Resend para ver si el email fue enviado
- Revisa los logs de Supabase

### Error: "Project not linked"
```bash
supabase link --project-ref TU_PROJECT_ID
```

### Error CORS
- La edge function ya incluye headers CORS en `_shared/cors.ts`
- Si persiste, verifica que la URL de Supabase sea correcta en .env

## 📊 Límites y Costos

### Resend (Plan Gratuito)
- 3,000 emails por mes
- 100 emails por día
- Sin tarjeta de crédito requerida

### Supabase Edge Functions (Plan Gratuito)
- 500,000 invocaciones por mes
- 2GB de tráfico
- Suficiente para la mayoría de proyectos pequeños

## 🔒 Seguridad

### Buenas prácticas implementadas:
- ✅ API key en variables de entorno del servidor (no en el cliente)
- ✅ Validación de campos requeridos
- ✅ CORS configurado correctamente
- ✅ Manejo de errores con logs

### Mejoras opcionales:
- [ ] Rate limiting para prevenir spam
- [ ] Verificación de reCAPTCHA
- [ ] Whitelist de dominios permitidos
- [ ] Honeypot fields

## 📝 Mantenimiento

### Actualizar la función
1. Edita `supabase/functions/send-email/index.ts`
2. Redesplega: `supabase functions deploy send-email --no-verify-jwt`

### Ver estadísticas
- Dashboard de Supabase: Sección "Edge Functions"
- Dashboard de Resend: Logs de emails enviados

### Cambiar email destino
Edita línea ~104 en `send-email/index.ts`:
```typescript
to: ['nuevo.email@ejemplo.com'],
```

## 🚀 Próximos Pasos

1. ✅ Desplegar la edge function
2. ✅ Configurar Resend API key
3. ✅ Probar envío de emails
4. ⏳ (Opcional) Configurar dominio personalizado en Resend
5. ⏳ (Opcional) Añadir reCAPTCHA
6. ⏳ (Opcional) Configurar rate limiting

## 📚 Referencias

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Resend Docs](https://resend.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
