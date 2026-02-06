import { useState } from 'react';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import './Purchases.css';
import { useTranslation } from '../../utils/translations';
import type { Language } from '../../types';
import { mockProperties } from '../../utils/mockData';

interface PurchasesProps {
  language: Language;
}

export default function Purchases({ language }: PurchasesProps) {
  const t = useTranslation(language);
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const zones = ['all', 'Barcelona', 'Sitges', 'Sant Pere de Ribes', 'Vilanova i la Geltrú'];
  const bedroomOptions = ['all', '1', '2', '3', '4', '5+'];
  const propertyTypes = ['all', 'Piso', 'Casa', 'Villa', 'Ático', 'Dúplex'];

  const filteredProperties = mockProperties.filter(property => {
    const matchesZone = selectedZone === 'all' || property.attributes.zone === selectedZone;
    
    const matchesBedrooms = selectedBedrooms === 'all' || 
      (selectedBedrooms === '5+' ? property.attributes.bedrooms >= 5 : 
       property.attributes.bedrooms === parseInt(selectedBedrooms));
    
    const matchesType = selectedType === 'all' || property.attributes.property_type === selectedType;

    return matchesZone && matchesBedrooms && matchesType;
  });

  return (
    <div className="purchases-page">
      <section className="purchases-hero">
        <div className="container">
          <h1>{t('purchases.title')}</h1>
          <p>Encuentre la propiedad perfecta en la costa de Barcelona</p>
        </div>
      </section>

      <section className="purchases-content">
        <div className="container">
          <div className="purchases-filters">
            <h3>{t('purchases.filters')}</h3>
            
            <div className="filter-group">
              <label>Zona</label>
              <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)}>
                {zones.map(zone => (
                  <option key={zone} value={zone}>
                    {zone === 'all' ? 'Todas las zonas' : zone}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>{t('purchases.bedrooms')}</label>
              <select value={selectedBedrooms} onChange={(e) => setSelectedBedrooms(e.target.value)}>
                {bedroomOptions.map(option => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'Cualquiera' : option}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>{t('purchases.propertyType')}</label>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'Todos los tipos' : type}
                  </option>
                ))}
              </select>
            </div>

            <button 
              className="filter-reset"
              onClick={() => {
                setSelectedZone('all');
                setSelectedBedrooms('all');
                setSelectedType('all');
              }}
            >
              Limpiar filtros
            </button>
          </div>

          <div className="purchases-results">
            <div className="results-header">
              <p>{filteredProperties.length} propiedades encontradas</p>
            </div>

            <div className="properties-grid">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <div className="no-results">
                <p>No se encontraron propiedades con los filtros seleccionados.</p>
                <button onClick={() => {
                  setSelectedZone('all');
                  setSelectedBedrooms('all');
                  setSelectedType('all');
                }}>
                  Ver todas las propiedades
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
