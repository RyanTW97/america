// app/types/noticias.ts (Asegúrate de que este archivo exista y esté actualizado)
// Basado en tu JSON y discusiones previas.

export interface StrapiRichTextChild {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  // ... otros estilos si los usas
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
  hash: string; // Añadido por si acaso
  ext: string; // Añadido por si acaso
  mime: string; // Añadido por si acaso
  size: number; // Añadido por si acaso
  previewUrl: string | null;
  provider: string;
  provider_metadata: any | null;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiImageData {
  id: number;
  attributes: StrapiImageAttributes;
}

export interface NoticiaAttributes {
  Titulo: string; // Coincide con tu JSON
  slug: string; // Coincide con tu JSON
  parrafo1?: StrapiRichTextParagraph[] | null;
  parrafo2?: StrapiRichTextParagraph[] | null;
  parrafo3?: StrapiRichTextParagraph[] | null;
  imagenes?: {
    data: StrapiImageData[] | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  // Añade aquí cualquier otro campo que tengan tus noticias
}

export interface Noticia {
  id: number;
  attributes: NoticiaAttributes;
}

export interface StrapiNoticiasResponse {
  data: Noticia[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
