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
  await writeFile(outputPath, '// Generado por scripts/embed-site-template.mjs después de vite build.\n'
    + '// Incluye el HTML en la función; no necesita dist/index.html en runtime.\n'
    + `export const siteTemplate: string = ${JSON.stringify(html)}\n`)
  return { assets }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { assets } = await embedSiteTemplate()
  console.log(`HTML de servidor incorporado con ${assets.length} assets verificados.`)
}
