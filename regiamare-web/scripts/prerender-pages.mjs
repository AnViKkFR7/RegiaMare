import { createServer } from 'vite'
import react from '@vitejs/plugin-react'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'

export async function prerenderPages(outputDirectory = 'dist') {
  const shell = await readFile(resolve(outputDirectory, 'index.html'), 'utf8')
  const server = await createServer({ configFile: false, plugins: [react()],
    server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' })
  try {
    const { renderStaticRoute } = await server.ssrLoadModule('/src/entry-server.tsx')
    const { STATIC_SEO, staticMetadata } = await server.ssrLoadModule('/src/lib/seo.ts')
    const { renderDocument } = await server.ssrLoadModule('/server/html.ts')
    const { siteOrigin } = await server.ssrLoadModule('/src/lib/siteConfig.ts')
    const origin = siteOrigin(process.env.SITE_URL || process.env.VITE_SITE_URL)
    const pages = {}
    for (const path of [...Object.keys(STATIC_SEO).filter(path => path !== '/purchases'), '/__not-found__']) {
      const metadata = staticMetadata(path, origin)
      const html = renderDocument(metadata, renderStaticRoute(path), shell)
        .replace('<div id="root">', '<div id="root" data-prerender="static">')
      const missing = path === '/__not-found__'
      pages[missing ? '*' : path] = { html, status: missing ? 404 : 200, index: metadata.index !== false }
      const file = resolve(outputDirectory, missing ? '404.html' : path === '/' ? 'index.html' : `${path.slice(1)}/index.html`)
      await mkdir(dirname(file), { recursive: true })
      await writeFile(file, html)
    }
    await writeFile('server/static-pages.generated.ts', '// Generado por scripts/prerender-pages.mjs; sin datos privados ni catálogo estático.\n'
      + `export const staticPages: Record<string, { html: string; index: boolean; status: number }> = ${JSON.stringify(pages)}\n`)
    return Object.keys(pages).length
  } finally { await server.close() }
}
