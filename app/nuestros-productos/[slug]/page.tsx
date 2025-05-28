// app/nuestros-productos/[slug]/page.tsx
// @ts-nocheck
// @ts-ignore
import Link from "next/link";
import ProductDetailHeader from "./components/ProductDetailHeader";
import ProductDetails from "./components/ProductDatails"; // Corregido: Debería ser ProductDetails
import RelatedProductsByLine from "./components/RelatedProductsByLine";
import ProductCarousel from "@/components/ProductCarousel";

import {
  ProductPageData,
  StrapiSingleProductResponse,
  Product,
  StrapiProductsResponse,
} from "@/app/types/productPage"; // Asegúrate que estas importaciones sean correctas
// import { LineasAmerica } from "@/app/types"; // No se usa directamente

// Importaciones faltantes (basadas en el código anterior)
import { FilterGroup, FilterOption } from "./../components/SidebarFilters"; // Ajusta la ruta si es necesario
import { StrapiPagination } from "@/app/types"; // Si StrapiFilterCollectionResponse la necesita

// --- CONSTANTES ---
// FIJAMOS LA URL BASE DE LA API DIRECTAMENTE PARA DEPURACIÓN
const API_URL = "https://servidor-tricolor-64a23aa2b643.herokuapp.com/api";

const PRODUCTS_ENDPOINT = `${API_URL}/productos-americas`; // API_URL ya incluye /api
// const DEFAULT_PAGE_SIZE = 8; // No se usa en este archivo directamente
// const QUICK_FILTER_PARAM_NAME = "quick_filter_mode"; // No se usa en este archivo directamente
// const SEARCH_QUERY_PARAM_NAME = "q"; // No se usa en este archivo directamente

// --- INTERFACES ADICIONALES (si no están en los types importados) ---
interface StrapiFilterOptionData {
  id: number;
  attributes: {
    nombre: string;
    slug: string;
  };
}

interface StrapiFilterCollectionResponse {
  data: StrapiFilterOptionData[];
  meta: {
    // Asumiendo que StrapiPagination está disponible
    pagination: StrapiPagination;
  };
}

interface FilterSourceConfig {
  uiTitle: string;
  queryParamName: string;
  apiEndpoint: string; // Ruta relativa DESPUÉS de API_URL, ej: /lineas-americas
  relationFieldInProduct: string;
}

// --- CONFIGURACIÓN DE FILTROS ---
// Los apiEndpoint aquí son relativos y se añadirán a API_URL.
// Como API_URL ya tiene /api, estos endpoints no deben empezar con /api.
const FILTER_SOURCES: FilterSourceConfig[] = [
  {
    uiTitle: "Líneas",
    queryParamName: "lineas",
    apiEndpoint: "/lineas-americas",
    relationFieldInProduct: "lineas_america",
  },
  {
    uiTitle: "Acabados",
    queryParamName: "acabados",
    apiEndpoint: "/acabados",
    relationFieldInProduct: "acabados",
  },
  {
    uiTitle: "Ambiente Exterior",
    queryParamName: "ambiente_exterior",
    apiEndpoint: "/ambiente-exteriors",
    relationFieldInProduct: "ambiente_exteriors",
  },
  {
    uiTitle: "Ambiente Interior",
    queryParamName: "ambiente_interior",
    apiEndpoint: "/ambiente-interiors",
    relationFieldInProduct: "ambiente_interiors",
  },
  {
    uiTitle: "Superficies",
    queryParamName: "superficies",
    apiEndpoint: "/superficies",
    relationFieldInProduct: "superficies",
  },
  {
    uiTitle: "Tipo de Producto",
    queryParamName: "tipo_producto",
    apiEndpoint: "/tipo-de-productos",
    relationFieldInProduct: "tipo_de_productos",
  },
];

// --- FUNCIONES DE FETCH ---

async function getAvailableFilterOptions(): Promise<FilterGroup[]> {
  const allFilterGroups: FilterGroup[] = [];
  for (const source of FILTER_SOURCES) {
    try {
      const optionsUrlParams = new URLSearchParams({
        "pagination[pageSize]": "100",
        "sort[0]": "nombre:asc",
        "fields[0]": "nombre",
        "fields[1]": "slug",
      });
      // API_URL ya incluye /api, source.apiEndpoint es la ruta específica de la colección
      const fullOptionsUrl = `${API_URL}${
        source.apiEndpoint
      }?${optionsUrlParams.toString()}`;
      // console.log(`Fetching filter options for ${source.uiTitle} from ${fullOptionsUrl}`); // Para depuración

      const res = await fetch(fullOptionsUrl, { next: { revalidate: 3600 } });
      if (!res.ok) {
        console.error(
          `Error fetching filter options for ${source.uiTitle} from ${fullOptionsUrl}: ${res.status} ${res.statusText}`
        );
        allFilterGroups.push({
          title: source.uiTitle,
          name: source.queryParamName,
          options: [],
        });
        continue;
      }
      const responseJson: StrapiFilterCollectionResponse = await res.json();
      const options: FilterOption[] = responseJson.data.map((item) => ({
        label: item.attributes.nombre,
        value: item.attributes.slug,
      }));
      allFilterGroups.push({
        title: source.uiTitle,
        name: source.queryParamName,
        options,
      });
    } catch (error) {
      console.error(
        `Exception fetching filter options for ${source.uiTitle}:`,
        error
      );
      allFilterGroups.push({
        title: source.uiTitle,
        name: source.queryParamName,
        options: [],
      });
    }
  }
  return allFilterGroups;
}

async function getProductBySlug(slug: string): Promise<ProductPageData | null> {
  const populateParams = new URLSearchParams({
    "populate[lineas_america][populate][Imagen]": "*", // Imagen de la línea
    "populate[imagen]": "*", // Imagen principal del producto
    "populate[selloCalidad]": "*",
    "populate[colores]": "*",
    "populate[presentacion]": "*",
    "populate[ventajas]": "*",
    "populate[ficha_Tecnica]": "*",
    // Populate para productos relacionados dentro de la misma línea
    "populate[lineas_america][populate][productos_americas][populate][imagen]":
      "*", // Imagen de productos relacionados
    "populate[lineas_america][populate][productos_americas][fields][0]":
      "titulo",
    "populate[lineas_america][populate][productos_americas][fields][1]": "slug",
    "populate[lineas_america][populate][productos_americas][fields][2]":
      "descripcion",
  });
  const filterParams = new URLSearchParams({ "filters[slug][$eq]": slug });

  // PRODUCTS_ENDPOINT ya es la URL completa de la colección de productos
  const fullUrl = `${PRODUCTS_ENDPOINT}?${filterParams.toString()}&${populateParams.toString()}`;
  // console.log("Fetching product detail from:", fullUrl); // Para depuración

  try {
    const res = await fetch(fullUrl, { next: { revalidate: 60 } });
    if (!res.ok) {
      const errorBody = await res.text();
      console.error(
        `Error fetching product ${slug} from ${fullUrl}: ${res.status} ${res.statusText}. Body: ${errorBody}`
      );
      return null;
    }
    const responseJson: StrapiSingleProductResponse = await res.json();

    // Strapi puede devolver un array de datos o un solo objeto de datos para un filtro de slug.
    // Normalmente, con un filtro de igualdad de slug, debería ser un array con un elemento o vacío.
    if (Array.isArray(responseJson.data) && responseJson.data.length > 0) {
      return responseJson.data[0];
    }
    // Caso menos común: si Strapi devuelve un objeto directamente (no un array)
    if (!Array.isArray(responseJson.data) && responseJson.data) {
      // Esto es inusual para filtros, pero lo manejamos por si acaso.
      return responseJson.data as ProductPageData;
    }

    console.warn(`Product with slug "${slug}" not found or data is empty.`);
    return null;
  } catch (error) {
    console.error(`Exception fetching product ${slug}:`, error);
    return null;
  }
}

async function getFeaturedProducts(): Promise<Product[]> {
  const queryParams = new URLSearchParams({
    "filters[destacado][$eq]": "true",
    "populate[imagen]": "*",
    "fields[0]": "titulo",
    "fields[1]": "slug",
    "fields[2]": "descripcion",
    "pagination[limit]": "12",
    "sort[0]": "updatedAt:desc",
  });
  // PRODUCTS_ENDPOINT ya es la URL completa de la colección de productos
  const fullUrl = `${PRODUCTS_ENDPOINT}?${queryParams.toString()}`;
  // console.log("Fetching featured products from:", fullUrl); // Para depuración

  try {
    const res = await fetch(fullUrl, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error(
        `Error fetching featured products: ${res.status} ${res.statusText}`
      );
      return [];
    }
    const responseJson: StrapiProductsResponse = await res.json();
    return responseJson.data || [];
  } catch (error) {
    console.error("Exception fetching featured products:", error);
    return [];
  }
}

// --- COMPONENTE DE PÁGINA ---
interface ProductDetailPageProps {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined }; // Añadido searchParams opcional
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = params;

  // No es necesario obtener availableFilters aquí si SearchAndTags no se usa en esta página.
  // Si se usara, entonces sí sería necesario.
  const [productData, featuredProducts /*, availableFilters */] =
    await Promise.all([
      getProductBySlug(slug),
      getFeaturedProducts(),
      // getAvailableFilterOptions(), // Descomentar si SearchAndTags se añade a esta página
    ]);

  if (!productData) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center sm:p-24">
        <h1 className="text-2xl font-semibold text-zinc-800">
          Producto no encontrado
        </h1>
        <p className="mt-2 text-zinc-600">
          El producto que buscas ({slug}) no pudo ser cargado o no existe.
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

  const lineaPrincipal = productData.attributes.lineas_america?.data;
  const lineaAttributes = lineaPrincipal?.attributes;

  const productsInLineaFromStrapi = lineaAttributes?.productos_americas?.data;

  const relatedProductsData: Product[] = productsInLineaFromStrapi
    ? productsInLineaFromStrapi
        .filter(
          (p: any) =>
            p &&
            p.attributes &&
            p.attributes.slug !== productData.attributes.slug
        ) // Añadir verificación de p y p.attributes
        .map((p: any) => ({
          id: p.id,
          attributes: {
            titulo: p.attributes.titulo,
            slug: p.attributes.slug,
            imagen: p.attributes.imagen, // Asegúrate que esto sea la estructura que ProductCard espera
            // o mapea a product.attributes.imagen.data.attributes.url si es necesario
            descripcion: p.attributes.descripcion,
            // ... otros campos que ProductCard/ProductCarousel puedan necesitar
          },
        }))
    : [];
  const limitedRelatedProducts = relatedProductsData.slice(0, 10);

  // const sidebarQueryParamNames = FILTER_SOURCES.map(
  //   (source) => source.queryParamName
  // ); // No se usa si SearchAndTags no está aquí

  return (
    <main className="min-h-screen bg-zinc-50">
      {lineaAttributes ? (
        <ProductDetailHeader
          lineaTitle={lineaAttributes.nombre}
          lineaImageUrl={lineaAttributes.Imagen?.data?.attributes.url}
          lineaImageAlt={
            lineaAttributes.Imagen?.data?.attributes.alternativeText ||
            `Imagen de línea ${lineaAttributes.nombre}`
          }
        />
      ) : (
        <div className="bg-zinc-200 py-8 text-center text-zinc-500">
          {/* Podrías mostrar un banner genérico o nada si no hay línea */}
        </div>
      )}

      <ProductDetails
        productId={productData.id}
        productAttributes={productData.attributes}
      />

      {lineaAttributes && limitedRelatedProducts.length > 0 && (
        <RelatedProductsByLine
          lineaNombre={lineaAttributes.nombre}
          relatedProducts={limitedRelatedProducts} // Pasa los productos ya mapeados
        />
      )}

      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold uppercase sm:text-4xl">
            <span className="text-blue-700">PRODUCTOS</span>
            <span className="ml-2 inline-block rounded-md bg-red-600 px-3 py-1 text-white">
              DESTACADOS
            </span>
          </h2>
          {featuredProducts && featuredProducts.length > 0 ? (
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

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product || !product.attributes) {
    // Añadida verificación de product.attributes
    return {
      title: "Producto no encontrado",
      description: "El producto que buscas no está disponible.",
    };
  }

  let descriptionMeta = `Detalles sobre ${product.attributes.titulo}. Encuentra calidad y rendimiento con los productos de América Pinturas.`;
  const descBlocks = product.attributes.descripcion;

  // Asegurarse de que descBlocks es un array y tiene elementos antes de acceder a descBlocks[0]
  if (
    Array.isArray(descBlocks) && // Verificar que es un array
    descBlocks.length > 0 &&
    descBlocks[0] && // Verificar que el primer elemento existe
    descBlocks[0].type === "paragraph" &&
    Array.isArray(descBlocks[0].children) && // Verificar que children es un array
    descBlocks[0].children.length > 0
  ) {
    descriptionMeta = descBlocks[0].children
      .filter((c: any) => c && c.type === "text" && typeof c.text === "string") // Añadir más verificaciones
      .map((c: any) => c.text)
      .join(" ")
      .substring(0, 155);
    if (!descriptionMeta.trim()) {
      // Fallback si la descripción procesada está vacía
      descriptionMeta = `Conoce más sobre ${product.attributes.titulo}, una solución de calidad de América Pinturas.`;
    }
  }

  return {
    title: `${product.attributes.titulo} | América Pinturas`,
    description: descriptionMeta.trim(),
  };
}
