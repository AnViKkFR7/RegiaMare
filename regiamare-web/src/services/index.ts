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
  getAvailableZones,
  getAvailablePropertyTypes,
  getPriceRange,
  type PropertyFilters
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
