// app/types/productPage.ts

// ------------------------------------------------------------
// --- Tipos Genéricos de Strapi (Simplificados) ---
// ------------------------------------------------------------

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

export interface StrapiImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  url: string;
  sizeInBytes?: number;
}

export interface StrapiImageAttributes {
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats?: {
    large?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    thumbnail?: StrapiImageFormat;
  };
  url: string;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any | null;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiMediaObject {
  id: number;
  attributes: StrapiImageAttributes;
}

// `StrapiMedia` puede ser un único archivo o un arreglo de archivos
export interface StrapiMedia {
  data: StrapiMediaObject | StrapiMediaObject[] | null;
}

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

// ------------------------------------------------------------
// --- Tipos Específicos de Componentes de Producto de Strapi ---
// ------------------------------------------------------------

export interface ColorItem {
  id: number;
  codigoRGB: string;
  nombreColor: string;
}

export interface PresentationItem {
  id: number;
  presentacion: string;
}

export interface VentajaItem {
  id: number;
  ventaja: string;
}

// ------------------------------------------------------------
// --- Tipos para la colección 'LineasAmerica' y productos ---
// ------------------------------------------------------------

//
// 1) Este tipo solo se usa en portales, listados y carruseles.
//    Reúne los campos mínimos que necesita, por ejemplo, ProductGrid / ProductCard.
//

export interface ProductForListingAttributes {
  titulo: string;
  slug: string;
  descripcion?: StrapiRichTextParagraph[]; // Opcionalmente se muestra un párrafo breve
  imagen?: StrapiMedia | null;
  // NO incluye `createdAt`, `updatedAt` ni `publishedAt` para que sea más ligero.
}

export interface ProductForListing {
  id: number;
  attributes: ProductForListingAttributes;
}

//
// 2) Este tipo representa el producto “completo” cuando vas a la página de detalle.
//    Contiene campos extra, como `createdAt`, `updatedAt`, relaciones a colores, fichas, etc.
//

export interface ProductAttributes {
  titulo: string;
  slug: string;
  descripcion: StrapiRichTextParagraph[];
  tipoPintura?: string | null;
  brillo?: string | null;
  tiempoSecado?: string | null;
  usoRecomendado?: string | null;
  varianteColores?: StrapiRichTextParagraph[] | null;
  norma?: string | null;
  destacado?: boolean | null;
  // En detalle sí requerimos timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt: string;

  imagen?: StrapiMedia | null;
  selloCalidad?: StrapiMedia | null;
  colores?: ColorItem[] | null;
  presentacion?: PresentationItem[] | null;
  ventajas?: VentajaItem[] | null;
  ficha_Tecnica?: StrapiMedia | null;

  // Relación con Línea de América (solo en detalle)
  lineas_america?: {
    data: {
      id: number;
      attributes: LineasAmericaAttributes;
    } | null;
  };
}

export interface ProductPageData {
  id: number;
  attributes: ProductAttributes;
}

//
// 3) Tipo para la colección “Líneas de América” (que a su vez trae productos asociados).
//

export interface LineasAmericaAttributes {
  nombre: string;
  slug: string;
  Imagen: StrapiMedia;
  // En la vista de detalle de línea aprendes sobre productos en esa línea
  productos_americas?: {
    data: ProductForListing[] | null;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface LineasAmerica {
  id: number;
  attributes: LineasAmericaAttributes;
}

// ------------------------------------------------------------
// --- Tipos para respuestas de API y props de página ---
// ------------------------------------------------------------

// Para la respuesta de Strapi al obtener un solo producto (detalle)
export interface StrapiSingleProductResponse {
  data: ProductPageData | ProductPageData[] | null;
  meta?: { pagination?: StrapiPagination };
}

// Para la respuesta de Strapi al obtener múltiples productos (listados/carruseles)
export interface StrapiProductsResponse {
  data: ProductForListing[];
  meta: { pagination: StrapiPagination };
}

// Para la respuesta de Strapi al obtener las opciones de filtros
export interface StrapiFilterCollectionResponse {
  data: { id: number; attributes: { nombre: string; slug: string } }[];
  meta: { pagination: StrapiPagination };
}

// ------------------------------------------------------------
// --- Props para componentes específicos (detalle) ---
// ------------------------------------------------------------

export interface ProductDetailsProps {
  productId: number;
  productAttributes: ProductAttributes;
}

// Props de un componente que solo maneja info primaria (detalle)
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

// Props para especificaciones técnicas del detalle
export interface ProductTechnicalSpecsProps {
  tipoPintura?: ProductAttributes["tipoPintura"];
  brillo?: ProductAttributes["brillo"];
  tiempoSecado?: ProductAttributes["tiempoSecado"];
  usoRecomendado?: ProductAttributes["usoRecomendado"];
  varianteColores?: ProductAttributes["varianteColores"];
  norma?: ProductAttributes["norma"];
}

// Props para mostrar ventajas en detalle
export interface ProductAdvantagesProps {
  ventajas?: ProductAttributes["ventajas"];
}

// Props para acciones en detalle (por ejemplo, botón de descarga de ficha técnica)
export interface ProductActionsProps {
  productTitle: string;
  selectedPresentation: string | null;
  selectedColorName: string | null;
  fichaTecnicaUrl?: string | null;
}

// ------------------------------------------------------------
// --- Props de listado de productos (nuestros-productos/page.tsx) ---
// ------------------------------------------------------------

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  title: string;
  name: string;
  options: FilterOption[];
}

export interface FilterSourceConfig {
  uiTitle: string;
  queryParamName: string;
  apiEndpoint: string;
  relationFieldInProduct: string;
}

export interface GetProductsParams {
  page?: number;
  pageSize?: number;
}

// ------------------------------------------------------------
// --- Aliases para evitar confusiones ---
// ------------------------------------------------------------

/**
 * @description
 * Cuando estemos en un listado o carrusel (ProductGrid, ProductCarousel, etc.),
 * usaremos **ListingProduct** para referirnos al producto “liviano” (ProductForListing).
 */
export type ListingProduct = ProductForListing;

/**
 * @description
 * Para que tus páginas o componentes puedan importar simplemente “Product”
 * (por ejemplo, en FavoritosPage), añadimos este alias:
 *
 *   import { Product, StrapiPagination } from "@/app/types/productPage";
 *
 * De este modo, “Product” equivale a “ProductForListing”.
 */
export type Product = ProductForListing;

/**
 * @description
 * En la página de favoritos u otros listados “genéricos”, importarás Product[]:
 *
 *   import { Product, StrapiPagination } from "@/app/types/productPage";
 *
 * El componente <ProductGrid> espera un arreglo de “Product” (alias para ProductForListing).
 */

/**
 * @description
 * Para la vista de detalle, importarás ProductPageData (o ProductAttributes si solo quieres atributos).
 */
export type DetailProduct = ProductPageData;
