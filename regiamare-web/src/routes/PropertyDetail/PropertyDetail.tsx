import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './PropertyDetail.css';
import type { Property } from '../../types';
import { getPropertyById, getPropertiesByZone } from '../../services/propertyService';
import ImageGallery from '../../components/ImageGallery/ImageGallery';
import type { Language } from '../../types';
import { useTranslation } from '../../utils/translations';

interface PropertyDetailProps {
  language: Language;
}

export default function PropertyDetail({ language }: PropertyDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const t = useTranslation(language);
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
  
  // Collapsible sections state (default: expanded)
  const [descriptionExpanded, setDescriptionExpanded] = useState(true);
  const [detailsExpanded, setDetailsExpanded] = useState(true);
  const [amenitiesExpanded, setAmenitiesExpanded] = useState(true);
  
  // Video modal state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

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
      setError(t('form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  // Get amenities with PNG icons
  const getAmenities = () => {
    if (!property) return [];
    
    const amenities: Array<{ key: string; label: string; icon: string }> = [];
    const attrs = property.attributes;

    // Air Conditioning
    if (attrs.air_conditioning && attrs.air_conditioning !== 'No') {
      amenities.push({
        key: 'air_conditioning',
        label: t('property.amenity.air_conditioning'),
        icon: '/air-conditioner.png'
      });
    }

    // Built-in Wardrobes
    if (attrs.built_in_wardrobes) {
      amenities.push({
        key: 'built_in_wardrobes',
        label: t('property.amenity.built_in_wardrobes'),
        icon: '/wardrobe.png'
      });
    }

    // Furnished
    if (attrs.furnished) {
      amenities.push({
        key: 'furnished',
        label: t('property.amenity.furnished'),
        icon: '/sofa.png'
      });
    }

    // Balcony
    if (attrs.has_balcony) {
      amenities.push({
        key: 'balcony',
        label: t('property.amenity.balcony'),
        icon: '/balcony.png'
      });
    }

    // Communal Gardens
    if (attrs.has_communal_gardens) {
      amenities.push({
        key: 'communal_gardens',
        label: t('property.amenity.communal_gardens'),
        icon: '/park.png'
      });
    }

    // Elevator
    if (attrs.has_elevator) {
      amenities.push({
        key: 'elevator',
        label: t('property.amenity.elevator'),
        icon: '/elevator.png'
      });
    }

    // Fireplace
    if (attrs.has_fireplace) {
      amenities.push({
        key: 'fireplace',
        label: t('property.amenity.fireplace'),
        icon: '/fireplace.png'
      });
    }

    // Garden and Patio (both required) or Garden only
    if (attrs.has_garden && attrs.has_patio) {
      amenities.push({
        key: 'garden_patio',
        label: t('property.amenity.garden_patio'),
        icon: '/watering-plants.png'
      });
    } else if (attrs.has_garden) {
      const label = attrs.garden_surface 
        ? `${t('property.amenity.garden')} ${attrs.garden_surface}m²`
        : t('property.amenity.garden');
      amenities.push({
        key: 'garden',
        label,
        icon: '/watering-plants.png'
      });
    }

    // Gym
    if (attrs.has_gym) {
      amenities.push({
        key: 'gym',
        label: t('property.amenity.gym'),
        icon: '/weight.png'
      });
    }

    // Home Automation
    if (attrs.has_home_automation) {
      amenities.push({
        key: 'home_automation',
        label: t('property.amenity.home_automation'),
        icon: '/smart-home.png'
      });
    }

    // Paddle/Tennis
    if (attrs.has_paddle_tennis) {
      amenities.push({
        key: 'paddle',
        label: t('property.amenity.paddle_tennis'),
        icon: '/paddle.png'
      });
    }

    // Terrace
    if (attrs.has_terrace) {
      const label = attrs.terrace_surface 
        ? `${t('property.amenity.terrace')} ${attrs.terrace_surface} m²`
        : t('property.amenity.terrace');
      amenities.push({
        key: 'terrace',
        label,
        icon: '/terrace.png'
      });
    }

    // Storage Room
    if (attrs.has_storage_room) {
      amenities.push({
        key: 'storage',
        label: t('property.amenity.storage_room'),
        icon: '/store-room.png'
      });
    }

    // Tourist License
    if (attrs.has_tourist_license) {
      amenities.push({
        key: 'tourist_license',
        label: t('property.amenity.tourist_license'),
        icon: '/licence.png'
      });
    }

    // Pets Allowed
    if (attrs.pets_allowed) {
      amenities.push({
        key: 'pets_allowed',
        label: t('property.amenity.pets_allowed'),
        icon: '/pawprint.png'
      });
    }

    // Swimming Pool
    if (attrs.pool_type && attrs.pool_type.trim() !== '') {
      amenities.push({
        key: 'pool',
        label: t('property.amenity.pool'),
        icon: '/swimming.png'
      });
    }

    return amenities;
  };

  if (loading) {
    return (
      <div className="property-detail-loading">
        <div className="spinner"></div>
        <p>{t('property.loading')}</p>
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
        <Link to="/">{t('property.breadcrumb.home')}</Link>
        <span className="breadcrumb-separator">/</span>
        <Link to="/purchases">{t('property.breadcrumb.purchases')}</Link>
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
                  <img src="/size.png" alt="superficie" className="basic-icon" />
                  <span>{attrs.built_surface} m²</span>
                </div>
                {attrs.bedrooms && (
                  <div className="property-basic-item">
                    <img src="/bed.png" alt="habitaciones" className="basic-icon" />
                    <span>{attrs.bedrooms} {t('property.basics.bedrooms')}</span>
                  </div>
                )}
                {attrs.bathrooms && (
                  <div className="property-basic-item">
                    <img src="/bathroom.png" alt="baños" className="basic-icon" />
                    <span>{attrs.bathrooms} {t('property.basics.bathrooms')}</span>
                  </div>
                )}
              </div>
              
              {/* Video Button */}
              {attrs.video_url && (
                <div className="property-video-section">
                  <button 
                    className="property-video-button"
                    onClick={() => setIsVideoModalOpen(true)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    {t('property.video.button')}
                  </button>
                </div>
              )}
            </div>
            <div className="property-price">
              <span className="price-label">{t('property.price_label')}</span>
              <span className="price-amount">{attrs.price?.toLocaleString('es-ES')} €</span>
            </div>
          </div>

          {/* Description */}
          <div className="property-description collapsible-section">
            <div className="section-header" onClick={() => setDescriptionExpanded(!descriptionExpanded)}>
              <h2>{t('property.description')}</h2>
              <svg 
                className={`chevron-icon ${descriptionExpanded ? 'expanded' : ''}`}
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            {descriptionExpanded && (
              <div className="collapsible-content">
                <p className="description-text">{(language === 'es' ? attrs.description : language === 'en' ? attrs.description_english : attrs.description_french)?.replace(/\\n/g, '') || ''}</p>
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="property-details-section collapsible-section">
            <div className="section-header" onClick={() => setDetailsExpanded(!detailsExpanded)}>
              <h2>{t('property.details.title')}</h2>
              <svg 
                className={`chevron-icon ${detailsExpanded ? 'expanded' : ''}`}
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            {detailsExpanded && (
              <div className="collapsible-content">
                <div className="details-grid">
              {attrs.internal_reference && <p><strong>{t('property.details.internal_reference')}:</strong> {attrs.internal_reference}</p>}
              {attrs.zone && <p><strong>{t('property.details.zone')}:</strong> {attrs.zone}</p>}
              {attrs.condition && <p><strong>{t('property.details.condition')}:</strong> {attrs.condition}</p>}
              {attrs.floor && <p><strong>{t('property.details.floor')}:</strong> {attrs.floor}</p>}
              {attrs.year_built && <p><strong>{t('property.details.year_built')}:</strong> {attrs.year_built}</p>}
              {attrs.energy_certificate && <p><strong>{t('property.details.energy_certificate')}:</strong> {attrs.energy_certificate}</p>}
              {attrs.usable_surface && <p><strong>{t('property.details.usable_surface')}:</strong> {attrs.usable_surface} m²</p>}
              {attrs.plot_surface && <p><strong>{t('property.details.plot_surface')}:</strong> {attrs.plot_surface} m²</p>}
              {attrs.garden_surface && <p><strong>{t('property.details.garden_surface')}:</strong> {attrs.garden_surface} m²</p>}
              {attrs.heating_type && <p><strong>{t('property.details.heating_type')}:</strong> {attrs.heating_type}</p>}
              {attrs.air_conditioning && <p><strong>{t('property.details.air_conditioning')}:</strong> {attrs.air_conditioning}</p>}
              {attrs.orientation && <p><strong>{t('property.details.orientation')}:</strong> {attrs.orientation}</p>}
              {attrs.kitchen_type && <p><strong>{t('property.details.kitchen_type')}:</strong> {attrs.kitchen_type}</p>}
              {attrs.furnished && <p><strong>{t('property.details.furnished')}:</strong> {attrs.furnished}</p>}
              {typeof attrs.is_exterior === 'boolean' && <p><strong>{t('property.details.is_exterior')}:</strong> {attrs.is_exterior ? t('common.yes') : t('common.no')}</p>}
              {attrs.security_type && <p><strong>{t('property.details.security_type')}:</strong> {attrs.security_type}</p>}
              {attrs.parking_spaces && attrs.parking_spaces > 0 && <p><strong>{t('property.details.parking_spaces')}:</strong> {attrs.parking_spaces}</p>}
              {attrs.parking_type && <p><strong>{t('property.details.parking_type')}:</strong> {attrs.parking_type}</p>}
              {attrs.garage_spaces && attrs.garage_spaces > 0 && <p><strong>{t('property.details.garage_spaces')}:</strong> {attrs.garage_spaces}</p>}
              {attrs.terrace_surface && <p><strong>{t('property.details.terrace_surface')}:</strong> {attrs.terrace_surface} m²</p>}
              {attrs.views && <p><strong>{t('property.details.views')}:</strong> {attrs.views}</p>}
              {attrs.distance_to_beach && <p><strong>{t('property.details.distance_to_beach')}:</strong> {attrs.distance_to_beach} m</p>}
              {attrs.distance_to_city_center && <p><strong>{t('property.details.distance_to_city_center')}:</strong> {attrs.distance_to_city_center} m</p>}
                </div>
              </div>
            )}
          </div>

          {/* Amenities */}
          {getAmenities().length > 0 && (
            <>
              <div className="property-amenities-section collapsible-section">
                <div className="section-header" onClick={() => setAmenitiesExpanded(!amenitiesExpanded)}>
                  <h2>{t('property.amenities.title')}</h2>
                  <svg 
                    className={`chevron-icon ${amenitiesExpanded ? 'expanded' : ''}`}
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                {amenitiesExpanded && (
                  <div className="collapsible-content">
                    <div className="amenities-grid">
                  {getAmenities().map(amenity => (
                    <div key={amenity.key} className="amenity-card">
                      <div className="amenity-icon"><img src={amenity.icon} alt={amenity.label} /></div>
                      <span className="amenity-label">{amenity.label}</span>
                    </div>
                  ))}
                    </div>
                  </div>
                )}
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
                alt={t('property.agent.alt')} 
                className="agent-photo"
              />
              <div className="agent-details">
                <h3 className="agent-name">David Delaunay</h3>
                <p className="agent-description">
                  {t('property.agent.description')}
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <form className="contact-form" onSubmit={handleContactSubmit}>
              <h3>{t('property.contact.title')}</h3>
              
              <input
                type="text"
                placeholder={t('property.contact.name_placeholder')}
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                required
              />
              
              <input
                type="tel"
                placeholder={t('property.contact.phone_placeholder')}
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                required
              />
              
              <input
                type="email"
                placeholder={t('property.contact.email_placeholder')}
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                required
              />

              {submitted && (
                <div className="form-success">
                  {t('property.contact.success_message')}
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
                {isSubmitting ? t('property.contact.submitting') : t('property.contact.submit_button')}
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
            <h2>{t('property.related.title')} {property.attributes.zone?.toUpperCase()}</h2>
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
                      {t('property.related.no_image')}
                    </div>
                  )}
                  <div className="related-property-overlay">
                    <span className="related-property-type">{relProp.attributes.property_type}</span>
                    <span className="related-property-price">
                      {relProp.attributes.price?.toLocaleString('es-ES')}€
                    </span>
                  </div>
                </div>
                <div className="related-property-title">
                  {relProp.title}
                </div>
                <div className="related-property-details">
                  <span className="related-property-detail">
                    <img src="/size.png" alt="superficie" width="16" height="16" />
                    {relProp.attributes.built_surface || relProp.attributes.usable_surface}m²
                  </span>
                  {relProp.attributes.bedrooms && (
                    <span className="related-property-detail">
                      <img src="/bed.png" alt="habitaciones" width="16" height="16" />
                      {relProp.attributes.bedrooms}
                    </span>
                  )}
                  {relProp.attributes.bathrooms && (
                    <span className="related-property-detail">
                      <img src="/bathroom.png" alt="baños" width="16" height="16" />
                      {relProp.attributes.bathrooms}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Video Modal */}
      {isVideoModalOpen && attrs.video_url && (
        <div className="video-modal" onClick={() => setIsVideoModalOpen(false)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setIsVideoModalOpen(false)}>
              ×
            </button>
            <div className="video-iframe-container">
              <iframe
                src={getYouTubeEmbedUrl(attrs.video_url)}
                title="Property Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
