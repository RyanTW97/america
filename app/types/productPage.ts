// app/types/productPage.ts

// --- Tipos Genéricos de Strapi (Simplificados) ---

// Para Rich Text de Strapi
export interface StrapiRichTextChild {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

export interface StrapiRichTextParagraph {
  type: "paragraph";
  children: StrapiRichTextChild[];
}

// Para Campos de Media de Strapi (Imágenes, PDFs, etc.)
export interface StrapiImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number; // en KB
  url: string;
  sizeInBytes?: number; // A veces Strapi lo incluye
}

export interface StrapiImageAttributes {
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats?: {
    // Formats puede ser opcional o tener formatos específicos
    large?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    thumbnail?: StrapiImageFormat;
  };
  url: string; // URL principal de la imagen/archivo
  hash: string;
  ext: string;
  mime: string;
  size: number; // en KB
  previewUrl: string | null;
  provider: string;
  provider_metadata: any | null; // O un tipo más específico si lo conoces
  createdAt: string;
  updatedAt: string;
}

export interface StrapiMediaObject {
  id: number;
  attributes: StrapiImageAttributes;
}

// Un campo de Media en Strapi puede ser un solo objeto, un array de objetos, o nulo.
export interface StrapiMedia {
  data: StrapiMediaObject | StrapiMediaObject[] | null;
}

// Para la paginación de Strapi
export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

// --- Tipos Específicos de Componentes de Producto de Strapi ---
// Estos son los tipos para los datos que vienen de los *componentes* de Strapi
// que has añadido a tu Content-Type "ProductosAmerica".

export interface ColorItem {
  // Para el componente 'colores'
  id: number;
  codigoRGB: string;
  nombreColor: string;
  // __component?: string; // Strapi a veces añade esto, opcional
}

export interface PresentationItem {
  // Para el componente 'presentacion'
  id: number;
  presentacion: string; // ej: "LT", "GL", "CN"
  // __component?: string;
}

export interface VentajaItem {
  // Para el componente 'ventajas'
  id: number;
  ventaja: string;
  // __component?: string;
}

// --- Tipos para la Colección 'LineasAmerica' ---
// (Asumiendo que 'productos_americas' es una relación dentro de LineasAmerica
//  y que 'Product' es el tipo para los productos listados allí)
// Importante: 'Product' debe estar definido, usualmente en un archivo de tipos global o aquí mismo.
// Por ahora, lo defino de forma simplificada.
export interface Product {
  // Tipo simplificado para productos en listas/carruseles
  id: number;
  attributes: {
    titulo: string;
    slug: string;
    descripcion?: StrapiRichTextParagraph[];
    imagen?: StrapiMedia | null;
    // ... otros campos que ProductCard pueda necesitar
  };
}

export interface LineasAmericaAttributes {
  nombre: string;
  slug: string;
  Imagen: StrapiMedia; // Campo de imagen del banner de la línea
  productos_americas?: {
    // Relación a los productos destacados/relacionados de esta línea
    data: Product[] | null;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface LineasAmerica {
  // Tipo para una entrada de la colección LineasAmerica
  id: number;
  attributes: LineasAmericaAttributes;
}

// --- Atributos del Producto (de la colección 'ProductosAmerica') ---
// Esta es la interfaz principal para los atributos de un producto individual
// que se muestra en la página de detalle.
export interface ProductAttributes {
  // Campos directos
  titulo: string;
  slug: string;
  descripcion: StrapiRichTextParagraph[];
  tipoPintura?: string | null;
  brillo?: string | null;
  tiempoSecado?: string | null;
  usoRecomendado?: string | null;
  varianteColores?: StrapiRichTextParagraph[] | null; // Rich text para "7 tonos directos..."
  norma?: string | null;
  destacado?: boolean | null; // Para el carrusel de productos destacados
  createdAt: string;
  updatedAt: string;
  publishedAt: string;

  // Relaciones y Componentes (populados)
  imagen?: StrapiMedia | null;
  selloCalidad?: StrapiMedia | null;
  colores?: ColorItem[] | null;
  presentacion?: PresentationItem[] | null;
  ventajas?: VentajaItem[] | null;
  ficha_Tecnica?: StrapiMedia | null; // Asumiendo que es un campo de media para el PDF

  // Relación a LineasAmerica
  // El 'data' aquí contendrá el objeto LineasAmerica populado (incluyendo su 'Imagen' y 'productos_americas')
  lineas_america?: {
    data: LineasAmerica | null;
  };

  // ...otros campos directos o relaciones que puedas tener en ProductosAmerica
}

// --- Tipos para la Página de Detalle del Producto ([slug]/page.tsx) ---

// Para los datos completos de un producto en la página de detalle
export interface ProductPageData {
  id: number;
  attributes: ProductAttributes;
}

// Para la respuesta de la API cuando se obtiene un solo producto (o un array si se filtra)
export interface StrapiSingleProductResponse {
  data: ProductPageData | ProductPageData[] | null;
  meta?: {
    // Podría no haber paginación si es un solo resultado, pero Strapi a veces incluye 'meta' vacío
    pagination?: StrapiPagination;
  };
}

// --- Props para Componentes Específicos de la Página de Detalle ---

// Para ProductDetails.tsx
export interface ProductDetailsProps {
  productId: number;
  productAttributes: ProductAttributes;
}

// Para ProductPrimaryInfo.tsx y sus selecciones
export type ColorOptionData = ColorItem;
export type PresentationOptionData = PresentationItem;

export interface ProductPrimaryInfoProps {
  titulo: string;
  selloCalidad?: ProductAttributes["selloCalidad"];
  descripcion: ProductAttributes["descripcion"];
  colores?: ProductAttributes["colores"];
  presentaciones?: ProductAttributes["presentacion"];

  selectedPresentation: string | null;
  onPresentationSelect: (presentation: string) => void;
  selectedColor: ColorOptionData | null;
  onColorSelect: (color: ColorOptionData) => void;
}

// Para ProductTechnicalSpecs.tsx
export interface ProductTechnicalSpecsProps {
  tipoPintura?: ProductAttributes["tipoPintura"];
  brillo?: ProductAttributes["brillo"];
  tiempoSecado?: ProductAttributes["tiempoSecado"];
  usoRecomendado?: ProductAttributes["usoRecomendado"];
  varianteColores?: ProductAttributes["varianteColores"];
  norma?: ProductAttributes["norma"];
}

// Para ProductAdvantages.tsx
export interface ProductAdvantagesProps {
  ventajas?: ProductAttributes["ventajas"];
}

// Para ProductActions.tsx
export interface ProductActionsProps {
  productTitle: string;
  // productSlug: string; // Si lo necesitas para algo
  selectedPresentation: string | null;
  selectedColorName: string | null; // Solo el nombre del color
  fichaTecnicaUrl?: string | null;
}

// --- Tipos para la Página de Listado de Productos (nuestros-productos/page.tsx) ---
// (Estos ya los tenías, pero los incluyo por completitud si este es tu archivo principal de tipos)

export interface FilterOption {
  // Para las opciones del SidebarFilters
  label: string;
  value: string;
}

export interface FilterGroup {
  // Para los grupos en SidebarFilters
  title: string;
  name: string;
  options: FilterOption[];
}

// Para la respuesta de la API cuando se obtienen múltiples productos (ej: para ProductGrid o Carousels)
export interface StrapiProductsResponse {
  data: Product[]; // Array de productos (usando el tipo Product simplificado)
  meta: {
    pagination: StrapiPagination;
  };
}
