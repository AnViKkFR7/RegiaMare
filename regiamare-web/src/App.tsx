import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { trackPageview } from './lib/analytics';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import CookieBanner from './components/CookieBanner/CookieBanner';
import ScrollToTop from './components/ScrollToTop';
import Landing from './routes/Landing/Landing';
import Services from './routes/Services/Services';
import Sales from './routes/Sales/Sales';
import About from './routes/About/About';
import Privacy from './routes/Privacy/Privacy';
import Legal from './routes/Legal/Legal';
import Cookies from './routes/Cookies/Cookies';
import NotFound from './routes/NotFound/NotFound';
import { staticMetadata, STATIC_SEO } from './lib/seo';
import { applySeo } from './lib/seoHead';
import { siteOrigin } from './lib/siteConfig';
import type { Language } from './types';
import './styles/globals.css';
import './App.css';

const Purchases = lazy(() => import('./routes/Purchases/Purchases'));
const PropertyDetail = lazy(() => import('./routes/PropertyDetail/PropertyDetail'));
const Blog = lazy(() => import('./routes/Blog/Blog'));

function PageviewTracker() {
  const location = useLocation();
  useEffect(() => {
    trackPageview(location.pathname);
    if (STATIC_SEO[location.pathname]) applySeo(staticMetadata(location.pathname, siteOrigin(import.meta.env.VITE_SITE_URL)));
  }, [location.pathname]);
  return null;
}

export function AppContent() {
  const [language, setLanguage] = useState<Language>('es');
  useEffect(() => { document.documentElement.lang = language; }, [language]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <>
      <ScrollToTop />
      <PageviewTracker />
      <div className="app">
        <Header language={language} onLanguageChange={handleLanguageChange} />
        
        <main className="app-main">
          <Suspense fallback={<p role="status">Cargando…</p>}><Routes>
            <Route path="/" element={<Landing language={language} />} />
            <Route path="/services" element={<Services language={language} />} />
            <Route path="/purchases" element={<Purchases language={language} />} />
            <Route path="/property/:id" element={<PropertyDetail language={language} />} />
            <Route path="/sales" element={<Sales language={language} />} />
            <Route path="/about" element={<About language={language} />} />
            <Route path="/blog" element={<Blog language={language} />} />
            <Route path="/blog/:slug" element={<Blog language={language} />} />
            <Route path="/privacy" element={<Privacy language={language} />} />
            <Route path="/legal" element={<Legal language={language} />} />
            <Route path="/cookies" element={<Cookies language={language} />} />
            <Route path="*" element={<NotFound language={language} />} />
          </Routes></Suspense>
        </main>

        <Footer language={language} />
        <CookieBanner language={language} />
      </div>
    </>
  );
}

export default function App() { return <Router><AppContent /></Router>; }
