import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './PropertyDetail.css';
import type { Property } from '../../types';
import { getPropertyById, getPropertiesByZone } from '../../services/propertyService';
import ImageGallery from '../../components/ImageGallery/ImageGallery';
import type { Language } from '../../types';

interface PropertyDetailProps {
  language: Language;
}

export default function PropertyDetail({ language }: PropertyDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProperties, setRelatedProperties] = useState<Property[]>([]);
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperty() {
      if (!id) {
        navigate('/purchases');
        return;
      }

      setLoading(true);
      const data = await getPropertyById(id);
      
      if (!data) {
        navigate('/purchases');
        return;
      }

      setProperty(data);
      setLoading(false);
    }

    fetchProperty();
  }, [id, navigate]);

  // Fetch related properties by zone
  useEffect(() => {
    async function fetchRelatedProperties() {
      if (!property?.attributes.zone) return;
      
      const properties = await getPropertiesByZone(property.attributes.zone);
      // Filter out current property and limit to 4
      const filtered = properties
        .filter(p => p.id !== property.id)
        .slice(0, 4);
      setRelatedProperties(filtered);
    }

    if (property) {
      fetchRelatedProperties();
    }
  }, [property]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
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
          name: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone,
          address: property?.attributes.zone || property?.attributes.city || 'No especificada',
          propertyType: property?.title || 'Consulta de propiedad',
          message: `Consulta sobre la propiedad: ${property?.title || id}\nURL: ${window.location.href}`
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }

      setSubmitted(true);
      setContactForm({ name: '', phone: '', email: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Error sending contact request:', err);
      setError('Hubo un error al enviar el formulario. Por favor, inténtelo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get amenities with SVG icons
  const getAmenities = () => {
    if (!property) return [];
    
    const amenities: Array<{ key: string; label: string; svgPath: React.ReactElement }> = [];
    const attrs = property.attributes;

    // Air Conditioning
    if (attrs.air_conditioning && attrs.air_conditioning !== 'No') {
      amenities.push({
        key: 'air_conditioning',
        label: 'Aire Acondicionado',
        svgPath: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v10m0 10V12m0 0l-3-3m3 3l3-3m-3 3l-3 3m3-3l3 3"/>
            <path d="M12 2L9 5M12 2l3 3"/>
            <path d="M15 12h6m-18 0h6"/>
          </svg>
        )
      });
    }

    // Built-in Wardrobes
    if (attrs.built_in_wardrobes) {
      amenities.push({
        key: 'built_in_wardrobes',
        label: 'Armarios Empotrados',
        svgPath: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="2" width="18" height="20" rx="2"/>
            <line x1="12" y1="2" x2="12" y2="22"/>
            <circle cx="8" cy="12" r="1"/>
            <circle cx="16" cy="12" r="1"/>
          </svg>
        )
      });
    }

    // Furnished
    if (attrs.furnished) {
      amenities.push({
        key: 'furnished',
        label: 'Amueblado',
        svgPath: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9v11h18V9"/>
            <path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/>
            <line x1="3" y1="14" x2="21" y2="14"/>
          </svg>
        )
      });
    }

    // Balcony
    if (attrs.has_balcony) {
      amenities.push({
        key: 'balcony',
        label: 'Balcón',
        svgPath: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18"/>
            <path d="M6 12v8M10 12v8M14 12v8M18 12v8"/>
            <path d="M3 20h18"/>
          </svg>
        )
      });
    }

    // Communal Gardens
    if (attrs.has_communal_gardens) {
      amenities.push({
        key: 'communal_gardens',
        label: 'Jardines Comunitarios',
        svgPath: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22v-8m0 0c-2.5 0-5-2-5-5a5 5 0 0 1 10 0c0 3-2.5 5-5 5z"/>
            <path d="M17 9c0-2.5-2-5-5-5S7 6.5 7 9"/>
          </svg>
        )
      });
    }

    // Elevator
    if (attrs.has_elevator) {
      amenities.push({
        key: 'elevator',
        label: 'Ascensor',
        svgPath: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2"/>
            <path d="M10 9l2-2 2 2"/>
            <path d="M10 15l2 2 2-2"/>
          </svg>
        )
      });
    }

    // Fireplace
    if (attrs.has_fireplace) {
      amenities.push({
        key: 'fireplace',
        label: 'Chimenea',
        svgPath: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2c0 0-6 4-6 10a6 6 0 0 0 12 0c0-6-6-10-6-10z"/>
            <path d="M12 22v-6"/>
          </svg>
        )
      });
    }

    // Garden with Patio (both required)
    if (attrs.has_garden || attrs.has_patio) {
      amenities.push({
        key: 'garden_patio',
        label: 'Jardín y Patio',
        svgPath: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22v-8m0 0c-2.5 0-5-2-5-5a5 5 0 0 1 10 0c0 3-2.5 5-5 5z"/>
            <path d="M17 9c0-2.5-2-5-5-5S7 6.5 7 9"/>
          </svg>
        )
      });
    }

    // Gym
    if (attrs.has_gym) {
      amenities.push({
        key: 'gym',
        label: 'Gimnasio',
        svgPath: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6.5 6.5l11 11"/>
            <path d="M21 3l-1 1-4-4-1 1 4 4-1 1-4-4-1 1 4 4-1 1-4-4-1 1 4 4-1 1-11-11"/>
            <path d="M3 21l1-1"/>
          </svg>
        )
      });
    }

    // Home Automation
    if (attrs.has_home_automation) {
      amenities.push({
        key: 'home_automation',
        label: 'Domótica',
        svgPath: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        )
      });
    }

    // Paddle/Tennis
    if (attrs.has_paddle_tennis) {
      amenities.push({
        key: 'paddle',
        label: 'Pádel/Tenis',
        svgPath: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2v20"/>
            <path d="M2 12h20"/>
          </svg>
        )
      });
    }

    // Terrace
    if (attrs.has_terrace) {
      const label = attrs.terrace_surface 
        ? `Terraza ${attrs.terrace_surface}m²`
        : 'Terraza';
      amenities.push({
        key: 'terrace',
        label,
        svgPath: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12l9-9 9 9"/>
            <path d="M5 10v12h14V10"/>
            <path d="M9 21v-8h6v8"/>
          </svg>
        )
      });
    }

    // Storage Room
    if (attrs.has_storage_room) {
      amenities.push({
        key: 'storage',
        label: 'Trastero',
        svgPath: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
        )
      });
    }

    // Tourist License
    if (attrs.has_tourist_license) {
      amenities.push({
        key: 'tourist_license',
        label: 'Licencia Turística',
        svgPath: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
        )
      });
    }

    // Pets Allowed
    if (attrs.pets_allowed) {
      amenities.push({
        key: 'pets_allowed',
        label: 'Se Admiten Mascotas',
        svgPath: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="4" r="2"/>
            <circle cx="18" cy="8" r="2"/>
            <circle cx="20" cy="16" r="2"/>
            <circle cx="9" cy="10" r="2"/>
            <path d="M13 22c-2 0-4-2-4-4 0-2 2-4 4-4s4 2 4 4c0 2-2 4-4 4z"/>
          </svg>
        )
      });
    }

    // Swimming Pool
    if (attrs.pool_type && attrs.pool_type.trim() !== '') {
      amenities.push({
        key: 'pool',
        label: 'Piscina',
        svgPath: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 15c.6.5 1.2 1 2.5 1 1.3 0 1.9-.5 2.5-1 .6-.5 1.2-1 2.5-1s1.9.5 2.5 1c.6.5 1.2 1 2.5 1 1.3 0 1.9-.5 2.5-1 .6-.5 1.3-1 2.5-1 1.2 0 1.9.5 2.5 1"/>
            <path d="M2 19c.6.5 1.2 1 2.5 1 1.3 0 1.9-.5 2.5-1 .6-.5 1.2-1 2.5-1s1.9.5 2.5 1c.6.5 1.2 1 2.5 1 1.3 0 1.9-.5 2.5-1 .6-.5 1.3-1 2.5-1 1.2 0 1.9.5 2.5 1"/>
          </svg>
        )
      });
    }


    return amenities;
  };

  if (loading) {
    return (
      <div className="property-detail-loading">
        <div className="spinner"></div>
        <p>Cargando propiedad...</p>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  const attrs = property.attributes;
  const images = property.media.filter(m => m.media_type === 'image');

  return (
    <div className="property-detail">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Inicio</Link>
        <span className="breadcrumb-separator">/</span>
        <Link to="/purchases">Compras</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{property.title}</span>
      </div>

      {/* Image Gallery */}
      <ImageGallery images={images} propertyTitle={property.title} language={language} />

      {/* Main Content */}
      <div className="property-content">
        {/* Left Column - Property Details */}
        <div className="property-main">
          {/* Title and Location */}
          <div className="property-header">
            <div className="property-title-section">
              <h1 className="property-title">{property.title}</h1>
              <p className="property-location">
                {[ attrs.city, attrs.province ].filter(Boolean).join(', ')}
              </p>
              <div className="property-basics">
                <div className="property-basic-item">
                  <svg className="basic-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <line x1="3" y1="9" x2="21" y2="9"/>
                    <line x1="9" y1="21" x2="9" y2="9"/>
                  </svg>
                  <span>{attrs.built_surface} m²</span>
                </div>
                {attrs.bedrooms && (
                  <div className="property-basic-item">
                    <svg className="basic-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 11h18v10H3z"/>
                      <path d="M6 11V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/>
                      <line x1="3" y1="11" x2="3" y2="17"/>
                      <line x1="21" y1="11" x2="21" y2="17"/>
                    </svg>
                    <span>{attrs.bedrooms} hab.</span>
                  </div>
                )}
                {attrs.bathrooms && (
                  <div className="property-basic-item">
                    <svg className="basic-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 22v-4m6 4v-4"/>
                      <path d="M12 6v3"/>
                      <path d="M6 9h12a3 3 0 0 1 3 3v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2a3 3 0 0 1 3-3z"/>
                    </svg>
                    <span>{attrs.bathrooms} baños</span>
                  </div>
                )}
              </div>
            </div>
            <div className="property-price">
              <span className="price-label">PRECIO</span>
              <span className="price-amount">{attrs.price?.toLocaleString('es-ES')} €</span>
            </div>
          </div>

          {/* Description */}
          <div className="property-description">
            <h2>DESCRIPCIÓN</h2>
            <p className="description-text">{language === 'es' ? attrs.description : language === 'en' ? attrs.description_english : attrs.description_french}</p>
          </div>

          {/* Property Details */}
          <div className="property-details-section">
            <h2>DETALLES DE LA PROPIEDAD</h2>
            <div className="details-grid">
              {attrs.zone && <p><strong>Zona:</strong> {attrs.zone}</p>}
              {attrs.condition && <p><strong>Estado:</strong> {attrs.condition}</p>}
              {attrs.year_built && <p><strong>Año de construcción:</strong> {attrs.year_built}</p>}
              {attrs.energy_certificate && <p><strong>Certificación energética:</strong> {attrs.energy_certificate}</p>}
              {attrs.usable_surface && <p><strong>Superficie útil:</strong> {attrs.usable_surface} m²</p>}
              {attrs.plot_surface && <p><strong>Superficie parcela:</strong> {attrs.plot_surface} m²</p>}
              {attrs.garden_surface && <p><strong>Superficie jardín:</strong> {attrs.garden_surface} m²</p>}
              {attrs.heating_type && <p><strong>Calefacción:</strong> {attrs.heating_type}</p>}
              {attrs.air_conditioning && <p><strong>Refrigeración:</strong> {attrs.air_conditioning}</p>}
              {attrs.orientation && <p><strong>Orientación:</strong> {attrs.orientation}</p>}
              {attrs.parking_spaces && attrs.parking_spaces > 0 && <p><strong>Plazas de parking:</strong> {attrs.parking_spaces}</p>}
              {attrs.parking_type && <p><strong>Tipo de parking:</strong> {attrs.parking_type}</p>}
              {attrs.garage_spaces && attrs.garage_spaces > 0 && <p><strong>Plazas de garaje:</strong> {attrs.garage_spaces}</p>}
              {attrs.terrace_surface && <p><strong>Superficie terraza:</strong> {attrs.terrace_surface} m²</p>}
              {attrs.views && <p><strong>Vistas:</strong> {attrs.views}</p>}
              {attrs.distance_to_beach && <p><strong>Distancia a la playa:</strong> {attrs.distance_to_beach} m</p>}
              {attrs.distance_to_city_center && <p><strong>Distancia al centro:</strong> {attrs.distance_to_city_center} m</p>}
            </div>
          </div>

          {/* Amenities */}
          {getAmenities().length > 0 && (
            <>
              <div className="property-separator"></div>
              <div className="property-amenities-section">
                <h2>CARACTERÍSTICAS Y COMODIDADES</h2>
                <div className="amenities-grid">
                  {getAmenities().map(amenity => (
                    <div key={amenity.key} className="amenity-card">
                      <div className="amenity-icon">{amenity.svgPath}</div>
                      <span className="amenity-label">{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Column - Agent Card */}
        <div className="property-sidebar">
          <div className="agent-card">
            <div className="agent-info">
              <img 
                src="/file.jpg" 
                alt="Mohammed bin Rahil" 
                className="agent-photo"
              />
              <div className="agent-details">
                <h3 className="agent-name">David Delaunay</h3>
                <p className="agent-description">
                  Agente inmobiliario experimentado especializado en propiedades de lujo en la costa. Comprometido en ofrecer un servicio excepcional y encontrar la propiedad perfecta para cada cliente.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <form className="contact-form" onSubmit={handleContactSubmit}>
              <h3>SOLICITAR INFORMACIÓN</h3>
              
              <input
                type="text"
                placeholder="Nombre completo"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                required
              />
              
              <input
                type="tel"
                placeholder="Teléfono"
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                required
              />
              
              <input
                type="email"
                placeholder="Correo electrónico"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                required
              />

              {submitted && (
                <div className="form-success">
                  ✓ Mensaje enviado correctamente. Nos pondremos en contacto pronto.
                </div>
              )}

              {error && (
                <div className="form-error">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className="contact-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'ENVIAR SOLICITUD'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Related Properties Section */}
      {relatedProperties.length > 0 && (
        <div className="related-properties-section">
          <Link 
            to={`/purchases?zone=${encodeURIComponent(property.attributes.zone || '')}`}
            className="related-properties-header"
          >
            <h2>MÁS PROPIEDADES EN {property.attributes.zone?.toUpperCase()}</h2>
          </Link>
          <div className="related-properties-grid">
            {relatedProperties.map(relProp => (
              <Link 
                key={relProp.id}
                to={`/property/${relProp.id}`}
                className="related-property-card"
              >
                <div className="related-property-image">
                  {relProp.media && relProp.media.length > 0 ? (
                    <img 
                      src={relProp.media[0].url} 
                      alt={relProp.title}
                    />
                  ) : (
                    <div className="related-property-no-image">
                      Sin imagen
                    </div>
                  )}
                </div>
                <div className="related-property-title">
                  {relProp.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
