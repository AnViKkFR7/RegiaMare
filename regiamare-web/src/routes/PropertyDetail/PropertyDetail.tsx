import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import './PropertyDetail.css';
import type { Language } from '../../types';
import { mockProperties } from '../../utils/mockData';

interface PropertyDetailProps {
  language: Language;
}

export default function PropertyDetail(_props: PropertyDetailProps) {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  
  // Find property by ID
  const property = mockProperties.find(p => p.id === id);
  
  if (!property) {
    return (
      <div className="property-not-found">
        <div className="container">
          <h1>Propiedad no encontrada</h1>
          <Link to="/purchases" className="btn-primary">Volver a propiedades</Link>
        </div>
      </div>
    );
  }

  const { attributes, media } = property;
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get all images
  const images = media.length > 0 ? media : [{ url: '/placeholder-property.jpg', type: 'image', is_primary: true }];

  return (
    <div className="property-detail">
      {/* Breadcrumb */}
      <div className="property-breadcrumb">
        <div className="container">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/purchases">Propiedades</Link>
          <span>/</span>
          <span>{property.title}</span>
        </div>
      </div>

      {/* Image Gallery */}
      <section className="property-gallery">
        <div className="container">
          <div className="gallery-main">
            <img src={images[selectedImage]?.url} alt={property.title} />
            <button className="gallery-nav gallery-prev" onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))} disabled={selectedImage === 0}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button className="gallery-nav gallery-next" onClick={() => setSelectedImage(Math.min(images.length - 1, selectedImage + 1))} disabled={selectedImage === images.length - 1}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          {images.length > 1 && (
            <div className="gallery-thumbnails">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img.url} alt={`Vista ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Property Info */}
      <section className="property-info-section">
        <div className="container">
          <div className="property-layout">
            {/* Main Info */}
            <div className="property-main">
              <div className="property-header-info">
                <div>
                  <span className="property-type-badge">{attributes.property_type.toUpperCase()}</span>
                  <h1 className="property-title">{property.title.toUpperCase()}</h1>
                  <p className="property-location">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3" fill="white"></circle>
                    </svg>
                    {attributes.city}, {attributes.zone} - {attributes.province}
                  </p>
                </div>
                <div className="property-price-box">
                  <span className="price-label">PRECIO</span>
                  <span className="price-value">{formatPrice(attributes.price)}</span>
                </div>
              </div>

              {/* Key Features */}
              <div className="property-features-grid">
                <div className="feature-box">
                  <div className="feature-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </div>
                  <div className="feature-content">
                    <span className="feature-value">{attributes.bedrooms}</span>
                    <span className="feature-label">Habitaciones</span>
                  </div>
                </div>

                <div className="feature-box">
                  <div className="feature-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 6h11"></path>
                      <path d="M12 9v12"></path>
                      <path d="M12 3v3"></path>
                    </svg>
                  </div>
                  <div className="feature-content">
                    <span className="feature-value">{attributes.bathrooms}</span>
                    <span className="feature-label">Baños</span>
                  </div>
                </div>

                <div className="feature-box">
                  <div className="feature-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                  </div>
                  <div className="feature-content">
                    <span className="feature-value">{attributes.built_surface}</span>
                    <span className="feature-label">m² Construidos</span>
                  </div>
                </div>

                {attributes.plot_surface && (
                  <div className="feature-box">
                    <div className="feature-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                        <line x1="7" y1="7" x2="7.01" y2="7"></line>
                      </svg>
                    </div>
                    <div className="feature-content">
                      <span className="feature-value">{attributes.plot_surface}</span>
                      <span className="feature-label">m² Parcela</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="property-description">
                <h2>DESCRIPCIÓN</h2>
                <p>{attributes.description || 'Magnífica propiedad en una ubicación privilegiada. Esta exclusiva vivienda ofrece todas las comodidades y servicios que pueda desear en un entorno de lujo y distinción.'}</p>
              </div>

              {/* Additional Features */}
              <div className="property-amenities">
                <h2>CARACTERÍSTICAS</h2>
                <div className="amenities-grid">
                  <div className="amenity-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>Estado: {attributes.condition}</span>
                  </div>
                  {attributes.elevator !== undefined && (
                    <div className="amenity-item">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      <span>{attributes.elevator ? 'Con ascensor' : 'Sin ascensor'}</span>
                    </div>
                  )}
                  {attributes.parking_spaces !== undefined && (
                    <div className="amenity-item">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      <span>{attributes.parking_spaces > 0 ? `${attributes.parking_spaces} plaza(s) parking` : 'Sin parking'}</span>
                    </div>
                  )}
                  {attributes.pool !== undefined && (
                    <div className="amenity-item">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      <span>{attributes.pool ? 'Con piscina' : 'Sin piscina'}</span>
                    </div>
                  )}
                  {attributes.garden !== undefined && (
                    <div className="amenity-item">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      <span>{attributes.garden ? 'Con jardín' : 'Sin jardín'}</span>
                    </div>
                  )}
                  {attributes.energy_certificate && (
                    <div className="amenity-item">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      <span>Certificación energética: {attributes.energy_certificate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Sidebar */}
            <aside className="property-sidebar">
              <div className="contact-card">
                <h3>¿INTERESADO EN ESTA PROPIEDAD?</h3>
                <p>Contacte con nosotros para más información o para agendar una visita</p>
                
                <div className="contact-actions">
                  <button className="btn-contact" onClick={() => setShowContactForm(true)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    SOLICITAR INFORMACIÓN
                  </button>
                  
                  <button className="btn-contact-secondary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    +34 931 234 567
                  </button>

                  <button className="btn-contact-secondary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    info@regiamare.com
                  </button>
                </div>

                {showContactForm && (
                  <div className="contact-form-modal">
                    <div className="modal-overlay" onClick={() => setShowContactForm(false)}></div>
                    <div className="modal-content">
                      <button className="modal-close" onClick={() => setShowContactForm(false)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                      <h3>Solicitar Información</h3>
                      <form className="contact-form">
                        <input type="text" placeholder="Nombre completo" required />
                        <input type="email" placeholder="Email" required />
                        <input type="tel" placeholder="Teléfono" required />
                        <textarea placeholder="Mensaje (opcional)" rows={4}></textarea>
                        <button type="submit" className="btn-submit">ENVIAR SOLICITUD</button>
                      </form>
                    </div>
                  </div>
                )}
              </div>

              <div className="property-ref-card">
                <div className="ref-item">
                  <span className="ref-label">Referencia</span>
                  <span className="ref-value">REF-{property.id.substring(0, 8).toUpperCase()}</span>
                </div>
                <div className="ref-item">
                  <span className="ref-label">Publicado</span>
                  <span className="ref-value">Hace 2 días</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
