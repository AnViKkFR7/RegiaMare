# SEO y visibilidad en asistentes de IA — 11/11/2026

## Auditoría de producción antes de los cambios

El informe `audit-2026-11-11T18-18-15-543Z.json` se obtuvo mediante peticiones HTTP
públicas, sin ejecutar JavaScript. Inicio, servicios, catálogo, venta y equipo
entregaban el título genérico, sin descripción, canonical, H1 ni datos estructurados.
Las fichas y blog ya entregaban contenido, pero carecían de JSON-LD. Una URL
inexistente respondía 200. `robots.txt` y `llms.txt` respondían con el HTML de la SPA.
La portada respondió 200 al user-agent de OAI-SearchBot; no se ha probado su IP real.

## Cambios implementados

- Prerender de inicio, servicios, venta, equipo y páginas informativas utilizando
  los componentes React reales. Se preservan diseño, formularios y navegación.
  La portada se hidrata sobre el HTML existente; no empieza con una página vacía.
- `api/page.ts` sirve las páginas generadas y devuelve 404/noindex para rutas
  inexistentes. Las páginas legales llevan noindex y no se añaden al sitemap.
- Catálogo público servido desde `api/catalog.ts` con fotografías, características,
  enlaces por slug y paginación rastreable. Los filtros llevan noindex; cada página
  de resultados tiene su canonical. La interfaz conserva zona/página en la URL.
- Metadatos propios en HTML inicial y al navegar: title, descripción, canonical,
  robots, Open Graph y Twitter Cards. Se mantiene el mismo dominio HTTPS.
- JSON-LD con identidades estables: RealEstateAgent, oficinas/contacto, WebSite,
  WebPage/AboutPage, Service, BreadcrumbList, ItemList, RealEstateListing,
  House/Apartment y BlogPosting cuando procede. La información coincide con el
  contenido público; no se inventan valoraciones, horarios, coordenadas ni ratings.
- Las ofertas de compra solo incluyen precios reales de ventas no marcadas como
  vendidas/reservadas. No se infiere disponibilidad de `published` ni se inventa
  la periodicidad de precios de alquiler. El JSON-LD escapa cierres de script.
- Información local visible y respuestas a consultas habituales en ES/EN/FR:
  oficinas, teléfono, email, consulta de viviendas y ayuda para vender.
- `robots.txt` permite el rastreo público y referencia el sitemap; `/api/` queda
  excluido del rastreo. No bloquea OAI-SearchBot ni otros buscadores de IA.
- `llms.txt` contiene un resumen y enlaces a fuentes canónicas, sin precios o
  inventario estático que pueda quedar desactualizado. Es complementario, no una
  garantía de inclusión o citas en respuestas de IA.
- El blog vacío lleva noindex y queda fuera del sitemap hasta tener publicaciones.
  Una página de paginación sin resultados devuelve 404.
- Redirect permanente del host www al dominio principal y normalización sin barra
  final. El catálogo y sitemap se siguen consultando en vivo, con anon y aislamiento
  por empresa/tipo/estado. No se han cambiado SQL, RLS, contenido remoto ni credenciales.

## Rendimiento y entrega

El bundle principal minificado pasó de aproximadamente 681 KB a 366 KB (un 46 %
menos). Blog, fichas, catálogo y SDK se cargan por separado; la consulta de destacados
empieza después del render de la portada. Esto no equivale a reducir un 46 % todos
los bytes descargados ni constituye una medición de Core Web Vitals.

Se elimina el @import CSS de fuentes: la hoja se descubre directamente en el head
con preconnect y display=swap. La imagen principal de portada y ficha tiene prioridad
alta; las secundarias permanecen lazy. Los assets CSS y módulos de cada ruta dinámica
se incorporan desde el manifest al HTML inicial para evitar contenido sin estilos.

Vite genera `server/site-template.generated.ts` y `server/static-pages.generated.ts`.
Las funciones consumen esos módulos y no necesitan `dist/index.html` en ejecución.
El build valida assets y falla si no puede preparar las páginas. No editar a mano
los módulos generados; incluirlos al guardar/subir el proyecto.

## Comprobaciones

- Compilación TypeScript de cliente/APIs y build Vite con páginas prerenderizadas.
- Pruebas de HTTP/HTML sin JavaScript, 404, canonical, paginación, errores de datos,
  noindex para filtros, datos estructurados y escape de JSON-LD, además de las pruebas
  previas de aislamiento, estados privados, UUID→slug, formularios y sitemap.
  Resultado final: 35 pruebas aprobadas y ESLint de los archivos SEO revisados correcto.
- Chromium local a 390, 768 y 1440 px, utilizando fixtures públicos: sin errores de
  hidratación, canonical duplicados ni desbordamiento; navegación catálogo→ficha,
  filtro de Barcelona y páginas de servicios/venta/equipo comprobados.
- Lectura real con anon: 8 enlaces de propiedades en catálogo, catálogo y ficha 200
  y JSON-LD presente. No se han enviado formularios ni emails reales.
- Paquetes reales del constructor local de Vercel para `property`, `blog`, `page`
  y `catalog`: respuesta 200 desde directorios sin `dist/index.html`. Esta comprobación
  no publica cambios ni sustituye la revisión del despliegue en producción.

## Qué falta fuera del código

1. Revisar y desplegar los cambios. No se han publicado desde este chat. Repetir
   `node scripts/audit-public-seo.mjs` tras el despliegue para comparar producción.
2. Verificar la propiedad de Search Console, enviar `/sitemap.xml`, solicitar
   indexación de páginas principales y revisar cobertura y Core Web Vitals. Hacer
   lo mismo con Bing Webmaster Tools si se dispone de acceso.
3. Mantener Google Business Profile coherente con nombre, direcciones, teléfono,
   horarios reales y fotografías. Esa cuenta no se ha modificado.
4. Confirmar los datos legales: el contenido existente incluye `B-12345678` como
   CIF de ejemplo. No se ha trasladado a datos estructurados ni se ha inventado el
   identificador correcto. Revisarlo con el responsable antes de ampliar su difusión.
5. Las traducciones actuales comparten URL. No se ha añadido hreflang ficticio:
   para posicionar versiones EN/FR harán falta URLs estables traducidas y su revisión.
6. Publicar contenido propio y actualizado con autoría verificable: guías de zonas
   atendidas, proceso de visita, preparación de una vivienda y casos reales con permiso.
   Los artículos sobre impuestos/documentación requieren revisión y fuentes vigentes.

## Criterio para IA y referencias

Google indica que las buenas prácticas SEO existentes se aplican a AI Overviews y
AI Mode, sin requerir archivos o marcado especial. Por eso se prioriza contenido
textual accesible, enlaces, información verificable y datos estructurados coherentes.
[Documentación de Google](https://developers.google.com/search/docs/appearance/ai-features).

OAI-SearchBot se utiliza para resultados de búsqueda de ChatGPT. Las decisiones de
rastreo para búsqueda y GPTBot/entrenamiento son independientes; esta implementación
no introduce bloqueos nuevos a bots públicos.
[Documentación de OpenAI](https://developers.openai.com/api/docs/bots).

Los datos de negocio ayudan a expresar la entidad y su contacto, pero no garantizan
resultados enriquecidos ni una posición en buscadores.
[Datos estructurados LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business).
