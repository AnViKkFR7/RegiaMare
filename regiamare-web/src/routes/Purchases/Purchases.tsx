import { useState, useEffect } from 'react';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import './Purchases.css';
import { useTranslation } from '../../utils/translations';
import type { Language } from '../../types';
import { 
  getFilteredPropertiesWithPagination, 
  getAvailableZones, 
  getAvailablePropertyTypes,
  getPriceRange,
  type PropertyFilters,
  type SortOption
} from '../../services';

interface PurchasesProps {
  language: Language;
}

export default function Purchases({ language }: PurchasesProps) {
  const t = useTranslation(language);
  const [properties, setProperties] = useState<any[]>([]);
  const [zones, setZones] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedOperationType, setSelectedOperationType] = useState<string>('');
  const [priceFrom, setPriceFrom] = useState<number>(0);
  const [priceTo, setPriceTo] = useState<number>(0);
  
  // Sort
  const [sortBy, setSortBy] = useState<SortOption>('oldest');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  // Mobile
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

  const bedroomOptions = ['1', '2', '3', '4', '5+'];
  const operationTypes = ['sale', 'rent'];

  // Load zones, property types, and price range on mount
  useEffect(() => {
    async function loadFilterOptions() {
      const [zonesData, typesData, priceRangeData] = await Promise.all([
        getAvailableZones(),
        getAvailablePropertyTypes(),
        getPriceRange()
      ]);
      setZones(zonesData);
      setPropertyTypes(typesData);
      setMaxPrice(priceRangeData.max);
      setPriceTo(priceRangeData.max);
    }
    loadFilterOptions();
  }, []);

  // Load properties when filters, sort or page change
  useEffect(() => {
    async function loadProperties() {
      setLoading(true);
      
      const filters: PropertyFilters = {};
      
      if (selectedZone) {
        filters.zone = selectedZone;
      }
      
      if (selectedBedrooms) {
        if (selectedBedrooms === '5+') {
          filters.minBedrooms = 5;
        } else {
          filters.minBedrooms = parseInt(selectedBedrooms);
        }
      }
      
      if (selectedType) {
        filters.propertyType = selectedType;
      }

      if (selectedOperationType) {
        filters.operationType = selectedOperationType;
      }

      if (priceFrom > 0) {
        filters.minPrice = priceFrom;
      }

      if (priceTo > 0 && priceTo < maxPrice) {
        filters.maxPrice = priceTo;
      }

      const result = await getFilteredPropertiesWithPagination(filters, currentPage, pageSize, sortBy);
      
      setProperties(result.properties);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
      setLoading(false);
    }
    
    if (maxPrice > 0) {
      loadProperties();
    }
  }, [selectedZone, selectedBedrooms, selectedType, selectedOperationType, priceFrom, priceTo, currentPage, sortBy, maxPrice]);

  const handleFilterChange = () => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedZone('');
    setSelectedBedrooms('');
    setSelectedType('');
    setSelectedOperationType('');
    setPriceFrom(0);
    setPriceTo(maxPrice);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const hasActiveFilters = () => {
    return selectedZone || selectedBedrooms || selectedType || selectedOperationType || 
           priceFrom > 0 || (priceTo > 0 && priceTo < maxPrice);
  };

  const applyMobileFilters = () => {
    setIsMobileFilterOpen(false);
    handleFilterChange();
  };

  const selectMobileSort = (option: SortOption) => {
    setSortBy(option);
    setIsMobileSortOpen(false);
    handleFilterChange();
  };

  return (
    <div className="purchases-page">
      <section className="purchases-hero">
        <div className="purchases-hero-background">
          <img src="/2151986113.jpg" alt="Purchases" />
          <div className="purchases-hero-overlay"></div>
        </div>
        <div className="container purchases-hero-content">
          <h1>{t('purchases.title')}</h1>
          <p>{t('purchases.heroSubtitle')}</p>
        </div>
      </section>

      {/* Mobile Filter Header */}
      <div className="mobile-filter-header">
        <div className="mobile-filter-buttons">
          <button 
            className="mobile-filter-button"
            onClick={() => setIsMobileFilterOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </svg>
            {t('purchases.filterButton')}
          </button>
          <button 
            className="mobile-sort-button"
            onClick={() => setIsMobileSortOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4"></path>
            </svg>
            {t('purchases.sortBy')}
          </button>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <div className={`mobile-filter-modal ${isMobileFilterOpen ? 'active' : ''}`}>
        <div className="mobile-filter-header-row">
          <h3>{t('purchases.filters')}</h3>
          <button 
            className="mobile-filter-close"
            onClick={() => setIsMobileFilterOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="mobile-filter-content">
          <div className="filter-group">
            <label>{t('purchases.zone')}</label>
            <select 
              value={selectedZone} 
              onChange={(e) => setSelectedZone(e.target.value)}
            >
              <option value="">{t('purchases.allZones')}</option>
              {zones.map(zone => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>{t('purchases.bedrooms')}</label>
            <select 
              value={selectedBedrooms} 
              onChange={(e) => setSelectedBedrooms(e.target.value)}
            >
              <option value="">{t('purchases.anyBedrooms')}</option>
              {bedroomOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>{t('purchases.propertyType')}</label>
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">{t('purchases.allTypes')}</option>
              {propertyTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>{t('purchases.operationType')}</label>
            <select 
              value={selectedOperationType} 
              onChange={(e) => setSelectedOperationType(e.target.value)}
            >
              <option value="">{t('purchases.allOperations')}</option>
              {operationTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'sale' ? t('purchases.sale') : t('purchases.rent')}
                </option>
              ))}
            </select>
          </div>

          <div className="price-range-container">
            <label>{t('purchases.priceRange')}</label>
            <div className="price-inputs">
              <div className="price-input">
                <label>{t('purchases.priceFrom')}</label>
                <input 
                  type="number" 
                  value={priceFrom}
                  onChange={(e) => setPriceFrom(Number(e.target.value))}
                  min={0}
                  max={maxPrice}
                />
              </div>
              <div className="price-input">
                <label>{t('purchases.priceTo')}</label>
                <input 
                  type="number" 
                  value={priceTo}
                  onChange={(e) => setPriceTo(Number(e.target.value))}
                  min={0}
                  max={maxPrice}
                />
              </div>
            </div>
            <div className="price-slider">
              <div 
                className="price-slider-track" 
                style={{
                  left: `${(priceFrom / maxPrice) * 100}%`,
                  width: `${((priceTo - priceFrom) / maxPrice) * 100}%`
                }}
              />
              <input 
                type="range" 
                min={0}
                max={maxPrice}
                value={priceFrom}
                onChange={(e) => setPriceFrom(Number(e.target.value))}
                style={{ zIndex: priceFrom > priceTo - (maxPrice * 0.05) ? 5 : 3 }}
              />
              <input 
                type="range" 
                min={0}
                max={maxPrice}
                value={priceTo}
                onChange={(e) => setPriceTo(Number(e.target.value))}
                style={{ zIndex: 4 }}
              />
            </div>
          </div>

          {hasActiveFilters() && (
            <button 
              className="mobile-filter-apply"
              onClick={applyMobileFilters}
            >
              {t('purchases.applyFilters')}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sort Modal */}
      <div className={`mobile-sort-modal ${isMobileSortOpen ? 'active'  : ''}`} onClick={() => setIsMobileSortOpen(false)}>
        <div className="mobile-sort-content" onClick={(e) => e.stopPropagation()}>
          <h3>{t('purchases.sortBy')}</h3>
          <div className="mobile-sort-options">
            <button 
              className={`mobile-sort-option ${sortBy === 'price_asc' ? 'active' : ''}`}
              onClick={() => selectMobileSort('price_asc')}
            >
              {t('purchases.sortPriceAsc')}
            </button>
            <button 
              className={`mobile-sort-option ${sortBy === 'price_desc' ? 'active' : ''}`}
              onClick={() => selectMobileSort('price_desc')}
            >
              {t('purchases.sortPriceDesc')}
            </button>
            <button 
              className={`mobile-sort-option ${sortBy === 'newest' ? 'active' : ''}`}
              onClick={() => selectMobileSort('newest')}
            >
              {t('purchases.sortNewest')}
            </button>
            <button 
              className={`mobile-sort-option ${sortBy === 'oldest' ? 'active' : ''}`}
              onClick={() => selectMobileSort('oldest')}
            >
              {t('purchases.sortOldest')}
            </button>
          </div>
        </div>
      </div>

      <section className="purchases-content">
        <div className="container">
          <div className="purchases-filters">
            <h3>{t('purchases.filters')}</h3>
            
            <div className="filter-group">
              <label>{t('purchases.zone')}</label>
              <select 
                value={selectedZone} 
                onChange={(e) => {
                  setSelectedZone(e.target.value);
                  handleFilterChange();
                }}
              >
                <option value="">{t('purchases.allZones')}</option>
                {zones.map(zone => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>{t('purchases.bedrooms')}</label>
              <select 
                value={selectedBedrooms} 
                onChange={(e) => {
                  setSelectedBedrooms(e.target.value);
                  handleFilterChange();
                }}
              >
                <option value="">{t('purchases.anyBedrooms')}</option>
                {bedroomOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>{t('purchases.propertyType')}</label>
              <select 
                value={selectedType} 
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  handleFilterChange();
                }}
              >
                <option value="">{t('purchases.allTypes')}</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>{t('purchases.operationType')}</label>
              <select 
                value={selectedOperationType} 
                onChange={(e) => {
                  setSelectedOperationType(e.target.value);
                  handleFilterChange();
                }}
              >
                <option value="">{t('purchases.allOperations')}</option>
                {operationTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'sale' ? t('purchases.sale') : t('purchases.rent')}
                  </option>
                ))}
              </select>
            </div>

            <div className="price-range-container">
              <label>{t('purchases.priceRange')}</label>
              <div className="price-inputs">
                <div className="price-input">
                  <label>{t('purchases.priceFrom')}</label>
                  <input 
                    type="number" 
                    value={priceFrom}
                    onChange={(e) => {
                      setPriceFrom(Number(e.target.value));
                      handleFilterChange();
                    }}
                    min={0}
                    max={maxPrice}
                  />
                </div>
                <div className="price-input">
                  <label>{t('purchases.priceTo')}</label>
                  <input 
                    type="number" 
                    value={priceTo}
                    onChange={(e) => {
                      setPriceTo(Number(e.target.value));
                      handleFilterChange();
                    }}
                    min={0}
                    max={maxPrice}
                  />
                </div>
              </div>
              <div className="price-slider">
                <div 
                  className="price-slider-track" 
                  style={{
                    left: `${(priceFrom / maxPrice) * 100}%`,
                    width: `${((priceTo - priceFrom) / maxPrice) * 100}%`
                  }}
                />
                <input 
                  type="range" 
                  min={0}
                  max={maxPrice}
                  value={priceFrom}
                  onChange={(e) => {
                    setPriceFrom(Number(e.target.value));
                    handleFilterChange();
                  }}
                  style={{ zIndex: priceFrom > priceTo - (maxPrice * 0.05) ? 5 : 3 }}
                />
                <input 
                  type="range" 
                  min={0}
                  max={maxPrice}
                  value={priceTo}
                  onChange={(e) => {
                    setPriceTo(Number(e.target.value));
                    handleFilterChange();
                  }}
                  style={{ zIndex: 4 }}
                />
              </div>
            </div>

            <button 
              className="filter-reset"
              onClick={clearFilters}
            >
              {t('purchases.clearFilters')}
            </button>
          </div>

          <div className="purchases-results">
            <div className="results-header">
              <p>{totalCount} {t('purchases.propertiesFound')}</p>
              
              <div className="sort-group">
                <label>{t('purchases.sortBy')}</label>
                <select 
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as SortOption);
                    handleFilterChange();
                  }}
                >
                  <option value="oldest">{t('purchases.sortOldest')}</option>
                  <option value="newest">{t('purchases.sortNewest')}</option>
                  <option value="price_asc">{t('purchases.sortPriceAsc')}</option>
                  <option value="price_desc">{t('purchases.sortPriceDesc')}</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading">
                <p>Cargando propiedades...</p>
              </div>
            ) : (
              <>
                <div className="properties-grid">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>

                {properties.length === 0 && (
                  <div className="no-results">
                    <p>{t('purchases.noResults')}</p>
                    <button onClick={clearFilters}>
                      {t('purchases.viewAll')}
                    </button>
                  </div>
                )}

                {totalPages > 1 && properties.length > 0 && (
                  <div className="pagination">
                    <button 
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      {t('purchases.previousPage')}
                    </button>
                    
                    <span className="pagination-info">
                      {t('purchases.pageOf')
                        .replace('{current}', currentPage.toString())
                        .replace('{total}', totalPages.toString())}
                    </span>
                    
                    <button 
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      {t('purchases.nextPage')}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
