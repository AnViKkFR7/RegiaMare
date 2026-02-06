import type { PropertyAttributes } from '../types';

/**
 * Database types for Supabase responses
 */
export interface AttributeValue {
  id: string;
  item_id: string;
  attribute_id: string;
  value_text: string | null;
  value_number: number | null;
  value_boolean: boolean | null;
  value_date: string | null;
  value_json: any | null;
  value_text_array: string[] | null;
  value_number_array: number[] | null;
  attribute_definitions: AttributeDefinition;
}

export interface AttributeDefinition {
  id: string;
  company_id: string;
  item_type: string;
  key: string;
  label: string;
  data_type: 'text' | 'number' | 'boolean' | 'date' | 'json' | 'text_array' | 'number_array' | 'longtext';
  is_filterable: boolean;
  is_required: boolean;
}

/**
 * Extracts the actual value from an AttributeValue based on its data_type
 */
function extractAttributeValue(attr: AttributeValue): any {
  const dataType = attr.attribute_definitions.data_type;
  
  switch (dataType) {
    case 'text':
    case 'longtext':
      return attr.value_text;
    case 'number':
      return attr.value_number;
    case 'boolean':
      return attr.value_boolean;
    case 'date':
      return attr.value_date;
    case 'json':
      return attr.value_json;
    case 'text_array':
      return attr.value_text_array;
    case 'number_array':
      return attr.value_number_array;
    default:
      return null;
  }
}

/**
 * Transforms attribute_values from EAV model to typed PropertyAttributes interface
 */
export function transformAttributesToPropertyAttributes(
  attributeValues: AttributeValue[]
): Partial<PropertyAttributes> {
  const attributes: Record<string, any> = {};

  for (const attr of attributeValues) {
    const key = attr.attribute_definitions.key;
    const value = extractAttributeValue(attr);
    
    if (value !== null && value !== undefined) {
      attributes[key] = value;
    }
  }

  return attributes as Partial<PropertyAttributes>;
}

/**
 * Validates if an attribute object has all required fields for PropertyAttributes
 */
export function validateRequiredAttributes(attributes: Partial<PropertyAttributes>): boolean {
  const requiredFields: (keyof PropertyAttributes)[] = [
    'price',
    'operation_type',
    'property_type',
    'province',
    'city',
    'zone',
    'built_surface',
    'bedrooms',
    'bathrooms',
    'condition',
    'description'
  ];

  return requiredFields.every(field => {
    const value = attributes[field];
    return value !== undefined && value !== null && value !== '';
  });
}

/**
 * Gets a specific attribute value by key
 */
export function getAttributeByKey(
  attributeValues: AttributeValue[],
  key: string
): any {
  const attr = attributeValues.find(
    av => av.attribute_definitions.key === key
  );
  
  return attr ? extractAttributeValue(attr) : null;
}

/**
 * Creates a filter map for filterable attributes
 * Returns a Map with attribute key as key and possible values as value array
 */
export function createFilterableAttributesMap(
  attributeDefinitions: AttributeDefinition[]
): Map<string, AttributeDefinition> {
  const filterableMap = new Map<string, AttributeDefinition>();
  
  attributeDefinitions
    .filter(def => def.is_filterable)
    .forEach(def => {
      filterableMap.set(def.key, def);
    });
  
  return filterableMap;
}
