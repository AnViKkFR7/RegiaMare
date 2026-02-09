import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import './Landing.css';
import { useTranslation } from '../../utils/translations';
import type { Language, Property } from '../../types';
import { getFeaturedProperties } from '../../services';

interface LandingProps {
  language: Language;
}

export default function Landing({ language }: LandingProps) {
  const t = useTranslation(language);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedProperties() {
      try {
        setIsLoading(true);
        const properties = await getFeaturedProperties();
        setFeaturedProperties(properties);
      } catch (error) {
        console.error('Error loading featured properties:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFeaturedProperties();
  }, []);

  return (
    <div className="landing">
      {/* Hero Section - Full Screen */}
      <section className="hero">
        <div className="hero-background">
          <img src="/2151986074.jpg" alt="Luxury Properties" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <img src="/logo-white.png" alt="Regia Mare" className="hero-logo" />
            <h1 className="hero-title">{t('landing.heroTitle')}</h1>
            <p className="hero-subtitle">
              {t('landing.heroSubtitle')}
            </p>
            <div className="hero-cta-group">
              <Link to="/purchases" className="hero-cta hero-cta-primary">
                {t('landing.exploreProperties')}
              </Link>
              <Link to="/sales" className="hero-cta hero-cta-secondary">
                {t('landing.sellProperty')}
              </Link>
            </div>
          </div>
          {/*}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Propiedades</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Zonas Premium</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Éxito</span>
            </div>
          </div>*/}
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>{t('landing.featuredProperties')}</h2>
            <p>{t('landing.featuredSubtitle')}</p>
          </div>

          <div className="featured-properties-grid">
            {isLoading ? (
              // Loading skeleton
              <>
                <div className="property-card-skeleton"></div>
                <div className="property-card-skeleton"></div>
              </>
            ) : featuredProperties.length > 0 ? (
              featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} featured language={language} />
              ))
            ) : (
              <p className="no-properties-message">{t('landing.noProperties')}</p>
            )}
          </div>

          <div className="section-cta">
            <Link to="/purchases" className="btn-secondary">
              {t('landing.viewAllProperties')}
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="value-section bg-surface">
        <div className="container">
          <div className="value-content">
            <div className="value-text">
              <h2>{t('landing.whyChooseUs')}</h2>
              <div className="value-points">
                <div className="value-point">
                  <div className="value-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3>{t('landing.personalizedAdvice')}</h3>
                    <p>{t('landing.personalizedAdviceDesc')}</p>
                  </div>
                </div>

                <div className="value-point">
                  <div className="value-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 6v6l4 2"></path>
                    </svg>
                  </div>
                  <div>
                    <h3>{t('landing.localExperience')}</h3>
                    <p>{t('landing.localExperienceDesc')}</p>
                  </div>
                </div>

                <div className="value-point">
                  <div className="value-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3>{t('landing.internationalReach')}</h3>
                    <p>{t('landing.internationalReachDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>{t('landing.ctaTitle')}</h2>
            <p>{t('landing.ctaSubtitle')}</p>
            <div className="cta-buttons">
              <Link to="/purchases" className="btn-primary">
                {t('landing.searchProperties')}
              </Link>
              <Link to="/sales"className="btn-outline">
                {t('landing.sellMyProperty')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
