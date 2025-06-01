// /app/types.ts

// -----------------------------------------
// Tipos auxiliares para manejar imágenes desde Strapi
// -----------------------------------------

export interface StrapiImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface StrapiImageDataAttributes {
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string; // URL original/grande
  previewUrl: string | null;
  provider: string;
  provider_metadata: any | null;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiImageData {
  id: number;
  attributes: StrapiImageDataAttributes;
}

export interface StrapiImage {
  data: StrapiImageData | null;
}

// -----------------------------------------
// Tipos de rich text (si los necesitas en otros lados)
// -----------------------------------------

export interface StrapiRichTextParagraphNode {
  text: string;
  type: "text";
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

export interface StrapiRichTextListItemNode {
  type: "list-item";
  children: StrapiRichTextParagraphNode[];
}

export interface StrapiRichTextListNode {
  type: "list";
  format: "ordered" | "unordered";
  children: StrapiRichTextListItemNode[];
}

export interface StrapiRichTextParagraph {
  type: "paragraph";
  children: StrapiRichTextParagraphNode[];
}

export type StrapiRichTextBlock =
  | StrapiRichTextParagraph
  | StrapiRichTextListNode;
// Agrega más tipos si Strapi te devuelve otros bloques

// -----------------------------------------
// Atributos de un producto en la respuesta cruda de Strapi
// -----------------------------------------

export interface ProductAttributes {
  titulo: string;
  slug: string;
  descripcion?: StrapiRichTextBlock[];
  tipoPintura?: string;
  brillo?: string;
  usoRecomendado?: string;
  destacado?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  imagen: StrapiImage;
  // Otros campos que sí uses en “nuestros-productos” (colores, acabados, etc.)
  [key: string]: any;
}

export interface Product {
  id: number;
  attributes: ProductAttributes;
}

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiProductsResponse {
  data: Product[];
  meta: {
    pagination: StrapiPagination;
  };
}

// -----------------------------------------
// Tipo “plano” que consumirá ProductCarousel
// -----------------------------------------

export interface FeaturedProduct {
  /** ID del producto en Strapi */
  id: number;
  /** Título/corto nombre del producto */
  titulo: string;
  /** Slug para enlazar a detalle (si usas) */
  slug: string;
  /** Siempre true (filtrado en Strapi) */
  destacado: boolean;
  /** URL absoluta de la imagen (thumbnail si existe, sino la original) */
  imagenUrl: string;
}
