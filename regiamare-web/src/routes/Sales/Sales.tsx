import { useState, useEffect } from 'react';
import './Sales.css';
import { useTranslation } from '../../utils/translations';
import type { Language } from '../../types';

interface SalesProps {
  language: Language;
}

export default function Sales({ language }: SalesProps) {
  const t = useTranslation(language);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    propertyType: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Detect mobile to keep accordion always open
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 700);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleAccordion = (index: number) => {
    if (isMobile) return; // Don't toggle on mobile
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Enviar email usando Supabase Edge Function
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase configuration missing');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          propertyType: formData.propertyType,
          message: formData.message
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }

      const result = await response.json();
      console.log('Email sent successfully:', result);

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        propertyType: '',
        message: ''
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Error sending email:', err);
      setError(t('form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const accordionItems = [
    {
      title: t('sales.accordion1.title'),
      description: t('sales.accordion1.description'),
      descriptionShort: t('sales.accordion1.descriptionShort')
    },
    {
      title: t('sales.accordion2.title'),
      description: t('sales.accordion2.description'),
      descriptionShort: t('sales.accordion2.descriptionShort')
    },
    {
      title: t('sales.accordion3.title'),
      description: t('sales.accordion3.description'),
      descriptionShort: t('sales.accordion3.descriptionShort')
    },
    {
      title: t('sales.accordion4.title'),
      description: t('sales.accordion4.description'),
      descriptionShort: t('sales.accordion4.descriptionShort')
    }
  ];

  return (
    <div className="sales-page">
      <section className="sales-hero">
        <div className="sales-hero-background">
          <img src="/2151986057.jpg" alt="Sales" />
          <div className="sales-hero-overlay"></div>
        </div>
        <div className="container sales-hero-content">
          <h1>{t('sales.title')}</h1>
          <p>{t('sales.heroSubtitle')}</p>
        </div>
      </section>

      <section className="sales-content">
        <div className="sales-layout">
          {/* Image - Desktop only */}
          <div className="sales-image">
            <img src="/2151986049.jpg" alt="Premium Property" />
          </div>

          {/* Content with accordion */}
          <div className="sales-main">
            <div className="sales-intro">
              <h2>{t('sales.mainTitle')}</h2>
              <p>{t('sales.mainSubtitle')}</p>
            </div>

            <div className="sales-accordion">
              {accordionItems.map((item, index) => (
                <div 
                  key={index} 
                  className={`accordion-item ${(isMobile || activeAccordion === index) ? 'active' : ''}`}
                >
                  <button 
                    className="accordion-header"
                    onClick={() => toggleAccordion(index)}
                    disabled={isMobile}
                  >
                    <span>{item.title}</span>
                    {!isMobile && (
                      <svg 
                        className="accordion-icon" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                      </svg>
                    )}
                  </button>
                  <div className="accordion-content">
                    <p>{isMobile ? item.descriptionShort : item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form - Right column for >1500px and tablet */}
          <div className="sales-form-wrapper">
            <form className="sales-form" onSubmit={handleSubmit}>
              <h3>{t('sales.cta')}</h3>
              
              <div className="form-group">
                <label htmlFor="name">{t('sales.name')}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">{t('sales.email')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">{t('sales.phone')}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">{t('sales.formAddress')}</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="propertyType">{t('sales.formPropertyType')}</label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t('sales.selectOption')}</option>
                  <option value="apartment">{t('sales.propertyTypeApartment')}</option>
                  <option value="house">{t('sales.propertyTypeHouse')}</option>
                  <option value="villa">{t('sales.propertyTypeVilla')}</option>
                  <option value="land">{t('sales.propertyTypeLand')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">{t('sales.message')}</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('sales.formPropertyInfo')}
                />
              </div>

              <button type="submit" className="form-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : t('sales.formSubmit')}
              </button>

              {submitted && (
                <div className="form-success">
                  {t('sales.formSuccess')}
                </div>
              )}
              
              {error && (
                <div className="form-error">
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
        
        {/* Form below - For 1024px-1500px */}
        <div className="sales-form-bottom">
          <form className="sales-form" onSubmit={handleSubmit}>
            <h3>{t('sales.cta')}</h3>
            
            <div className="form-group">
              <label htmlFor="name-bottom">{t('sales.name')}</label>
              <input
                type="text"
                id="name-bottom"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email-bottom">{t('sales.email')}</label>
              <input
                type="email"
                id="email-bottom"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone-bottom">{t('sales.phone')}</label>
              <input
                type="tel"
                id="phone-bottom"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address-bottom">{t('sales.formAddress')}</label>
              <input
                type="text"
                id="address-bottom"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="propertyType-bottom">{t('sales.formPropertyType')}</label>
              <select
                id="propertyType-bottom"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                required
              >
                <option value="">{t('sales.selectOption')}</option>
                <option value="apartment">{t('sales.propertyTypeApartment')}</option>
                <option value="house">{t('sales.propertyTypeHouse')}</option>
                <option value="villa">{t('sales.propertyTypeVilla')}</option>
                <option value="land">{t('sales.propertyTypeLand')}</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message-bottom">{t('sales.message')}</label>
              <textarea
                id="message-bottom"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder={t('sales.formPropertyInfo')}
              />
            </div>

            <button type="submit" className="form-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : t('sales.formSubmit')}
            </button>

            {submitted && (
              <div className="form-success">
                {t('sales.formSuccess')}
              </div>
            )}
            
            {error && (
              <div className="form-error">
                {error}
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
