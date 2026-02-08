/**
 * Services barrel export
 * Centralized export point for all service modules
 */

// Supabase client and configuration
export { supabase, isSupabaseConfigured, config } from './supabase';

// Property services
export {
  getAllProperties,
  getPropertyById,
  getFeaturedProperties,
  getPropertiesByZone,
  getFilteredProperties,
  getFilteredPropertiesWithPagination,
  getAvailableZones,
  getAvailablePropertyTypes,
  getPriceRange,
  type PropertyFilters,
  type PaginatedPropertiesResult,
  type SortOption
} from './propertyService';

// Attribute definition services
export {
  getAttributeDefinitions,
  getFilterableAttributes,
  getRequiredAttributes,
  getAttributeDefinitionByKey,
  getAttributeDefinitionsByDataType
} from './attributeDefinitionService';

// Attribute transformer utilities
export {
  transformAttributesToPropertyAttributes,
  validateRequiredAttributes,
  getAttributeByKey,
  createFilterableAttributesMap,
  type AttributeValue,
  type AttributeDefinition
} from './attributeTransformer';
