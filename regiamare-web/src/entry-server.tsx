import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { AppContent } from './App'
export function renderStaticRoute(path: string) {
  return renderToString(<StaticRouter location={path}><AppContent /></StaticRouter>)
}
