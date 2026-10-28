import { supabase } from './supabase';
import type { Property } from '../types';
import { loadPublicProperties, loadPublicProperty } from '../lib/properties';

// Los errores se propagan a la UI: vacío solo significa una consulta sin filas.
export const getAllProperties = () => loadPublicProperties(supabase);
export const getPropertyById = (reference: string) => loadPublicProperty(supabase, reference);

/**
 * Gets 2 featured properties based on is_featured attribute.
 * - If 2+ have is_featured=true → the 2 most expensive among them.
 * - If exactly 1 has is_featured=true → that one + the most expensive non-featured.
 * - If none have is_featured=true → the 2 most expensive overall.
 */
export async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const properties = await getAllProperties();

    const byPriceDesc = (a: Property, b: Property) =>
      (b.attributes.price || 0) - (a.attributes.price || 0);

    const featured = properties.filter(p => p.attributes.is_featured === true);

    if (featured.length >= 2) {
      return featured.sort(byPriceDesc).slice(0, 2);
    }

    if (featured.length === 1) {
      const nonFeatured = properties
        .filter(p => !p.attributes.is_featured)
        .sort(byPriceDesc);
      return [featured[0], ...nonFeatured.slice(0, 1)];
    }

    // No featured properties — fall back to 2 most expensive
    return properties.sort(byPriceDesc).slice(0, 2);
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    throw error;
  }
}

/**
 * Gets properties filtered by zone
 */
export async function getPropertiesByZone(zone: string): Promise<Property[]> {
  try {
    const properties = await getAllProperties();
    
    return properties.filter(prop => 
      prop.attributes.zone?.toLowerCase() === zone.toLowerCase()
    );
  } catch (error) {
    console.error('Error fetching properties by zone:', error);
    throw error;
  }
}

/**
 * Filter options interface
 */
export interface PropertyFilters {
  zone?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  minBedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  operationType?: string;
}

/**
 * Gets properties with multiple filters applied
 */
export async function getFilteredProperties(filters: PropertyFilters): Promise<Property[]> {
  try {
    let properties = await getAllProperties();

    // Apply zone filter
    if (filters.zone) {
      properties = properties.filter(prop => 
        prop.attributes.zone?.toLowerCase() === filters.zone?.toLowerCase()
      );
    }

    // Apply price filters
    if (filters.minPrice !== undefined) {
      properties = properties.filter(prop => 
        (prop.attributes.price || 0) >= filters.minPrice!
      );
    }
    if (filters.maxPrice !== undefined) {
      properties = properties.filter(prop => 
        (prop.attributes.price || 0) <= filters.maxPrice!
      );
    }

    // Apply bedroom filters
    if (filters.bedrooms !== undefined) {
      properties = properties.filter(prop => 
        prop.attributes.bedrooms === filters.bedrooms
      );
    }
    if (filters.minBedrooms !== undefined) {
      properties = properties.filter(prop => 
        (prop.attributes.bedrooms || 0) >= filters.minBedrooms!
      );
    }

    // Apply bathroom filter
    if (filters.bathrooms !== undefined) {
      properties = properties.filter(prop => 
        prop.attributes.bathrooms === filters.bathrooms
      );
    }

    // Apply property type filter
    if (filters.propertyType) {
      properties = properties.filter(prop => 
        prop.attributes.property_type?.toLowerCase() === filters.propertyType?.toLowerCase()
      );
    }

    // Apply operation type filter
    if (filters.operationType) {
      properties = properties.filter(prop => 
        prop.attributes.operation_type?.toLowerCase() === filters.operationType?.toLowerCase()
      );
    }

    return properties;
  } catch (error) {
    console.error('Error filtering properties:', error);
    throw error;
  }
}

/**
 * Gets unique zones from all published properties
 */
export async function getAvailableZones(): Promise<string[]> {
  try {
    const properties = await getAllProperties();
    
    const zones = new Set<string>();
    properties.forEach(prop => {
      if (prop.attributes.zone) {
        zones.add(prop.attributes.zone);
      }
    });

    return Array.from(zones).sort();
  } catch (error) {
    console.error('Error fetching available zones:', error);
    throw error;
  }
}

/**
 * Gets unique property types from all published properties
 */
export async function getAvailablePropertyTypes(): Promise<string[]> {
  try {
    const properties = await getAllProperties();
    
    const types = new Set<string>();
    properties.forEach(prop => {
      if (prop.attributes.property_type) {
        types.add(prop.attributes.property_type);
      }
    });

    return Array.from(types).sort();
  } catch (error) {
    console.error('Error fetching available property types:', error);
    throw error;
  }
}

/**
 * Gets price range (min and max) from all published properties
 */
export async function getPriceRange(): Promise<{ min: number; max: number }> {
  try {
    const properties = await getAllProperties();
    
    const prices = properties
      .map(prop => prop.attributes.price)
      .filter((price): price is number => price !== undefined);

    if (prices.length === 0) {
      return { min: 0, max: 0 };
    }

    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  } catch (error) {
    console.error('Error fetching price range:', error);
    throw error;
  }
}

/**
 * Pagination result interface
 */
export interface PaginatedPropertiesResult {
  properties: Property[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

/**
 * Sort options type
 */
export type SortOption = 'price_asc' | 'price_desc' | 'newest' | 'oldest';

/**
 * Gets filtered properties with pagination and sorting
 */
export async function getFilteredPropertiesWithPagination(
  filters: PropertyFilters,
  page: number = 1,
  pageSize: number = 20,
  sortBy: SortOption = 'oldest'
): Promise<PaginatedPropertiesResult> {
  try {
    // Get all filtered properties
    let properties = await getFilteredProperties(filters);

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        properties = properties.sort((a, b) => 
          (a.attributes.price || 0) - (b.attributes.price || 0)
        );
        break;
      case 'price_desc':
        properties = properties.sort((a, b) => 
          (b.attributes.price || 0) - (a.attributes.price || 0)
        );
        break;
      case 'newest':
        properties = properties.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case 'oldest':
      default:
        properties = properties.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
    }

    const totalCount = properties.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const paginatedProperties = properties.slice(startIndex, endIndex);

    return {
      properties: paginatedProperties,
      totalCount,
      totalPages,
      currentPage: page,
      pageSize
    };
  } catch (error) {
    console.error('Error fetching paginated properties:', error);
    throw error;
  }
}
