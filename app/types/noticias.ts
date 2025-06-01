// app/types/noticias.ts

// --- Tipos genéricos de Strapi (simplificados) ---
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

// ► Hacemos que 'data' sea siempre un arreglo (o null) ◀
export interface StrapiMedia {
  data: StrapiMediaObject[] | null;
}

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

// --- Tipos específicos de noticias ---

export interface NoticiaAttributes {
  Titulo: string;
  slug: string;
  parrafo1?: StrapiRichTextParagraph[] | null;
  parrafo2?: StrapiRichTextParagraph[] | null;
  parrafo3?: StrapiRichTextParagraph[] | null;
  publishedAt: string;
  imagenes?: StrapiMedia | null;
  // Agrega aquí cualquier otro campo que devuelva tu Strapi para la colección 'noticias'
}

export interface Noticia {
  id: number;
  attributes: NoticiaAttributes;
}

export interface StrapiNoticiasResponse {
  data: Noticia[];
  meta: {
    pagination: StrapiPagination;
  };
}
