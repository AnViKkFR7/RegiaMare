import { supabase } from './supabase';
import type { AttributeDefinition } from './attributeTransformer';

/**
 * Constants
 */
const COMPANY_ID = 'eac2ccbe-cc36-40cd-bb7e-d5fe44de972d';
const ITEM_TYPE = 'regiamare_property';

/**
 * Gets all attribute definitions for regiamare_property
 */
export async function getAttributeDefinitions(): Promise<AttributeDefinition[]> {
  try {
    const { data, error } = await supabase
      .from('attribute_definitions')
      .select('*')
      .eq('company_id', COMPANY_ID)
      .eq('item_type', ITEM_TYPE)
      .order('key', { ascending: true });

    if (error) {
      console.error('Error fetching attribute definitions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching attribute definitions:', error);
    return [];
  }
}

/**
 * Gets all filterable attribute definitions
 */
export async function getFilterableAttributes(): Promise<AttributeDefinition[]> {
  try {
    const { data, error } = await supabase
      .from('attribute_definitions')
      .select('*')
      .eq('company_id', COMPANY_ID)
      .eq('item_type', ITEM_TYPE)
      .eq('is_filterable', true)
      .order('key', { ascending: true });

    if (error) {
      console.error('Error fetching filterable attributes:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching filterable attributes:', error);
    return [];
  }
}

/**
 * Gets all required attribute definitions
 */
export async function getRequiredAttributes(): Promise<AttributeDefinition[]> {
  try {
    const { data, error } = await supabase
      .from('attribute_definitions')
      .select('*')
      .eq('company_id', COMPANY_ID)
      .eq('item_type', ITEM_TYPE)
      .eq('is_required', true)
      .order('key', { ascending: true });

    if (error) {
      console.error('Error fetching required attributes:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching required attributes:', error);
    return [];
  }
}

/**
 * Gets a specific attribute definition by key
 */
export async function getAttributeDefinitionByKey(key: string): Promise<AttributeDefinition | null> {
  try {
    const { data, error } = await supabase
      .from('attribute_definitions')
      .select('*')
      .eq('company_id', COMPANY_ID)
      .eq('item_type', ITEM_TYPE)
      .eq('key', key)
      .single();

    if (error || !data) {
      console.error('Error fetching attribute definition:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching attribute definition:', error);
    return null;
  }
}

/**
 * Gets attribute definitions grouped by data type
 */
export async function getAttributeDefinitionsByDataType(): Promise<Record<string, AttributeDefinition[]>> {
  try {
    const definitions = await getAttributeDefinitions();
    
    const grouped: Record<string, AttributeDefinition[]> = {};
    
    definitions.forEach(def => {
      if (!grouped[def.data_type]) {
        grouped[def.data_type] = [];
      }
      grouped[def.data_type].push(def);
    });

    return grouped;
  } catch (error) {
    console.error('Error grouping attribute definitions:', error);
    return {};
  }
}
