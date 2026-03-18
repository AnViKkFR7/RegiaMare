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
              <a href="tel:+34669887791">+34 669 887 791</a>
              <a
                href="https://www.google.com/maps/place/Carrer+d'Antoni+Gaud%C3%AD,+18,+08870+Sitges,+Barcelona"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none', display: 'block', marginBottom: 4 }}
              >
                {t('footer.location')}
              </a>
              <a
                href="https://www.google.com/maps/place/Av+Palfuriana,+126,+43880+Coma-ruga,+Tarragona"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}
              >
                {t('footer.location_comarruga')}
              </a>
              <div className="footer-social">
                <span>Redes sociales:</span>
                <a
                  href="https://www.instagram.com/regiamareproperties/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Regia Mare Properties"
                  className="footer-social-link"
                >
                  <svg fill="currentColor" width="18" height="18" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <g>
                      <path d="M22.3,8.4c-0.8,0-1.4,0.6-1.4,1.4c0,0.8,0.6,1.4,1.4,1.4c0.8,0,1.4-0.6,1.4-1.4C23.7,9,23.1,8.4,22.3,8.4z"/>
                      <path d="M16,10.2c-3.3,0-5.9,2.7-5.9,5.9s2.7,5.9,5.9,5.9s5.9-2.7,5.9-5.9S19.3,10.2,16,10.2z M16,19.9c-2.1,0-3.8-1.7-3.8-3.8c0-2.1,1.7-3.8,3.8-3.8c2.1,0,3.8,1.7,3.8,3.8C19.8,18.2,18.1,19.9,16,19.9z"/>
                      <path d="M20.8,4h-9.5C7.2,4,4,7.2,4,11.2v9.5c0,4,3.2,7.2,7.2,7.2h9.5c4,0,7.2-3.2,7.2-7.2v-9.5C28,7.2,24.8,4,20.8,4z M25.7,20.8c0,2.7-2.2,5-5,5h-9.5c-2.7,0-5-2.2-5-5v-9.5c0-2.7,2.2-5,5-5h9.5c2.7,0,5,2.2,5,5V20.8z"/>
                    </g>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Regia Mare Properties. {t('footer.rights')}.
            <span style={{ margin: '0 12px', color: 'inherit' }}>|</span>
            <a
              href="https://moiraordo.es/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}
            >
              Developed by MoiraOrdo
            </a>
          </p>
          <div className="footer-links">
            <Link to="/privacy">{t('footer.privacy')}</Link>
            <Link to="/legal">{t('footer.legal')}</Link>
            <Link to="/cookies">{t('footer.cookies')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
