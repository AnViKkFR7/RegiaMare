import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './PropertyDetail.css';
import type { Property } from '../../types';
import { getPropertyById } from '../../services/propertyService';
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

  // Get amenities that are true or have value
  const getAmenities = () => {
    if (!property) return [];
    
    const amenities: Array<{ key: string; label: string; icon: string }> = [];
    const attrs = property.attributes;

    // Available boolean amenities from PropertyAttributes type
    if (attrs.elevator) {
      amenities.push({ key: 'elevator', label: 'Ascensor', icon: '🛗' });
    }
    if (attrs.terrace) {
      amenities.push({ key: 'terrace', label: 'Terraza', icon: '☀️' });
    }
    if (attrs.garden) {
      amenities.push({ key: 'garden', label: 'Jardín', icon: '�' });
    }
    if (attrs.pool) {
      amenities.push({ key: 'pool', label: 'Piscina', icon: '🏊' });
    }
    if (attrs.parking) {
      amenities.push({ key: 'parking', label: 'Parking', icon: '🚗' });
    }
    if (attrs.storage_room) {
      amenities.push({ key: 'storage_room', label: 'Trastero', icon: '📦' });
    }
    if (attrs.security_system) {
      amenities.push({ key: 'security_system', label: 'Seguridad', icon: '🔒' });
    }
    if (attrs.accessibility) {
      amenities.push({ key: 'accessibility', label: 'Accesibilidad', icon: '♿' });
    }
    if (attrs.heating) {
      amenities.push({ key: 'heating', label: 'Calefacción', icon: '🔥' });
    }
    if (attrs.cooling) {
      amenities.push({ key: 'cooling', label: 'Aire Acondicionado', icon: '❄️' });
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
                {[attrs.zone, attrs.city, attrs.province].filter(Boolean).join(', ')}
              </p>
              <div className="property-basics">
                <div className="property-basic-item">
                  <span className="basic-icon">📐</span>
                  <span>{attrs.built_surface} m²</span>
                </div>
                {attrs.bedrooms && (
                  <div className="property-basic-item">
                    <span className="basic-icon">🛏️</span>
                    <span>{attrs.bedrooms} hab.</span>
                  </div>
                )}
                {attrs.bathrooms && (
                  <div className="property-basic-item">
                    <span className="basic-icon">🚿</span>
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

          <div className="property-separator"></div>

          {/* Description */}
          <div className="property-description">
            <h2>DESCRIPCIÓN</h2>
            <p>{property.description || attrs.description}</p>
          </div>

          <div className="property-separator"></div>

          {/* Property Details */}
          <div className="property-details-section">
            <h2>DETALLES DE LA PROPIEDAD</h2>
            <div className="details-grid">
              {attrs.zone && (
                <div className="detail-item">
                  <span className="detail-label">Zona</span>
                  <span className="detail-value">{attrs.zone}</span>
                </div>
              )}
              {attrs.condition && (
                <div className="detail-item">
                  <span className="detail-label">Estado</span>
                  <span className="detail-value">{attrs.condition}</span>
                </div>
              )}
              {attrs.year_built && (
                <div className="detail-item">
                  <span className="detail-label">Año de construcción</span>
                  <span className="detail-value">{attrs.year_built}</span>
                </div>
              )}
              {attrs.energy_certificate && (
                <div className="detail-item">
                  <span className="detail-label">Certificación energética</span>
                  <span className="detail-value">{attrs.energy_certificate}</span>
                </div>
              )}
              {attrs.useful_surface && (
                <div className="detail-item">
                  <span className="detail-label">Superficie útil</span>
                  <span className="detail-value">{attrs.useful_surface} m²</span>
                </div>
              )}
              {attrs.plot_surface && (
                <div className="detail-item">
                  <span className="detail-label">Superficie parcela</span>
                  <span className="detail-value">{attrs.plot_surface} m²</span>
                </div>
              )}
              {attrs.garden_surface && (
                <div className="detail-item">
                  <span className="detail-label">Superficie jardín</span>
                  <span className="detail-value">{attrs.garden_surface} m²</span>
                </div>
              )}
              {attrs.heating && (
                <div className="detail-item">
                  <span className="detail-label">Calefacción</span>
                  <span className="detail-value">{attrs.heating}</span>
                </div>
              )}
              {attrs.cooling && (
                <div className="detail-item">
                  <span className="detail-label">Refrigeración</span>
                  <span className="detail-value">{attrs.cooling}</span>
                </div>
              )}
              {attrs.orientation && (
                <div className="detail-item">
                  <span className="detail-label">Orientación</span>
                  <span className="detail-value">{attrs.orientation}</span>
                </div>
              )}
              {attrs.parking_spaces && attrs.parking_spaces > 0 && (
                <div className="detail-item">
                  <span className="detail-label">Plazas de parking</span>
                  <span className="detail-value">{attrs.parking_spaces}</span>
                </div>
              )}
              {attrs.parking_type && (
                <div className="detail-item">
                  <span className="detail-label">Tipo de parking</span>
                  <span className="detail-value">{attrs.parking_type}</span>
                </div>
              )}
              {attrs.garage_spaces && attrs.garage_spaces > 0 && (
                <div className="detail-item">
                  <span className="detail-label">Plazas de garaje</span>
                  <span className="detail-value">{attrs.garage_spaces}</span>
                </div>
              )}
              {attrs.terrace_surface && (
                <div className="detail-item">
                  <span className="detail-label">Superficie terraza</span>
                  <span className="detail-value">{attrs.terrace_surface} m²</span>
                </div>
              )}
              {attrs.views && (
                <div className="detail-item">
                  <span className="detail-label">Vistas</span>
                  <span className="detail-value">{attrs.views}</span>
                </div>
              )}
              {attrs.distance_to_beach && (
                <div className="detail-item">
                  <span className="detail-label">Distancia a la playa</span>
                  <span className="detail-value">{attrs.distance_to_beach} m</span>
                </div>
              )}
              {attrs.distance_to_city_center && (
                <div className="detail-item">
                  <span className="detail-label">Distancia al centro</span>
                  <span className="detail-value">{attrs.distance_to_city_center} m</span>
                </div>
              )}
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
                      <span className="amenity-icon">{amenity.icon}</span>
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
                <h3 className="agent-name">Mohammed bin Rahil</h3>
                <div className="agent-rating">
                  <span className="stars">⭐</span>
                  <span className="rating-score">4.9</span>
                </div>
                <p className="agent-description">
                  Agente inmobiliario experimentado especializado en propiedades de lujo en la costa. Comprometido en ofrecer un servicio excepcional y encontrar la propiedad perfecta para cada cliente.
                </p>
              </div>
            </div>

            <div className="property-separator"></div>

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
    </div>
  );
}
