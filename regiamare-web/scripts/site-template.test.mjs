import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile, access, mkdtemp, writeFile, unlink, rmdir } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { embedSiteTemplate } from './embed-site-template.mjs'
import ts from 'typescript'

test('el HTML incorporado coincide con el build y todos sus assets existen', async () => {
  const generated = await readFile('server/site-template.generated.ts', 'utf8')
  const js = ts.transpileModule(generated, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
  const { siteTemplate } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`)
  assert.equal(siteTemplate, await readFile('dist/index.html', 'utf8'))
  for (const asset of siteTemplate.match(/\/assets\/[\w.-]+\.(?:js|css)/g) ?? []) await access(`dist${asset}`)
})
test('el generador rechaza un HTML sin compilar o sin puntos de inserción', async () => {
  const directory = await mkdtemp(resolve('node_modules/.tmp/template-validation-'))
  const html = join(directory, 'index.html')
  const output = join(directory, 'template.ts')
  try {
    await writeFile(html, '<html><body>No root</body></html>')
    await assert.rejects(embedSiteTemplate(html, output), /puntos de inserción/)
    await writeFile(html, '<title>Test</title><div id="root"></div><script src="/src/main.tsx"></script>')
    await assert.rejects(embedSiteTemplate(html, output), /vite build/)
    await assert.rejects(access(output))
  } finally { await unlink(html); await rmdir(directory) }
})
