import { readFile, writeFile, access } from 'node:fs/promises'
import { dirname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

export async function embedSiteTemplate(htmlPath = 'dist/index.html', outputPath = 'server/site-template.generated.ts') {
  const html = await readFile(htmlPath, 'utf8')
  if (!html.includes('<div id="root"></div>') || !/<title>[^<]*<\/title>/.test(html)) {
    throw new Error('El HTML de Vite no contiene los puntos de inserción del renderizado de servidor')
  }
  const assets = [...new Set(html.match(/\/assets\/[\w.-]+\.(?:js|css)/g) ?? [])]
  if (!assets.some(path => path.endsWith('.js')) || !assets.some(path => path.endsWith('.css'))) {
    throw new Error('El HTML debe proceder de vite build e incluir los assets compilados')
  }
  const directory = resolve(dirname(htmlPath))
  for (const asset of assets) {
    const path = resolve(directory, asset.slice(1))
    if (!path.startsWith(directory + sep)) throw new Error('Asset fuera del directorio de salida')
    await access(path)
  }
  const manifest = JSON.parse(await readFile(resolve(directory, '.vite/manifest.json'), 'utf8').catch(() => '{}'))
  const routes = { '/property/': 'src/routes/PropertyDetail/PropertyDetail.tsx', '/blog': 'src/routes/Blog/Blog.tsx', '/purchases': 'src/routes/Purchases/Purchases.tsx' }
  const routeAssets = {}
  for (const [path, entry] of Object.entries(routes)) {
    const chunk = manifest[entry]
    if (!chunk) continue
    const files = [...(chunk.css || []), chunk.file].filter(Boolean)
    for (const file of files) {
      if (!file.startsWith('assets/') || file.includes('..')) throw new Error('Asset de ruta inválido')
      await access(resolve(directory, file))
    }
    routeAssets[path] = { css: (chunk.css || []).map(file => '/' + file), script: '/' + chunk.file }
  }
  await writeFile(outputPath, '// Generado por scripts/embed-site-template.mjs después de vite build.\n'
    + '// Incluye el HTML en la función; no necesita dist/index.html en runtime.\n'
    + `export const siteTemplate: string = ${JSON.stringify(html)}\n`
    + `export const routeAssets: Record<string, { css: string[]; script?: string }> = ${JSON.stringify(routeAssets)}\n`)
  return { assets }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { assets } = await embedSiteTemplate()
  console.log(`HTML de servidor incorporado con ${assets.length} assets verificados.`)
}
