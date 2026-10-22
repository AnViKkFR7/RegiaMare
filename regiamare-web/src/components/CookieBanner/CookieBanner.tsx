import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CookieBanner.css';
import { useTranslation } from '../../utils/translations';
import { globalPrivacyControl, measurementAllowed, needsDecision, readConsent, writeConsent } from '../../lib/consent';
import { setMeasurement } from '../../lib/analytics';
import type { Language } from '../../types';

interface CookieBannerProps {
  language: Language;
}

// El pie de página lanza este evento para reabrir el banner
const OPEN_COOKIE_PREFERENCES_EVENT = 'moira:open-cookie-preferences';

export default function CookieBanner({ language }: CookieBannerProps) {
  const t = useTranslation(language);
  const [isVisible, setIsVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  // Sin decisión previa, la señal Global Privacy Control cuenta como oposición
  const [measurement, setMeasurementOn] = useState(() => !globalPrivacyControl());

  useEffect(() => {
    const consent = readConsent();
    if (!needsDecision(consent)) return;
    // Show banner after a short delay for better UX
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // El enlace "Preferencias de cookies" del pie reabre el banner con los
  // interruptores a la vista y la decisión actual
  useEffect(() => {
    const open = () => {
      const consent = readConsent();
      setAnalytics(consent?.analytics ?? false);
      setMarketing(consent?.marketing ?? false);
      setMeasurementOn(measurementAllowed(consent));
      setShowPrefs(true);
      setIsVisible(true);
    };
    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, open);
    return () => window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, open);
  }, []);

  const decide = (decision: { analytics: boolean; marketing: boolean; measurement: boolean }) => {
    const saved = writeConsent(decision);
    setMeasurement(measurementAllowed(saved)); // surte efecto sin recargar
    setIsVisible(false);
    setShowPrefs(false);
    // Aquí se cargarían o descargarían GA4 / Meta según analytics y marketing
    // (hoy la web no carga ninguno).
  };

  if (!isVisible) return null;

  const switches = [
    { id: 'measurement', checked: measurement, onChange: setMeasurementOn },
    { id: 'analytics', checked: analytics, onChange: setAnalytics },
    { id: 'marketing', checked: marketing, onChange: setMarketing },
  ];

  return (
    <div className="cookie-banner" role="dialog" aria-label={t('cookies.banner.title')}>
      <div className="cookie-banner-content">
        <div className="cookie-banner-text">
          <h3>{t('cookies.banner.title')}</h3>
          <p>{t('cookies.banner.message')}</p>
          <Link to="/cookies" className="cookie-banner-link">
            {t('cookies.banner.more')}
          </Link>

          {showPrefs && (
            <div className="cookie-prefs">
              <div className="cookie-pref">
                <label>
                  <input type="checkbox" checked disabled />
                  <span className="cookie-pref-name">{t('cookies.prefs.necessary')}</span>
                </label>
                <p>{t('cookies.prefs.necessary.desc')}</p>
              </div>
              {switches.map(({ id, checked, onChange }) => (
                <div className="cookie-pref" key={id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => onChange(e.target.checked)}
                    />
                    <span className="cookie-pref-name">{t(`cookies.prefs.${id}`)}</span>
                  </label>
                  <p>{t(`cookies.prefs.${id}.desc`)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cookie-banner-actions">
          <button
            className="cookie-btn cookie-btn-accept"
            onClick={() => decide({ analytics: true, marketing: true, measurement: true })}
          >
            {t('cookies.banner.accept')}
          </button>
          {showPrefs ? (
            <button
              className="cookie-btn cookie-btn-reject"
              onClick={() => decide({ analytics, marketing, measurement })}
            >
              {t('cookies.prefs.save')}
            </button>
          ) : (
            <>
              {/* "Solo necesarias" no toca la medición sin cookies: la deja como esté */}
              <button
                className="cookie-btn cookie-btn-reject"
                onClick={() => decide({ analytics: false, marketing: false, measurement })}
              >
                {t('cookies.banner.reject')}
              </button>
              <button
                className="cookie-btn cookie-btn-reject"
                onClick={() => setShowPrefs(true)}
              >
                {t('cookies.banner.configure')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
