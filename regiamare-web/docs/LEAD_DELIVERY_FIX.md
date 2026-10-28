# Solicitudes no guardadas — 28/10/2026

El endpoint intentaba insertar `utm_source`, `utm_medium`, `utm_campaign`,
`utm_term` y `utm_content` directamente en `lead`. Las columnas reales son
`source_campaign` para campaña y `source_utm_source`, `source_utm_medium`,
`source_utm_term`, `source_utm_content` para las restantes. Una consulta remota
de solo lectura y cero filas confirmó `42703: column lead.utm_source does not exist`
y verificó que las columnas correctas existen. No se requiere crear columnas UTM
duplicadas ni volver a ejecutar migraciones para resolver este fallo.

La interfaz anterior aceptaba el éxito del email como sustituto del CRM. Así,
`form_submit_success` podía aparecer en analítica sin ninguna fila en Solicitudes.
Ambos formularios ahora exigen HTTP 201 de `/api/lead`; solo entonces intentan
notificar por email y confirman éxito. Si falla CRM conservan los campos y muestran
error. Una respuesta 200 de un rewrite o del honeypot no confirma un guardado.

La prueba de inserción valida los nombres contra `DB_SCHEMA.sql` y rechaza columnas
desconocidas, en lugar de aceptar cualquier payload. También comprueba el mapeo de
las cinco UTM y el rechazo de un fallo de inserción.

Comprobación: compilación y 21 pruebas correctas. Prueba adicional en Chromium
local de los dos formularios con CRM 500/201 y email fallido simulado: si CRM falla
no se llama al email, se muestra error y se conservan los campos; si CRM guarda,
el fallo de email no oculta la solicitud guardada. No se envían mensajes reales.

No se han enviado formularios/emails reales, leído solicitudes personales,
modificado datos ni desplegado. El acceso local disponible es anon: no permite
verificar el estado de `company_modules` (42501), por lo que no se afirma que CRM
esté habilitado. Después de desplegar, comprobar el guardado desde un envío real
autorizado: debe recibir 201 y aparecer en Solicitudes de RegiaMare.
Si responde 503, revisar `VITE_COMPANY_ID` y el módulo CRM en Vercel/panel;
si responde 500, revisar credenciales del servidor y los logs de `/api/lead`.

El envío anterior que falló no se recupera automáticamente: el evento analítico
no contiene los datos de contacto para reconstruirlo.
