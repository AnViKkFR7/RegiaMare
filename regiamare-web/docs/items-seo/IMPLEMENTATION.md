# Implementación y revisión — 28/10/2026

## Resultado

Auditoría pública con anon: 8 propiedades publicadas de la empresa/tipo acordados,
todas sin slug, seo_title ni seo_description. Sin colisiones de slugs públicos.
El export fechado conserva los valores previos, atributos descriptivos y portada.
Inventario y export aprobados en el chat para preparar propuestas y SQL.

Se han preparado `PROPOSALS.md`, `proposals.csv`, `proposals.json` y
`PROPOSED_ITEMS_SEO_VALUES.sql`. Las 8 imágenes OG son portadas reales comprobadas
por HTTP HEAD con respuesta correcta y content-type de imagen. No se ha escrito
en Supabase ni se han ejecutado migraciones/SQL. El lote sigue pendiente de revisión
editorial y administrativa. La plantilla original del repositorio CRM no estaba
disponible; se incluye una plantilla local equivalente con guardas explícitas.

## Código

- `/property/:reference` acepta slug y UUID. La consulta fija empresa, tipo y
  estado publicado. UUID con slug válido: 308 al canonical HTTPS sin query.
  UUID sin slug: ficha funcional con noindex, excluida del sitemap.
- `api/property.ts` entrega contenido principal y SEO en el HTML inicial:
  title, description, canonical, OG y robots. No hay JSON-LD ni Twitter card
  porque el sitio no los usaba y no se inventan datos estructurados.
- Draft, archived, otro tenant/tipo, slug inválido/inexistente: 404/noindex.
  Fallos Supabase: 503 con Retry-After; el cliente muestra error y reintento.
- Tarjetas y relacionadas enlazan al slug guardado. Sin slug conservan UUID;
  no se generan metadatos ni slugs durante las peticiones.
- Sitemap único en `api/sitemap.ts`, conservando páginas y blog. Solo propiedades
  publicadas con slug válido; sin UUID ni query strings. Se omite lastmod porque
  updated_at también cambia con el lote SEO y no certifica cambios editoriales.
- `no-store` en HTML de propiedades, redirects y sitemap: se consulta el estado
  actual en cada petición. Al archivar, no quedan fichas públicas cacheadas.
- Acceso anon de servidor; ningún cliente público usa service_role. Los medios
  salen de la relación con los items publicados resueltos; se usa is_cover y alt.
- Lecturas de catálogo paginadas (500 por petición), ordenadas por fecha e ID.
  Se mantienen filtros, orden y paginación de la interfaz existente.

## Comprobación

Compilación de cliente y APIs correcta. 20 pruebas de integración, incluyendo
HTTP local sin JavaScript: metadatos completos/fallback, contenido escapado,
UUID→slug, noindex sin slug, 404, tenant/tipo, estados privados, errores, paginación
de más de 500 filas, cambios de estado y sitemap. La suite comprueba también los
módulos de servidor compilados sin bundling para detectar imports ausentes.

Revisión local con Chromium a 390, 768 y 1440 px, usando el export y slugs propuestos
como respuestas simuladas: 8 tarjetas, enlaces por slug, detalle, navegación de
vuelta, limpieza del head y ausencia de desbordamiento horizontal/errores JS.
Las imágenes de las capturas son placeholders de prueba, no un cambio en los datos.

## Pendiente antes de producción

1. Revisar redacción, slugs y CSV. El SQL solo permite cambiar SEO y updated_at,
   exige que las filas sigan publicadas, en el mismo tenant/tipo y sin cambios
   desde el snapshot; comprueba colisiones en todos los tipos/estados.
2. El responsable ejecuta `ITEMS_SEO_PREFLIGHT.sql` administrativo en Supabase
   (anon no puede comprobar conflictos con borradores). Si hay cambios desde el
   export, renovar snapshot/propuestas en vez de saltarse las guardas.
3. Ensayar el SQL que termina en ROLLBACK, revisar SELECT; confirmar manualmente
   solo tras la aprobación. Conservar lote aplicado y resultado en el registro
   de despliegue. No se alteran título, resumen, atributos, precio, estado o medios.
4. Configurar SITE_URL y VITE_SITE_URL con el mismo dominio HTTPS definitivo;
   VITE_COMPANY_ID debe coincidir con el inventario. Requiere Vercel para SSR.
5. Aprobar un preview y comprobar con curl las URLs reales, 308, 404 y sitemap.
   Repetir preflight y comparar las 8 URLs una vez cargados sus slugs. No desplegar
   rutas indexables antes de guardar slugs únicos. No se ha desplegado esta tarea.

Ejemplos de verificación después del lote y del preview:

```sh
curl -i https://DOMINIO_PREVIEW/property/vivienda-historica-mercat-santa-caterina-barcelona
curl -I https://DOMINIO_PREVIEW/property/3eb76f0d-de71-4db5-a380-1bb23257316c
curl -i https://DOMINIO_PREVIEW/property/slug-inexistente
curl https://DOMINIO_PREVIEW/sitemap.xml
```

No existían slugs de propiedades en el export, por lo que no hay redirecciones de
slugs anteriores en este lote. Para futuros cambios de slug se debe registrar cada
URL anterior y su destino; mantener slugs estables evita perder ese historial.
