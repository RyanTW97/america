// app/nuestros-productos/[slug]/page.tsx
// @ts-nocheck

import Link from "next/link";
import ProductDetailHeader from "./components/ProductDetailHeader"; // Verifica la ruta
import ProductDetails from "./components/ProductDetails"; // Verifica la ruta
import RelatedProductsByLine from "./components/RelatedProductsByLine"; // Verifica la ruta
import ProductCarousel from "@/components/ProductCarousel"; // Verifica la ruta

import {
  ProductPageData,
  StrapiSingleProductResponse,
  Product,
  StrapiProductsResponse,
} from "@/app/types/productPage"; // Verifica la ruta

const API_URL = "https://servidor-tricolor-64a23aa2b643.herokuapp.com/api";
const PRODUCTS_ENDPOINT = `${API_URL}/productos-americas`;

async function getProductBySlug(slug: string): Promise<ProductPageData | null> {
  // **Corregimos el nombre de ficha técnica a “ficha_Tecnica” (tal cual aparece en la API)
  const populateQuery = [
    "populate[lineas_america][populate][Imagen]=*",
    "populate[lineas_america][populate][productos_americas][populate][imagen]=*",
    "populate[imagen]=*",
    // Aquí corregimos el populate exacto para fichas técnicas:
    "populate[ficha_Tecnica]=*",
    // Si quisieras asegurar que Strapi incluya las ventajas (aunque en tu JSON ya vienen):
    "populate[ventajas]=*",
    "populate[hoja_seguridad]=*",
    "populate[usos_recomendados][populate][icono]=*",
    "populate[beneficios][populate][icono]=*",
    "populate[colores][populate][imagen_color]=*",
    "populate[videos_aplicacion][populate][thumbnail_video]=*",
  ].join("&");

  const url = `${PRODUCTS_ENDPOINT}?filters[slug][$eq]=${slug}&${populateQuery}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error(
        `Error fetching product by slug (${slug}): ${res.status} ${res.statusText}`
      );
      return null;
    }
    const jsonResponse: StrapiSingleProductResponse = await res.json();
    return jsonResponse.data && jsonResponse.data.length > 0
      ? jsonResponse.data[0]
      : null;
  } catch (error) {
    console.error(`Failed to fetch product with slug "${slug}":`, error);
    return null;
  }
}

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
    return jsonResponse.data || [];
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

// Next.js 15 genera un tipo para PageProps en .next/types/app/…/page.d.ts
// que espera: { params: Promise<{ slug: string }> }
// Por eso definimos aquí el mismo shape:
type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  // Como params viene envuelto en Promise, hacemos await:
  const { slug } = await params;

  const [productData, featuredProducts] = await Promise.all([
    getProductBySlug(slug),
    getFeaturedProducts(),
  ]);

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

  const linea = productData.attributes.lineas_america?.data;
  const lineaAttr = linea?.attributes;

  const related =
    lineaAttr?.productos_americas?.data
      ?.filter((p: any) => p?.id !== productData.id)
      .map((p: any) => ({
        id: p.id,
        attributes: {
          titulo: p.attributes.titulo,
          slug: p.attributes.slug,
          imagen: p.attributes.imagen,
          descripcion: p.attributes.descripcion,
        },
      })) || [];
  const limitedRelated = related.slice(0, 10);

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
  // También aquí params es Promise<{ slug: string }>
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product?.attributes) {
    return {
      title: "Producto no encontrado",
      description: "El producto que buscas no está disponible.",
    };
  }

  let descriptionMeta = `Detalles sobre ${product.attributes.titulo}. Encuentra calidad y rendimiento con los productos de América Pinturas.`;
  const descBlocks = product.attributes.descripcion;

  if (
    Array.isArray(descBlocks) &&
    descBlocks.length > 0 &&
    descBlocks[0]?.type === "paragraph" &&
    Array.isArray(descBlocks[0].children) &&
    descBlocks[0].children.length > 0
  ) {
    const text = descBlocks[0].children
      .filter((c: any) => c?.type === "text" && typeof c.text === "string")
      .map((c: any) => c.text)
      .join(" ")
      .trim()
      .substring(0, 155);
    if (text) descriptionMeta = text;
  }

  const mainImage = product.attributes.imagen?.data?.attributes;

  return {
    title: `${product.attributes.titulo} | América Pinturas`,
    description: descriptionMeta,
    openGraph: {
      title: `${product.attributes.titulo} | América Pinturas`,
      description: descriptionMeta,
      images: mainImage?.url
        ? [
            {
              url: mainImage.url,
              width: mainImage.width || 800,
              height: mainImage.height || 600,
              alt: mainImage.alternativeText || product.attributes.titulo,
            },
          ]
        : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.attributes.titulo} | América Pinturas`,
      description: descriptionMeta,
      images: mainImage?.url ? [mainImage.url] : [],
    },
  };
}
