import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Header.css';
import { useTranslation } from '../../utils/translations';
import type { Language } from '../../types';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Header({ language, onLanguageChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslation(language);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container container">
        <Link to="/" className="header-logo">
          <img src="/logo-header.png" alt="Regia Mare Properties" />
        </Link>

        <button 
          className={`header-menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>{t('nav.home')}</Link>
          <Link to="/services" onClick={() => setIsMenuOpen(false)}>{t('nav.services')}</Link>
          <Link to="/purchases" onClick={() => setIsMenuOpen(false)}>{t('nav.purchases')}</Link>
          <Link to="/sales" onClick={() => setIsMenuOpen(false)}>{t('nav.sales')}</Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)}>{t('nav.about')}</Link>
          
          {/* Language selector for mobile < 550px */}
          <div className="header-language-mobile">
            <button 
              className={language === 'es' ? 'active' : ''} 
              onClick={() => { onLanguageChange('es'); setIsMenuOpen(false); }}
            >
              ES
            </button>
            <button 
              className={language === 'en' ? 'active' : ''} 
              onClick={() => { onLanguageChange('en'); setIsMenuOpen(false); }}
            >
              EN
            </button>
            <button 
              className={language === 'fr' ? 'active' : ''} 
              onClick={() => { onLanguageChange('fr'); setIsMenuOpen(false); }}
            >
              FR
            </button>
          </div>
        </nav>

        <div className="header-language">
          <button 
            className={language === 'es' ? 'active' : ''} 
            onClick={() => onLanguageChange('es')}
          >
            ES
          </button>
          <button 
            className={language === 'en' ? 'active' : ''} 
            onClick={() => onLanguageChange('en')}
          >
            EN
          </button>
          <button 
            className={language === 'fr' ? 'active' : ''} 
            onClick={() => onLanguageChange('fr')}
          >
            FR
          </button>
        </div>
      </div>
    </header>
  );
}
