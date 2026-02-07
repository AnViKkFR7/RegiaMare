import { Link } from 'react-router-dom';
import './Footer.css';
import { useTranslation } from '../../utils/translations';
import type { Language } from '../../types';

interface FooterProps {
  language: Language;
}

export default function Footer({ language }: FooterProps) {
  const t = useTranslation(language);

  return (
    <footer className="footer">
      <div className="footer-container container">
        <div className="footer-grid">
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/logo-footer.png" alt="Regia Mare Properties" />
            </div>
            <p className="footer-description">
              {t('footer.description')}
            </p>
          </div>

          <div className="footer-section">
            <h4>{t('footer.navigation')}</h4>
            <nav className="footer-nav">
              <Link to="/">{t('nav.home')}</Link>
              <Link to="/services">{t('nav.services')}</Link>
              <Link to="/purchases">{t('nav.purchases')}</Link>
              <Link to="/sales">{t('nav.sales')}</Link>
              <Link to="/about">{t('nav.about')}</Link>
            </nav>
          </div>

          <div className="footer-section">
            <h4>{t('footer.areas')}</h4>
            <nav className="footer-nav">
              <Link to="/purchases?zone=Barcelona">Barcelona</Link>
              <Link to="/purchases?zone=Sitges">Sitges</Link>
              <Link to="/purchases?zone=Sant Pere de Ribes">Sant Pere de Ribes</Link>
              <Link to="/purchases?zone=Vilanova i la Geltrú">Vilanova i la Geltrú</Link>
            </nav>
          </div>

          <div className="footer-section">
            <h4>{t('footer.contact')}</h4>
            <div className="footer-contact">
              <a href="mailto:info@regiamare.com">info@regiamare.com</a>
              <a href="tel:+34900000000">+34 900 000 000</a>
              <p>{t('footer.location')}</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Regia Mare Properties. {t('footer.rights')}.</p>
          <div className="footer-links">
            <Link to="/privacy">{t('footer.privacy')}</Link>
            <Link to="/legal">{t('footer.legal')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
