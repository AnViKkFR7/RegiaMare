# Fichas y sitemap con 503 — 28/10/2026

Comprobación de producción mediante GET: portada 200; ficha UUID y sitemap 503.
La lectura pública de la ficha consultada desde Supabase funciona y devuelve
15 medios; no es una propiedad inexistente. En la configuración local no existen
SITE_URL ni VITE_SITE_URL. Se reprodujo el fallo con el handler real y la BD pública:
sin variable de dominio, 503; añadiendo SITE_URL solo en memoria, 200.

La implementación SSR hacía obligatorias unas variables nuevas para el dominio.
Ahora son opcionales: `src/lib/siteConfig.ts` fija `https://regiamare.com` como
predeterminado para servidor y navegador, fichas, blog, sitemap y redirects.
Si se configura un dominio explícito, debe ser HTTPS; no se deriva de la cabecera
Host del visitante. Se mantienen las comprobaciones de empresa, credenciales
públicas, estado publicado y aislamiento de datos.

No se ocultan errores de Supabase como contenido vacío o datos mock. Los errores
reales siguen devolviendo 503/noindex, y las fichas inexistentes 404/noindex.
No se han modificado datos, ejecutado SQL ni desplegado. La causa exacta de la
petición en Vercel requiere sus logs; el fallo de configuración está reproducido
localmente y corregido. Tras desplegar, comprobar ficha UUID, slug, sitemap y blog.

## Segundo fallo confirmado por los logs de producción

Tras resolver la configuración, los logs mostraron `ENOENT` al abrir
`/var/task/dist/index.html`. La carpeta de estáticos no estaba presente dentro
de la función, pese a `includeFiles`. Se elimina esa lectura: Vite incorpora el
HTML final en un módulo TypeScript que el empaquetador de Node incluye como código.
La misma solución se aplica al blog y no cambia datos de Supabase.

La verificación actual incluye paquetes reales de `@vercel/node` ejecutados desde
carpetas aisladas sin `dist`, con respuestas 200 para ficha y blog leyendo Supabase
público. Las pruebas de regresión comprueban también 404, metadatos, coincidencia
del HTML incorporado con la compilación y existencia de sus assets JS/CSS.
