# Leads, analítica y blog

Configurar las variables de `.env.example` en Vercel y en `.env` para desarrollo.
`VITE_COMPANY_ID` debe existir también en las funciones de servidor. El blog usa
exclusivamente la clave anon y el RLS de Supabase; leads y analítica usan la clave
service_role solo en servidor. `SITE_URL` es el dominio público HTTPS canónico;
`VITE_SITE_URL` debe coincidir. Ajustar ambos si el dominio real es distinto.

## Requisitos en el proyecto Supabase del panel

Estos SQL pertenecen al proyecto del panel y no están incluidos aquí:

- `COMPANY_MODULES.sql`: `company_modules` con `company_id`, `module_key = 'crm'`
  e `is_enabled = true` para recibir solicitudes. Si no hay fila o está apagado,
  `/api/lead` responde 503.
- `CRM_CONTACTS_PIPELINE.sql` y `CRM_LEAD_ITEM_ATTRIBUTION.sql`: atribución,
  consentimiento y creación/enlace automático de contactos mediante la lógica
  de base de datos. La web no envía IDs de contactos.
- `CONTENT_SEO_FIELDS.sql`: slugs y metadatos de blog; mantener políticas RLS
  que permitan a anon leer solo publicaciones y sus medios.
- Analítica: `ANALYTICS_PRIVACY_UPGRADE.sql`, `ANALYTICS_ENGAGEMENT.sql` y volver
  a ejecutar `ANALYTICS_AGGREGATION.sql`, según `ANALYTICS_INTEGRATION.md`.

Antes de desplegar las rutas, ejecutar el SQL completo
`database/maintenance/CONTENT_SEO_FIELDS_AUDIT.sql` en Supabase. Como comprobación
adicional desde esta web, `npm run blog:preflight` revisa todos los posts publicados
de la empresa usando anon: falla con errores de carga, slugs inválidos o duplicados.
Corregir slugs en el panel; no inventarlos en el frontend ni cambiar los indexados
sin redirecciones permanentes.

## Comprobaciones

`npm run build` comprueba TypeScript de cliente y APIs. `npm run test:integrations`
prueba los endpoints con respuestas simuladas de Supabase, incluyendo empresa fija,
CRM desactivado, consentimiento, HTML inicial/Markdown seguro, 404 y sitemap.
No sustituye comprobar el RLS y las migraciones en el proyecto real.

En desarrollo `npm run dev` sirve la SPA; las funciones y sus rewrites requieren
Vercel (preview o producción). Visitar `/blog`, `/blog/:slug` y `/sitemap.xml`;
comprobar con curl que el HTML inicial contiene title, description, canonical y OG,
que un borrador o slug inexistente devuelve HTTP 404 y un fallo de BD devuelve 503.
El listado tiene páginas de 12 posts; enlaces nativos cargan los metadatos iniciales
de cada artículo. El contenido del panel se muestra en su idioma original.

Enviar una solicitud desde ventas y otra desde una propiedad, con y sin casilla
marcada. Revisar en el panel propiedad, referrer, cinco UTM, versión de texto y
consentimiento. La atribución conserva los parámetros de entrada en memoria durante
la navegación SPA, sin cookies ni almacenamiento persistente. El formulario de
ventas deja `source_item` vacío; la ficha envía su título e ID público.

Se conserva el envío de email existente como alternativa si falla CRM. El evento
reservado `form_submit` solo se emite tras HTTP 201 de `/api/lead`, de modo que el
email por sí solo no aumenta el contador de solicitudes guardadas. El evento propio
`form_submit_success` mantiene el comportamiento anterior y requiere alta en el panel.

La analítica de terceros sigue sin cargarse porque no hay GA4/Meta configurados.
La medición propia respeta la decisión del banner y GPC, y permanece apagada en dev.
