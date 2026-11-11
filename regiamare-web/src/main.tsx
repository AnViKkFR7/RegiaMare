import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initAutoTracking } from './lib/analytics'
import { STATIC_SEO } from './lib/seo'

initAutoTracking()

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
const root = document.getElementById('root')!
if (root.dataset.prerender === 'static' && STATIC_SEO[window.location.pathname] && window.location.pathname !== '/purchases') hydrateRoot(root, app)
else createRoot(root).render(app)
