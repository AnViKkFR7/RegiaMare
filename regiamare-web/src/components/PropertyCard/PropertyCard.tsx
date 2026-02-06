import { Link } from 'react-router-dom';
import type { Property } from '../../types';
import './PropertyCard.css';

interface PropertyCardProps {
  property: Property;
  featured?: boolean;
}

export default function PropertyCard({ property, featured = false }: PropertyCardProps) {
  const { attributes, media } = property;
  
  // Get primary image or use placeholder
  const primaryImage = media.find(m => m.is_primary)?.url || media[0]?.url || '/placeholder-property.jpg';
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Link to={`/property/${property.id}`} className={`property-card ${featured ? 'featured' : ''}`}>
      <div className="property-card-image">
        <img src={primaryImage} alt={property.title} loading="lazy" />
        <div className="property-card-overlay">
          {featured && <span className="property-badge featured-badge">DESTACADO</span>}
          <span className="property-badge type-badge">{attributes.property_type.toUpperCase()}</span>
        </div>
      </div>
      
      <div className="property-card-content">
        <div className="property-card-header">
          <h3 className="property-card-title">{property.title.toUpperCase()}</h3>
          <p className="property-card-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3" fill="white"></circle>
            </svg>
            {attributes.city}, {attributes.zone}
          </p>
        </div>

        <p className="property-card-price">{formatPrice(attributes.price)}</p>

        <div className="property-card-features">
          <div className="property-feature-item">
            <span className="feature-value">{attributes.bedrooms}</span>
            <span className="feature-label">Habitaciones</span>
          </div>
          
          <div className="property-feature-divider"></div>
          
          <div className="property-feature-item">
            <span className="feature-value">{attributes.bathrooms}</span>
            <span className="feature-label">Baños</span>
          </div>
          
          <div className="property-feature-divider"></div>
          
          <div className="property-feature-item">
            <span className="feature-value">{attributes.built_surface}</span>
            <span className="feature-label">m²</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
