# 📧 Migración Completa: EmailJS → Supabase Edge Functions

## ✅ Cambios Realizados

### 1. **Nueva Edge Function de Supabase**
   - 📁 `supabase/functions/send-email/index.ts` - Función principal
   - 📁 `supabase/functions/_shared/cors.ts` - Configuración CORS
   - 🔧 Usa Resend para envío de emails
   - 🎨 HTML formateado con tabla para mejor presentación

### 2. **Actualización del Frontend**
   - ✏️ [Sales.tsx](src/routes/Sales/Sales.tsx) - Eliminado EmailJS, ahora llama a la edge function
   - 🗑️ Removida dependencia de `@emailjs/browser`
   - 🔒 Credenciales ahora en el servidor (más seguro)

### 3. **Configuración**
   - 📝 [SUPABASE_EMAIL_SETUP.md](SUPABASE_EMAIL_SETUP.md) - Guía completa de configuración
   - 📝 [supabase/functions/README.md](supabase/functions/README.md) - Documentación de funciones
   - 🔧 [setup-email.ps1](setup-email.ps1) - Script automatizado de configuración
   - ⚙️ [.vscode/settings.json](.vscode/settings.json) - Soporte de Deno en VSCode
   - ⚙️ [supabase/deno.json](supabase/deno.json) - Configuración de Deno
   - 📋 [.env.example](.env.example) - Actualizado (ya no requiere EmailJS)

### 4. **Archivos Actualizados**
   - ⚠️ [EMAILJS_SETUP.md](EMAILJS_SETUP.md) - Marcado como DEPRECATED
   - 🛡️ [.gitignore](.gitignore) - Asegura que .env no se commitee

---

## 🚀 Próximos Pasos para el Despliegue

### Opción A: Script Automatizado (Recomendado)
```powershell
# Ejecuta el script de configuración
.\setup-email.ps1
```

### Opción B: Configuración Manual

#### 1. **Desinstalar EmailJS** (ya no se usa)
```bash
npm uninstall emailjs @emailjs/browser
```

#### 2. **Instalar Supabase CLI**
```bash
npm install -g supabase
```

#### 3. **Vincular Proyecto**
```bash
supabase login
supabase link --project-ref TU_PROJECT_ID
```

#### 4. **Obtener API Key de Resend**
- Ve a [https://resend.com](https://resend.com)
- Crea cuenta gratuita (3,000 emails/mes)
- Crea una API Key
- Copia la key (empieza con `re_`)

#### 5. **Configurar Secreto en Supabase**
```bash
supabase secrets set RESEND_REGIAMARE_API_KEY=re_tu_api_key
```

#### 6. **Personalizar Email Destino/Remitente** (Opcional)
Edita `supabase/functions/send-email/index.ts` líneas 103-104:
```typescript
from: 'Regiamare Properties <noreply@regiamare.com>',
to: ['gasa.aaron@gmail.com'],
```

**Importante:** Si cambias el `from`, debes:
- Verificar ese dominio en Resend, o
- Usar `onboarding.resend.dev` para pruebas

#### 7. **Desplegar la Función**
```bash
supabase functions deploy send-email --no-verify-jwt
```

#### 8. **Verificar Despliegue**
```bash
# Ver logs en tiempo real
supabase functions logs send-email --tail
```

---

## 🧪 Testing

### 1. **Probar Localmente** (Opcional)
```bash
# Crear archivo con tu API key
echo "RESEND_REGIAMARE_API_KEY=re_tu_key" > .env.local

# Iniciar Supabase local
supabase start

# Servir la función
supabase functions serve send-email --env-file .env.local
```

### 2. **Probar desde la Aplicación**
```bash
# Iniciar el servidor de desarrollo
npm run dev

# Ir a http://localhost:5173/sales
# Rellenar y enviar el formulario
# Verificar email en gasa.aaron@gmail.com
```

### 3. **Verificar Logs**
```bash
# Ver actividad de la función
supabase functions logs send-email --tail
```

---

## 📊 Comparación: EmailJS vs Supabase

| Característica | EmailJS (Antes) | Supabase (Ahora) |
|---|---|---|
| **Seguridad** | ⚠️ Credenciales en cliente | ✅ Credenciales en servidor |
| **Límite gratuito** | 200 emails/mes | 3,000 emails/mes (Resend) |
| **Configuración** | 3 variables de entorno | 1 secreto en Supabase |
| **Infraestructura** | Servicio externo | Integrado en Supabase |
| **Personalización** | Limitada | Total control del código |
| **Costo adicional** | Otro servicio | Usa infraestructura existente |

---

## 🔍 Troubleshooting

### "Failed to send email"
```bash
# Verificar secretos configurados
supabase secrets list

# Volver a configurar
supabase secrets set RESEND_REGIAMARE_API_KEY=re_tu_key

# Redesplegar
supabase functions deploy send-email --no-verify-jwt
```

### "Cannot find name 'Deno'" en VSCode
- ✅ Ya está configurado en `.vscode/settings.json`
- Si persiste, instala la extensión de Deno para VSCode

### Email no llega
1. Verifica carpeta de spam
2. Revisa logs: `supabase functions logs send-email`
3. Comprueba dashboard de Resend
4. Verifica que el dominio del remitente esté verificado

### "Project not linked"
```bash
supabase link --project-ref TU_PROJECT_ID
```

---

## 📚 Archivos de Documentación

- 📘 **[SUPABASE_EMAIL_SETUP.md](SUPABASE_EMAIL_SETUP.md)** - Guía completa paso a paso
- 📗 **[supabase/functions/README.md](supabase/functions/README.md)** - Referencia de funciones
- 🔵 **Este archivo** - Resumen de migración y quickstart

---

## 💡 Comandos Útiles

```bash
# Ver todas las funciones desplegadas
supabase functions list

# Ver detalles de una función
supabase functions info send-email

# Ver logs históricos (últimos 100)
supabase functions logs send-email --limit 100

# Eliminar una función (si es necesario)
supabase functions delete send-email

# Ver secretos configurados
supabase secrets list

# Eliminar un secreto
supabase secrets unset SECRET_NAME
```

---

## ✅ Checklist de Migración

- [ ] Desinstalar EmailJS: `npm uninstall emailjs @emailjs/browser`
- [ ] Instalar Supabase CLI: `npm install -g supabase`
- [ ] Crear cuenta en Resend
- [ ] Obtener API Key de Resend
- [ ] Vincular proyecto: `supabase link --project-ref ...`
- [ ] Configurar secreto: `supabase secrets set RESEND_REGIAMARE_API_KEY=...`
- [ ] Personalizar email destino/remitente (opcional)
- [ ] Verificar dominio en Resend (opcional)
- [ ] Desplegar función: `supabase functions deploy send-email --no-verify-jwt`
- [ ] Probar formulario en `/sales`
- [ ] Verificar recepción de email
- [ ] Verificar logs: `supabase functions logs send-email --tail`

---

## 🎉 ¡Listo!

Una vez completados estos pasos, el formulario de ventas enviará emails de forma segura usando Supabase Edge Functions.

**¿Necesitas ayuda?** Consulta [SUPABASE_EMAIL_SETUP.md](SUPABASE_EMAIL_SETUP.md) para más detalles.
