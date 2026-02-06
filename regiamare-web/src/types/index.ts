// Database Types based on DB_SCHEMA.sql and RegiaMare.sql

export interface Company {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
  last_edited_by?: string;
}

export interface Item {
  id: string;
  company_id: string;
  item_type: string; // 'regiamare_property' for properties
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  created_by?: string;
  last_edited_by?: string;
}

export interface AttributeDefinition {
  id: string;
  company_id: string;
  item_type: string;
  key: string;
  label: string;
  data_type: 'text' | 'number' | 'boolean' | 'date' | 'longtext';
  is_filterable: boolean;
  is_required: boolean;
  validation_rules?: any;
  created_at: string;
  updated_at: string;
}

export interface AttributeValue {
  id: string;
  item_id: string;
  attribute_id: string;
  value_text?: string;
  value_number?: number;
  value_boolean?: boolean;
  value_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ItemMedia {
  id: string;
  item_id: string;
  media_type: 'image' | 'video' | 'pdf' | 'other';
  url: string;
  alt_text?: string;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

// Property-specific types
export interface PropertyAttributes {
  price: number;
  operation_type: 'Venta' | 'Alquiler' | 'Alquiler Vacacional' | 'Traspaso';
  property_type: 'Piso' | 'Casa' | 'Casa Pareada' | 'Villa' | 'Ático' | 'Dúplex' | 'Planta Baja' | 'Masía' | 'Local' | 'Terreno';
  province: string;
  city: string;
  zone: 'Barcelona' | 'Sitges' | 'Sant Pere de Ribes' | 'Vilanova i la Geltrú' | string;
  built_surface: number;
  bedrooms: number;
  bathrooms: number;
  condition: 'Obra Nueva' | 'A Estrenar' | 'Reformado' | 'Buen Estado' | 'A Reformar' | 'Para Entrar a Vivir';
  description: string;
  useful_surface?: number;
  plot_surface?: number;
  year_built?: number;
  orientation?: string;
  energy_certificate?: string;
  heating?: string;
  cooling?: string;
  parking?: boolean;
  parking_type?: string;
  parking_spaces?: number;
  garage_spaces?: number;
  storage_room?: boolean;
  terrace?: boolean;
  terrace_surface?: number;
  garden?: boolean;
  garden_surface?: number;
  pool?: boolean;
  elevator?: boolean;
  accessibility?: boolean;
  security_system?: boolean;
  views?: string;
  distance_to_beach?: number;
  distance_to_city_center?: number;
}

export interface Property extends Item {
  attributes: PropertyAttributes;
  media: ItemMedia[];
}

// Service types for the Services page
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// Language support
export type Language = 'es' | 'en' | 'fr';

export interface Translation {
  [key: string]: {
    es: string;
    en: string;
    fr: string;
  };
}
