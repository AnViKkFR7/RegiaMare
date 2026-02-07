import './About.css';
import { useTranslation } from '../../utils/translations';
import type { Language } from '../../types';

interface AboutProps {
  language: Language;
}

export default function About({ language }: AboutProps) {
  const t = useTranslation(language);
  
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-background">
          <img src="/2151986063.jpg" alt="About" />
          <div className="about-hero-overlay"></div>
        </div>
        <div className="container about-hero-content">
          <h1>{t('about.title')}</h1>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-text">
            <p className="about-lead">
              {t('about.lead')}
            </p>

            <p>
              {t('about.text1')}
            </p>

            <p>
              {t('about.text2')}
            </p>
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="container">
          <h2>{t('about.valuesTitle')}</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3>{t('about.value.proximity.title')}</h3>
              <p>{t('about.value.proximity.description')}</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3>{t('about.value.professionalism.title')}</h3>
              <p>{t('about.value.professionalism.description')}</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
              </div>
              <h3>{t('about.value.commitment.title')}</h3>
              <p>{t('about.value.commitment.description')}</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h3>{t('about.value.transparency.title')}</h3>
              <p>{t('about.value.transparency.description')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta-section">
          <div className="about-cta">
            <h2>{t('about.ctaTitle')}</h2>
            <p>
              {t('about.ctaText')}
            </p>
            <div className="about-contact">
              <a href="mailto:info@regiamare.com" className="contact-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                info@regiamare.com
              </a>
              <a href="tel:+34900000000" className="contact-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                +34 900 000 000
              </a>
            </div>
          </div>
      </section>
    </div>
  );
}
