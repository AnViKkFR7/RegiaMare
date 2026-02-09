import type { Property, Service } from '../types';

// Mock data for featured properties
export const mockFeaturedProperties: Property[] = [
  {
    id: '1',
    company_id: 'eac2ccbe-cc36-40cd-bb7e-d5fe44de972d',
    item_type: 'regiamare_property',
    title: 'Villa de lujo con vistas al mar en Sitges',
    description: 'Espectacular villa moderna con vistas panorámicas al mar Mediterráneo',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    attributes: {
      price: 2500000,
      operation_type: 'Venta',
      property_type: 'Villa',
      province: 'Barcelona',
      city: 'Sitges',
      zone: 'Sitges',
      built_surface: 450,
      bedrooms: 5,
      bathrooms: 4,
      condition: 'A Estrenar',
      description: 'Magnífica villa de diseño contemporáneo ubicada en una de las zonas más exclusivas de Sitges. La propiedad cuenta con amplios espacios interiores, grandes ventanales que maximizan la entrada de luz natural y vistas espectaculares al mar. Dispone de piscina infinity, jardín mediterráneo, garaje para 3 vehículos y todas las comodidades de una vivienda de lujo.',
      usable_surface: 400,
      plot_surface: 800,
      year_built: 2024,
      parking_type: 'Garaje',
      garage_spaces: 3,
      has_terrace: true,
      terrace_surface: 120,
      has_garden: true,
      garden_surface: 400,
      pool_type: 'Privada',
      has_elevator: true,
      security_type: 'Sistema de Seguridad',
      views: 'Mar',
      distance_to_beach: 500
    },
    media: [
      {
        id: '1-1',
        item_id: '1',
        media_type: 'image',
        url: '/2151986074.jpg',
        display_order: 1,
        is_primary: true,
        created_at: new Date().toISOString()
      }
    ]
  },
  {
    id: '2',
    company_id: 'eac2ccbe-cc36-40cd-bb7e-d5fe44de972d',
    item_type: 'regiamare_property',
    title: 'Ático exclusivo en el centro de Barcelona',
    description: 'Lujoso ático con terraza panorámica en el Eixample',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    attributes: {
      price: 1800000,
      operation_type: 'Venta',
      property_type: 'Ático',
      province: 'Barcelona',
      city: 'Barcelona',
      zone: 'Barcelona',
      built_surface: 280,
      bedrooms: 4,
      bathrooms: 3,
      condition: 'Reformado',
      description: 'Impresionante ático completamente reformado en el corazón del Eixample de Barcelona. La propiedad destaca por su amplia terraza de 150m² con vistas de 360 grados a la ciudad. Acabados de primera calidad, cocina de diseño totalmente equipada, sistema de domótica integrado y garaje incluido. A escasos metros de Paseo de Gracia.',
      usable_surface: 250,
      year_built: 1900,
      parking_type: 'Garaje',
      garage_spaces: 2,
      has_terrace: true,
      terrace_surface: 150,
      has_elevator: true,
      security_type: 'Sistema de Seguridad',
      has_home_automation: true,
      views: 'Ciudad'
    },
    media: [
      {
        id: '2-1',
        item_id: '2',
        media_type: 'image',
        url: '/2151983240.jpg',
        display_order: 1,
        is_primary: true,
        created_at: new Date().toISOString()
      }
    ]
  }
];

// Mock data for all properties (includes featured + more)
export const mockProperties: Property[] = [
  ...mockFeaturedProperties,
  {
    id: '3',
    company_id: 'eac2ccbe-cc36-40cd-bb7e-d5fe44de972d',
    item_type: 'regiamare_property',
    title: 'Casa moderna en Sant Pere de Ribes',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    attributes: {
      price: 850000,
      operation_type: 'Venta',
      property_type: 'Casa',
      province: 'Barcelona',
      city: 'Sant Pere de Ribes',
      zone: 'Sant Pere de Ribes',
      built_surface: 320,
      bedrooms: 4,
      bathrooms: 3,
      condition: 'Buen Estado',
      description: 'Hermosa casa familiar en zona residencial tranquila',
      pool_type: 'Privada',
      has_garden: true,
      parking_type: 'Garaje'
    },
    media: []
  },
  {
    id: '4',
    company_id: 'eac2ccbe-cc36-40cd-bb7e-d5fe44de972d',
    item_type: 'regiamare_property',
    title: 'Piso con vistas en Vilanova i la Geltrú',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    attributes: {
      price: 420000,
      operation_type: 'Venta',
      property_type: 'Piso',
      province: 'Barcelona',
      city: 'Vilanova i la Geltrú',
      zone: 'Vilanova i la Geltrú',
      built_surface: 120,
      bedrooms: 3,
      bathrooms: 2,
      condition: 'Reformado',
      description: 'Piso luminoso completamente reformado con vistas al mar',
      has_terrace: true,
      has_elevator: true
    },
    media: []
  }
];

// Mock data for services
export const mockServices: Service[] = [
  {
    id: '1',
    title: 'Gestión integral de venta',
    description: 'Acompañamiento completo en todo el proceso de venta de su propiedad, desde la valoración inicial hasta la firma de escrituras.',
    icon: '🏠'
  },
  {
    id: '2',
    title: 'Valoración profesional',
    description: 'Tasación precisa y gratuita de su propiedad realizada por expertos del mercado inmobiliario local.',
    icon: '📊'
  },
  {
    id: '3',
    title: 'Home staging y fotografía premium',
    description: 'Presentación profesional de su propiedad con fotografía de alta calidad y preparación para maximizar su atractivo.',
    icon: '📸'
  },
  {
    id: '4',
    title: 'Gestión de alquileres',
    description: 'Administración completa de su propiedad en alquiler, incluyendo búsqueda de inquilinos y gestión de contratos.',
    icon: '🔑'
  },
  {
    id: '5',
    title: 'Asesoramiento a compradores internacionales',
    description: 'Apoyo especializado para clientes internacionales en todos los aspectos de la compra, desde visados hasta adaptación.',
    icon: '🌍'
  },
  {
    id: '6',
    title: 'Tramitación documental y legal',
    description: 'Gestión de toda la documentación y aspectos legales necesarios para una transacción segura y sin complicaciones.',
    icon: '📄'
  }
];

// Company description
export const companyDescription = {
  es: `En Regia Mare Properties apostamos por un asesoramiento a medida y cercano, porque entendemos que cada familia, 
  cada persona y cada vivienda es un mundo. Ofrecemos un servicio premium que combina experiencia local con alcance internacional, 
  garantizando la mejor exposición para su propiedad y acompañamiento personalizado en cada paso del proceso.`,
  en: `At Regia Mare Properties, we believe in personalized and close advisory services, because we understand that each family, 
  each person, and each home is unique. We offer a premium service that combines local expertise with international reach, 
  ensuring the best exposure for your property and personalized support at every step of the process.`,
  fr: `Chez Regia Mare Properties, nous croyons en un conseil personnalisé et proche, car nous comprenons que chaque famille, 
  chaque personne et chaque maison est unique. Nous offrons un service premium qui combine expertise locale et portée internationale, 
  garantissant la meilleure exposition pour votre propriété et un accompagnement personnalisé à chaque étape du processus.`
};
