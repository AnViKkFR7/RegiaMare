# Supabase Edge Functions

Este directorio contiene las Edge Functions de Supabase para el proyecto Regiamare.

## 📁 Estructura

```
supabase/
└── functions/
    ├── _shared/
    │   └── cors.ts          # Configuración CORS compartida
    └── send-email/
        └── index.ts         # Función para enviar emails
```

## 🚀 Funciones Disponibles

### `send-email`
Envía emails de valoración desde el formulario de ventas usando Resend.

**Endpoint:** `https://your-project.supabase.co/functions/v1/send-email`

**Método:** POST

**Body:**
```json
{
  "name": "Nombre del cliente",
  "email": "cliente@email.com",
  "phone": "123456789",
  "address": "Dirección de la propiedad",
  "propertyType": "Tipo de propiedad",
  "message": "Mensaje opcional"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "id": "resend-email-id"
}
```

**Response Error:**
```json
{
  "error": "Error message",
  "success": false
}
```

## 🔧 Desarrollo

### Requisitos
- Supabase CLI instalado: `npm install -g supabase`
- Cuenta de Resend con API key

### Comandos útiles

```bash
# Iniciar Supabase localmente
supabase start

# Servir funciones localmente
supabase functions serve

# Servir una función específica con variables de entorno
supabase functions serve send-email --env-file .env.local

# Desplegar una función
supabase functions deploy send-email --no-verify-jwt

# Ver logs en tiempo real
supabase functions logs send-email --tail

# Listar secretos configurados
supabase secrets list

# Configurar un secreto
supabase secrets set SECRET_NAME=value
```

### Testing local

1. Crea `.env.local`:
   ```
   RESEND_REGIAMARE_API_KEY=re_your_api_key
   ```

2. Inicia las funciones:
   ```bash
   supabase functions serve --env-file .env.local
   ```

3. Prueba con curl:
   ```bash
   curl -X POST http://localhost:54321/functions/v1/send-email \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@test.com","phone":"123","address":"Test St","propertyType":"Casa","message":"Test"}'
   ```

## 📚 Documentación

Para instrucciones completas de configuración y despliegue, consulta [SUPABASE_EMAIL_SETUP.md](../../SUPABASE_EMAIL_SETUP.md)

## 🔒 Seguridad

- Los secretos (como RESEND_REGIAMARE_API_KEY) se configuran mediante `supabase secrets set`
- Nunca commitees archivos .env con secretos reales
- Las funciones incluyen validación de campos requeridos
- CORS está configurado para permitir peticiones desde el frontend

## 🐛 Debugging

Si algo no funciona:

1. Verifica los logs: `supabase functions logs send-email --tail`
2. Comprueba que los secretos estén configurados: `supabase secrets list`
3. Prueba localmente primero con `supabase functions serve`
4. Revisa el dashboard de Resend para ver si los emails fueron enviados
