# Inventario SEO de RegiaMare — 28/10/2026

Alcance: `company_id=eac2ccbe-cc36-40cd-bb7e-d5fe44de972d`,
`item_type=regiamare_property`, solo `status=published`. No se migra de tabla.

## Antes de la implementación

- React 19 + React Router (SPA), Vite y funciones Node de Vercel.
- `propertyService.ts` filtra empresa, tipo y estado. Selecciona `*`, no consume
  SEO explícitamente y convierte fallos de Supabase en `[]`/`null`.
- `/property/:id`, tarjetas y relacionadas enlazan por UUID. Un detalle inexistente
  redirige al catálogo en el cliente; no existe 404 HTTP para propiedades.
- EAV: `attribute_values` y `attribute_definitions`; portada `item_media.is_cover`
  (el código anterior asumía `sort_order = 0`). No se trasladan datos CRM.
- `/sitemap.xml` sale de `api/blog.ts`: páginas estáticas y blog; no incluye items.
- No hay canonical ni metadatos SEO de propiedades en la respuesta HTML inicial.
- El esquema local actualizado incluye columnas SEO. La verificación remota usa
  anon y consultas de solo lectura; no se vuelve a ejecutar la migración.

## Plan implementable sin cambiar datos

Mantener `/property/:reference`, resolver por slug y preservar UUID. Usar una
función Vercel con acceso anon para devolver HTML inicial, metadatos y 404/503.
Los UUID de publicaciones con slug válido responden 308 al slug. Sin slug, se
mantiene la ficha UUID con `noindex`, sin URL UUID en el sitemap. Las tarjetas
usan slug cuando existe. No se generan slugs en tiempo de petición.

## Riesgos y revisiones necesarias

- Antes de generar el lote editorial, aprobar este inventario y el export público.
- Los slugs existentes se conservan. Las colisiones afectan a todos los tipos de
  item de la misma empresa; el export comprueba solo publicaciones públicas y no
  puede garantizar ausencia de colisiones con borradores invisibles para anon.
- Antes de ejecutar SQL, el responsable debe usar el preflight administrativo
  `ITEMS_SEO_PREFLIGHT.sql`, que sí puede comprobar el índice completo de empresa.
- Las URLs por slug anteriores que se cambien necesitan una tabla explícita de
  redirecciones; esta integración no inventa el historial que no está disponible.
- Un UUID no publicado devuelve 404. Errores de BD devuelven 503, nunca mocks/404.
- `no-store` en fichas y sitemap evita servir propiedades archivadas desde caché.
- Falta comprobar móvil/tablet/escritorio y HTTP en un preview aprobado antes de
  producción. Esta tarea no autoriza escritura remota de SQL ni despliegue.

## Datos y entregables

`npm run items:preflight` verifica esquema y exporta únicamente publicados del
alcance, SEO actual, atributos públicos interpretados e imágenes públicas. Genera
un archivo fechado, sin sobrescribir el respaldo anterior. El reporte registra
slugs ausentes/inválidos/duplicados, UUID reservados y colisiones públicas.
No contiene claves, clientes, actividad ni datos de otros tenants.

Tras aprobar inventario/export, se puede redactar una propuesta CSV y un SQL de
revisión. La IA no ejecuta ese SQL ni confirma una transacción de base de datos.
