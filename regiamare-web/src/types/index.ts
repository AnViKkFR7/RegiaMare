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

// Property-specific types (matching RegiaMare.sql)
export interface PropertyAttributes {
  // === REQUIRED ATTRIBUTES (11) ===
  price: number;
  operation_type: 'Venta' | 'Alquiler' | 'Alquiler Vacacional' | 'Traspaso';
  property_type: 'Piso' | 'Casa' | 'Casa Pareada' | 'Villa' | 'Ático' | 'Dúplex' | 'Planta Baja' | 'Masía' | 'Local' | 'Terreno';
  province: string;
  city: string;
  zone: string;
  built_surface: number;
  bedrooms: number;
  bathrooms: number;
  condition: 'Obra Nueva' | 'A Estrenar' | 'Reformado' | 'Buen Estado' | 'A Reformar' | 'Para Entrar a Vivir';
  description: string;

  // === DESCRIPTIONS (MULTILANGUAGE) ===
  description_english?: string;
  description_french?: string;
  
  // === MEDIA ===
  video_url?: string; // URL de YouTube del video de la propiedad

  // === SURFACE & LOCATION ===
  usable_surface?: number; // Superficie útil
  plot_surface?: number; // Superficie parcela
  floor?: string; // Planta
  is_exterior?: boolean; // Exterior/Interior

  // === STRUCTURE ===
  has_elevator?: boolean; // Ascensor
  year_built?: number;

  // === PARKING & STORAGE ===
  parking_type?: string;
  parking_spaces?: number;
  garage_spaces?: number;
  has_storage_room?: boolean; // Trastero
  storage_surface?: number; // Superficie trastero

  // === OUTDOOR SPACES ===
  has_terrace?: boolean;
  terrace_surface?: number;
  has_balcony?: boolean;
  has_garden?: boolean;
  garden_surface?: number;
  has_patio?: boolean;

  // === POOL ===
  pool_type?: string; // "Privada", "Comunitaria", "Sin Piscina", etc.

  // === ORIENTATION & VIEWS ===
  orientation?: string;
  views?: string; // Can be array or string
  distance_to_beach?: number;
  distance_to_city_center?: number;

  // === CLIMATE CONTROL ===
  heating_type?: string; // Tipo de calefacción
  air_conditioning?: string; // Aire acondicionado

  // === KITCHEN & INTERIOR ===
  kitchen_type?: string;
  built_in_wardrobes?: boolean;
  furnished?: string; // "Totalmente Amueblado", "Parcialmente Amueblado", "Sin Amueblar"
  has_fireplace?: boolean;
  flooring_type?: string;
  high_ceilings?: boolean;
  ceiling_height?: number;

  // === ENERGY CERTIFICATION ===
  energy_certificate?: string;
  energy_consumption?: number; // kWh/m²·año
  co2_emissions?: number; // kg/m²·año

  // === FISCAL & LEGAL ===
  cadastral_reference?: string;
  ibi_annual?: number; // IBI anual €
  community_fees?: number; // Gastos comunidad €/mes

  // === ADDITIONAL FEATURES ===
  features?: string[]; // Array de características destacadas
  has_concierge?: boolean; // Portería/Conserje
  security_type?: string; // Sistema de seguridad
  has_home_automation?: boolean; // Domótica
  wheelchair_accessible?: boolean; // Accesibilidad movilidad reducida

  // === COMMUNAL SERVICES ===
  has_gym?: boolean;
  has_playground?: boolean; // Zona infantil
  has_paddle_tennis?: boolean;
  has_communal_gardens?: boolean;

  // === USE & AVAILABILITY ===
  has_tourist_license?: boolean;
  tourist_license_number?: string;
  available_from?: string; // Date
  pets_allowed?: boolean;

  // === INTERNAL INFO ===
  internal_reference?: string;
  additional_notes?: string;
  previous_price?: number;
  assigned_agent?: string;
  is_exclusive?: boolean;
  is_featured?: boolean;
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
