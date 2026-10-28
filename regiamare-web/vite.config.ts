import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { embedSiteTemplate } from './scripts/embed-site-template.mjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'embed-server-html',
    apply: 'build',
    async writeBundle(options) {
      const { assets } = await embedSiteTemplate(resolve(options.dir || 'dist', 'index.html'))
      this.info(`HTML incorporado en las funciones con ${assets.length} assets verificados`)
    },
  }],
})
