import { useState } from 'react';
import './Sales.css';
import { useTranslation } from '../../utils/translations';
import type { Language } from '../../types';

interface SalesProps {
  language: Language;
}

export default function Sales({ language }: SalesProps) {
  const t = useTranslation(language);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual form submission to Supabase or email
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="sales-page">
      <section className="sales-hero">
        <div className="container">
          <h1>{t('sales.title')}</h1>
          <p>Valoramos su propiedad y le ayudamos a venderla al mejor precio</p>
        </div>
      </section>

      <section className="sales-content">
        <div className="container">
          <div className="sales-grid">
            <div className="sales-info">
              <h2>Vendemos su propiedad de forma premium</h2>
              <p>
                En Regia Mare Properties, entendemos que vender una propiedad es una decisión importante. 
                Por eso ofrecemos un servicio integral que maximiza el valor de su inmueble y asegura 
                una venta eficiente y sin complicaciones.
              </p>

              <div className="sales-benefits">
                <div className="sales-benefit">
                  <div className="benefit-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3>Valoración profesional gratuita</h3>
                    <p>Tasamos su propiedad sin compromiso</p>
                  </div>
                </div>

                <div className="sales-benefit">
                  <div className="benefit-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div>
                    <h3>Marketing premium</h3>
                    <p>Fotografía profesional y promoción internacional</p>
                  </div>
                </div>

                <div className="sales-benefit">
                  <div className="benefit-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div>
                    <h3>Acompañamiento completo</h3>
                    <p>Le guiamos en cada paso del proceso</p>
                  </div>
                </div>

                <div className="sales-benefit">
                  <div className="benefit-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3>Gestión legal y documental</h3>
                    <p>Nos encargamos de todos los trámites</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sales-form-container">
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
                  <label htmlFor="message">{t('sales.message')}</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Cuéntenos sobre su propiedad..."
                  />
                </div>

                <button type="submit" className="form-submit">
                  Solicitar valoración
                </button>

                {submitted && (
                  <div className="form-success">
                    ¡Gracias! Nos pondremos en contacto con usted pronto.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
