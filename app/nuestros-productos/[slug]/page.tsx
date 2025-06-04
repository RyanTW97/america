// app/nuestros-productos/[slug]/page.tsx
// @ts-nocheck
import Link from "next/link";
import ProductDetailHeader from "./components/ProductDetailHeader";
import ProductDetails from "./components/ProductDetails";
import RelatedProductsByLine from "./components/RelatedProductsByLine";
import ProductCarousel from "@/components/ProductCarousel";

import {
  ProductPageData,
  StrapiSingleProductResponse,
  Product,
  StrapiProductsResponse,
} from "@/app/types/productPage";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://servidor-tricolor-64a23aa2b643.herokuapp.com/api";
const PRODUCTS_ENDPOINT = `${API_URL}/productos-americas`;

/** Query de populates extraídos a constante para no recrearlos en cada llamada */
const POPULATE_QUERIES = [
  "populate[lineas_america][populate][Imagen]=*",
  "populate[lineas_america][populate][productos_americas][populate][imagen]=*",
  "populate[imagen]=*",
  "populate[ficha_Tecnica]=*",
  "populate[ventajas]=*",
  "populate[hoja_seguridad]=*",
  "populate[usos_recomendados][populate][icono]=*",
  "populate[beneficios][populate][icono]=*",
  "populate[colores][populate][imagen_color]=*",
  "populate[videos_aplicacion][populate][thumbnail_video]=*",
  "populate[presentacion]=*",
].join("&");

/**
 * Obtiene un producto completo desde Strapi según su slug.
 * Retorna null si no se encuentra o falla el fetch.
 */
async function getProductBySlug(slug: string): Promise<ProductPageData | null> {
  const url = `${PRODUCTS_ENDPOINT}?filters[slug][$eq]=${encodeURIComponent(
    slug
  )}&${POPULATE_QUERIES}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error(
        `Error fetching product by slug (${slug}): ${res.status} ${res.statusText}`
      );
      return null;
    }
    const jsonResponse: StrapiSingleProductResponse = await res.json();
    const dataArray = jsonResponse.data;
    return Array.isArray(dataArray) && dataArray.length > 0
      ? dataArray[0]
      : null;
  } catch (error) {
    console.error(`Failed to fetch product with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Obtiene hasta 10 productos destacados (destacado = true).
 * Retorna un arreglo vacío si falla el fetch.
 */
async function getFeaturedProducts(): Promise<Product[]> {
  const url = `${PRODUCTS_ENDPOINT}?filters[destacado][$eq]=true&populate[imagen]=*&pagination[limit]=10`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error(
        `Error fetching featured products: ${res.status} ${res.statusText}`
      );
      return [];
    }
    const jsonResponse: StrapiProductsResponse = await res.json();
    return Array.isArray(jsonResponse.data) ? jsonResponse.data : [];
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

/**
 * Extrae el texto de la primera etiqueta <paragraph>
 * para usarlo en la meta descripción (hasta 155 caracteres).
 */
function extractMetaDescription(descBlocks: unknown): string | null {
  if (
    Array.isArray(descBlocks) &&
    descBlocks.length > 0 &&
    descBlocks[0]?.type === "paragraph" &&
    Array.isArray(descBlocks[0].children)
  ) {
    const text = descBlocks[0].children
      .filter((c: any) => c?.type === "text" && typeof c.text === "string")
      .map((c: any) => c.text)
      .join(" ")
      .trim()
      .substring(0, 155);
    return text || null;
  }
  return null;
}

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Ejecutamos ambas peticiones en paralelo
  const [productData, featuredProducts] = await Promise.all([
    getProductBySlug(slug),
    getFeaturedProducts(),
  ]);

  // Si no existe el producto, renderizamos mensaje de error
  if (!productData) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center sm:p-24">
        <h1 className="text-2xl font-semibold text-zinc-800">
          Producto no encontrado
        </h1>
        <p className="mt-2 text-zinc-600">
          El producto que buscas (<strong>{slug}</strong>) no pudo ser cargado o
          no existe.
        </p>
        <Link
          href="/nuestros-productos"
          className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Volver a todos los productos
        </Link>
      </main>
    );
  }

  // Extraemos atributos de la línea (lineas_america)
  const lineaData = productData.attributes.lineas_america?.data;
  const lineaAttr = lineaData?.attributes ?? null;

  // Construimos el arreglo de productos relacionados (excluyendo el actual)
  const relatedProducts =
    lineaAttr?.productos_americas?.data
      ?.filter((p: any) => p.id !== productData.id)
      .map((p: any) => {
        const attrs = p.attributes;
        return {
          id: p.id,
          attributes: {
            titulo: attrs.titulo,
            slug: attrs.slug,
            imagen: attrs.imagen,
            descripcion: attrs.descripcion,
          },
        };
      }) || [];

  const limitedRelated = relatedProducts.slice(0, 10);

  return (
    <main className="min-h-screen bg-zinc-50">
      {lineaAttr ? (
        <ProductDetailHeader
          lineaTitle={lineaAttr.nombre}
          lineaImageUrl={lineaAttr.Imagen?.data?.attributes.url}
          lineaImageAlt={
            lineaAttr.Imagen?.data?.attributes.alternativeText ||
            `Imagen de línea ${lineaAttr.nombre}`
          }
        />
      ) : (
        <div className="bg-zinc-200 py-8" />
      )}

      <ProductDetails
        productId={productData.id}
        productAttributes={productData.attributes}
      />

      {lineaAttr && limitedRelated.length > 0 && (
        <RelatedProductsByLine
          lineaNombre={lineaAttr.nombre}
          relatedProducts={limitedRelated}
        />
      )}

      <div className="bg-zinc-50 py-12">
        <div className="container mx-auto px-4">
          {featuredProducts.length > 0 ? (
            <ProductCarousel products={featuredProducts} />
          ) : (
            <p className="text-center text-zinc-500">
              No hay productos destacados en este momento.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product?.attributes) {
    return {
      title: "Producto no encontrado",
      description: "El producto que buscas no está disponible.",
    };
  }

  const { titulo, descripcion, imagen } = product.attributes;
  let descriptionMeta = `Detalles sobre ${titulo}. Encuentra calidad y rendimiento con los productos de América Pinturas.`;

  const extracted = extractMetaDescription(descripcion);
  if (extracted) {
    descriptionMeta = extracted;
  }

  const mainImage = imagen?.data?.attributes;

  return {
    title: `${titulo} | América Pinturas`,
    description: descriptionMeta,
    openGraph: {
      title: `${titulo} | América Pinturas`,
      description: descriptionMeta,
      images: mainImage?.url
        ? [
            {
              url: mainImage.url,
              width: mainImage.width || 800,
              height: mainImage.height || 600,
              alt: mainImage.alternativeText || titulo,
            },
          ]
        : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${titulo} | América Pinturas`,
      description: descriptionMeta,
      images: mainImage?.url ? [mainImage.url] : [],
    },
  };
}
