import './Services.css';
import { useTranslation } from '../../utils/translations';
import type { Language } from '../../types';

interface ServicesProps {
  language: Language;
}

export default function Services({ language }: ServicesProps) {
  const t = useTranslation(language);

  return (
    <div className="services-page">
      <section className="services-hero">
        <div className="services-hero-background">
          <img src="/2151986065.jpg" alt="Services" />
          <div className="services-hero-overlay"></div>
        </div>
        <div className="container services-hero-content">
          <h1>{t('services.title')}</h1>
          <p>{t('services.subtitle')}</p>
        </div>
      </section>

      <section className="services-grid-section">
        <div className="container">
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h3>{t('service.sales.title')}</h3>
              <p>{t('service.sales.description')}</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h3>{t('service.valuation.title')}</h3>
              <p>{t('service.valuation.description')}</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </div>
              <h3>{t('service.staging.title')}</h3>
              <p>{t('service.staging.description')}</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                </svg>
              </div>
              <h3>{t('service.rental.title')}</h3>
              <p>{t('service.rental.description')}</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <h3>{t('service.international.title')}</h3>
              <p>{t('service.international.description')}</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h3>{t('service.legal.title')}</h3>
              <p>{t('service.legal.description')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="services-detail-section">
        <div className="container">
          <div className="services-detail">
            <h2>{t('services.integralApproach')}</h2>
            <p>
              {t('services.integralText1')}
            </p>
            <p>
              {t('services.integralText2')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
