import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CookieBanner.css';
import { useTranslation } from '../../utils/translations';
import type { Language } from '../../types';

interface CookieBannerProps {
  language: Language;
}

export default function CookieBanner({ language }: CookieBannerProps) {
  const t = useTranslation(language);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a cookie choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setIsVisible(false);
    
    // Here you would initialize analytics and other tracking scripts
    // Example: window.gtag('consent', 'update', { analytics_storage: 'granted' });
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setIsVisible(false);
    
    // Here you would disable non-essential tracking
    // Example: window.gtag('consent', 'update', { analytics_storage: 'denied' });
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-banner-content">
        <div className="cookie-banner-text">
          <h3>{t('cookies.banner.title')}</h3>
          <p>{t('cookies.banner.message')}</p>
          <Link to="/cookies" className="cookie-banner-link">
            {t('cookies.banner.more')}
          </Link>
        </div>
        
        <div className="cookie-banner-actions">
          <button 
            className="cookie-btn cookie-btn-accept" 
            onClick={handleAccept}
          >
            {t('cookies.banner.accept')}
          </button>
          <button 
            className="cookie-btn cookie-btn-reject" 
            onClick={handleReject}
          >
            {t('cookies.banner.reject')}
          </button>
        </div>
      </div>
    </div>
  );
}
