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
  | StrapiRichTextListNode /* | ... otros tipos de bloques si los usas */;

export interface ProductAttributes {
  titulo: string;
  slug: string;
  descripcion: StrapiRichTextBlock[];
  tipoPintura?: string;
  brillo?: string;
  usoRecomendado?: string;
  destacado?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  imagen: {
    data: StrapiImageData | null;
  };
  // ... otros campos que puedas necesitar
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
