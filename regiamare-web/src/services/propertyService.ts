import { supabase } from './supabase';
import type { Property, ItemMedia } from '../types';
import { 
  transformAttributesToPropertyAttributes, 
  validateRequiredAttributes,
  type AttributeValue 
} from './attributeTransformer';

/**
 * Constants
 */
const COMPANY_ID = 'eac2ccbe-cc36-40cd-bb7e-d5fe44de972d';
const ITEM_TYPE = 'regiamare_property';

/**
 * Raw database response types
 */
interface ItemFromDB {
  id: string;
  company_id: string;
  title: string;
  summary: string | null;
  status: string;
  item_type: string;
  created_at: string;
  updated_at: string;
  attribute_values: AttributeValue[];
  item_media: ItemMediaFromDB[];
}

interface ItemMediaFromDB {
  id: string;
  item_id: string;
  file_type: 'image' | 'pdf' | 'other';
  url_externa: string;
  title: string | null;
  alt_text: string | null;
  sort_order: number;
  metadata: any;
  created_at: string;
}

/**
 * Transforms ItemMedia from database format to application format
 */
function transformItemMedia(dbMedia: ItemMediaFromDB[]): ItemMedia[] {
  return dbMedia
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(media => ({
      id: media.id,
      item_id: media.item_id,
      media_type: media.file_type,
      url: media.url_externa,
      alt_text: media.alt_text || media.title || '',
      display_order: media.sort_order,
      is_primary: media.sort_order === 0,
      created_at: media.created_at
    }));
}

/**
 * Transforms raw database item to Property type
 */
function transformItemToProperty(item: ItemFromDB): Property | null {
  const attributes = transformAttributesToPropertyAttributes(item.attribute_values);
  
  // Validate required attributes
  if (!validateRequiredAttributes(attributes)) {
    console.warn(`Property ${item.id} is missing required attributes`);
    return null;
  }

  const media = transformItemMedia(item.item_media);

  return {
    id: item.id,
    company_id: item.company_id,
    title: item.title,
    description: item.summary || undefined,
    status: item.status as 'draft' | 'published' | 'archived',
    item_type: item.item_type,
    created_at: item.created_at,
    updated_at: item.updated_at,
    attributes: attributes as any, // Type assertion needed due to Partial conversion
    media
  };
}

/**
 * Gets all published properties for RegiaMare
 */
export async function getAllProperties(): Promise<Property[]> {
  try {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        attribute_values (
          *,
          attribute_definitions (*)
        ),
        item_media (*)
      `)
      .eq('company_id', COMPANY_ID)
      .eq('item_type', ITEM_TYPE)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching properties:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    const properties = data
      .map(item => transformItemToProperty(item as ItemFromDB))
      .filter((prop): prop is Property => prop !== null);

    return properties;
  } catch (error) {
    console.error('Unexpected error fetching properties:', error);
    return [];
  }
}

/**
 * Gets a single property by ID
 */
export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        attribute_values (
          *,
          attribute_definitions (*)
        ),
        item_media (*)
      `)
      .eq('id', id)
      .eq('company_id', COMPANY_ID)
      .eq('item_type', ITEM_TYPE)
      .eq('status', 'published')
      .single();

    if (error || !data) {
      console.error('Error fetching property:', error);
      return null;
    }

    return transformItemToProperty(data as ItemFromDB);
  } catch (error) {
    console.error('Unexpected error fetching property:', error);
    return null;
  }
}

/**
 * Gets the 2 most expensive published properties (featured)
 */
export async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const properties = await getAllProperties();
    
    // Sort by price descending
    const sortedByPrice = properties.sort((a, b) => {
      const priceA = a.attributes.price || 0;
      const priceB = b.attributes.price || 0;
      return priceB - priceA;
    });

    return sortedByPrice.slice(0, 2);
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return [];
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
    return [];
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
    return [];
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
    return [];
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
    return [];
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
    return { min: 0, max: 0 };
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
    return {
      properties: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
      pageSize
    };
  }
}
