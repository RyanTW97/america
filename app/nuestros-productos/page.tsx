// app/nuestros-productos/page.tsx

import HeaderBanner from "./components/HeaderBanner";
import SidebarFilters, {
  FilterGroup,
  FilterOption,
} from "./components/SidebarFilters";
import SearchAndTags from "./components/SearchAndTags";
import ProductGrid from "./components/ProductGrid";
import ProductCarousel from "@/components/ProductCarousel";
import { Product, StrapiPagination, StrapiProductsResponse } from "@/app/types";
import { Separator } from "@/components/ui/separator";

// FIJAMOS LA URL BASE DE LA API DIRECTAMENTE PARA DEPURACIÓN
const API_URL = "https://servidor-tricolor-64a23aa2b643.herokuapp.com";

// AJUSTAMOS EL ENDPOINT DE PRODUCTOS Y OTROS PARÁMETROS CON /api/
const PRODUCTS_ENDPOINT = `${API_URL}/api/productos-americas`;
const DEFAULT_PAGE_SIZE = 8;
const QUICK_FILTER_PARAM_NAME = "quick_filter_mode";
const SEARCH_QUERY_PARAM_NAME = "q";

// --- INTERFACES ---
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
    pagination: StrapiPagination;
  };
}

interface FilterSourceConfig {
  uiTitle: string;
  queryParamName: string;
  apiEndpoint: string; // Esta será la ruta relativa DESPUÉS de API_URL, ej: /api/lineas-americas
  relationFieldInProduct: string;
}

interface GetProductsParams {
  page?: number;
  pageSize?: number;
}

// --- CONFIGURACIÓN DE FILTROS CON /api/ ---
const FILTER_SOURCES: FilterSourceConfig[] = [
  {
    uiTitle: "Líneas",
    queryParamName: "lineas",
    apiEndpoint: "/api/lineas-americas", // Incluye /api/
    relationFieldInProduct: "lineas_america",
  },
  {
    uiTitle: "Acabados",
    queryParamName: "acabados",
    apiEndpoint: "/api/acabados", // Incluye /api/
    relationFieldInProduct: "acabados",
  },
  {
    uiTitle: "Ambiente Exterior",
    queryParamName: "ambiente_exterior",
    apiEndpoint: "/api/ambiente-exteriors", // Incluye /api/
    relationFieldInProduct: "ambiente_exteriors",
  },
  {
    uiTitle: "Ambiente Interior",
    queryParamName: "ambiente_interior",
    apiEndpoint: "/api/ambiente-interiors", // Incluye /api/
    relationFieldInProduct: "ambiente_interiors",
  },
  {
    uiTitle: "Superficies",
    queryParamName: "superficies",
    apiEndpoint: "/api/superficies", // Incluye /api/
    relationFieldInProduct: "superficies",
  },
  {
    uiTitle: "Tipo de Producto",
    queryParamName: "tipo_producto",
    apiEndpoint: "/api/tipo-de-productos", // Incluye /api/
    relationFieldInProduct: "tipo_de_productos",
  },
];

// --- FUNCIONES DE FETCH ---

async function getAvailableFilterOptions(): Promise<FilterGroup[]> {
  const fetchOptionPromises = FILTER_SOURCES.map(async (source) => {
    try {
      const optionsUrlParams = new URLSearchParams({
        "pagination[pageSize]": "100",
        "sort[0]": "nombre:asc",
        "fields[0]": "nombre",
        "fields[1]": "slug",
      });
      // Construye la URL completa usando API_URL y el apiEndpoint del source
      const fullOptionsUrl = `${API_URL}${
        source.apiEndpoint
      }?${optionsUrlParams.toString()}`;
      // console.log(`Fetching filter options for ${source.uiTitle} from ${fullOptionsUrl}`); // Log para depuración

      const res = await fetch(fullOptionsUrl, { next: { revalidate: 3600 } });
      if (!res.ok) {
        console.error(
          `Error fetching filter options for ${source.uiTitle} from ${fullOptionsUrl}: ${res.status} ${res.statusText}`
        );
        return {
          success: false,
          title: source.uiTitle,
          name: source.queryParamName,
          options: [],
        };
      }
      const responseJson: StrapiFilterCollectionResponse = await res.json();
      const options: FilterOption[] = responseJson.data.map((item) => ({
        label: item.attributes.nombre,
        value: item.attributes.slug,
      }));
      return {
        success: true,
        title: source.uiTitle,
        name: source.queryParamName,
        options,
      };
    } catch (error) {
      console.error(
        `Exception fetching filter options for ${source.uiTitle}:`,
        error
      );
      return {
        success: false,
        title: source.uiTitle,
        name: source.queryParamName,
        options: [],
      };
    }
  });
  const results = await Promise.allSettled(fetchOptionPromises);
  const allFilterGroups: FilterGroup[] = results.map((result) => {
    if (result.status === "fulfilled" && result.value.success) {
      const { title, name, options } = result.value;
      return { title, name, options: options || [] };
    } else {
      const failedSourceInfo =
        result.status === "rejected"
          ? FILTER_SOURCES.find(
              (s) => s.uiTitle === (result.reason as any)?.title
            )
          : (result.value as any);

      return {
        title: failedSourceInfo?.uiTitle || "Error de Filtro",
        name: failedSourceInfo?.queryParamName || "error",
        options: [],
      };
    }
  });
  return allFilterGroups;
}

async function getProducts(
  fetchParams: GetProductsParams = {},
  activeFilters?: URLSearchParams
): Promise<{ products: Product[]; pagination: StrapiPagination | null }> {
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = fetchParams;
  const strapiApiParams = new URLSearchParams({
    populate: "*",
    "pagination[page]": page.toString(),
    "pagination[pageSize]": pageSize.toString(),
    "sort[0]": "titulo:asc",
  });
  const searchQuery = activeFilters?.get(SEARCH_QUERY_PARAM_NAME)?.trim();
  if (searchQuery) {
    strapiApiParams.append(`filters[titulo][$containsi]`, searchQuery);
  } else {
    FILTER_SOURCES.forEach((filterConfig) => {
      const selectedValues = activeFilters?.getAll(filterConfig.queryParamName);
      if (selectedValues && selectedValues.length > 0) {
        selectedValues.forEach((slugValue, index) => {
          // Asumiendo que relationFieldInProduct es el nombre correcto del campo de relación en Strapi
          strapiApiParams.append(
            `filters[${filterConfig.relationFieldInProduct}][slug][$in][${index}]`,
            slugValue
          );
        });
      }
    });
    const activeQuickFilter = activeFilters?.get(QUICK_FILTER_PARAM_NAME);
    if (activeQuickFilter) {
      if (activeQuickFilter === "inen")
        strapiApiParams.append(`filters[selloCalidad][$notNull]`, "true");
      else if (activeQuickFilter === "interiores") {
        const config = FILTER_SOURCES.find(
          (f) => f.queryParamName === "ambiente_interior"
        );
        if (config)
          strapiApiParams.append(
            `filters[${config.relationFieldInProduct}][$notNull]`, // Usa el campo de relación correcto
            "true"
          );
      } else if (activeQuickFilter === "exteriores") {
        const config = FILTER_SOURCES.find(
          (f) => f.queryParamName === "ambiente_exterior"
        );
        if (config)
          strapiApiParams.append(
            `filters[${config.relationFieldInProduct}][$notNull]`, // Usa el campo de relación correcto
            "true"
          );
      }
    }
  }
  // PRODUCTS_ENDPOINT ya incluye API_URL y /api/
  const fullUrl = `${PRODUCTS_ENDPOINT}?${strapiApiParams.toString()}`;
  // console.log("Fetching products (main list):", fullUrl); // Log para depuración
  try {
    const res = await fetch(fullUrl, { next: { revalidate: 60 } });
    if (!res.ok) {
      const errorBody = await res.text();
      console.error(
        `Error ${res.status} fetching products from ${fullUrl}: ${errorBody}`
      );
      throw new Error(`Product fetch failed: ${res.status}`);
    }
    const responseJson: StrapiProductsResponse | [StrapiProductsResponse] =
      await res.json();
    // Maneja el caso donde Strapi podría devolver un array con un solo objeto
    const actualResponse = Array.isArray(responseJson)
      ? responseJson[0]
      : responseJson;
    return {
      products: actualResponse?.data || [],
      pagination: actualResponse?.meta?.pagination || null,
    };
  } catch (error) {
    console.error("Detailed error fetching products:", error);
    return { products: [], pagination: null };
  }
}

async function getFeaturedProducts(): Promise<Product[]> {
  const queryParams = new URLSearchParams({
    "filters[destacado][$eq]": "true",
    "populate[imagen]": "*",
    "fields[0]": "titulo",
    "fields[1]": "slug",
    "fields[2]": "descripcion",
    "pagination[limit]": "12", // Strapi usa pagination[limit] o pagination[pageSize]
    "sort[0]": "updatedAt:desc",
  });
  // PRODUCTS_ENDPOINT ya incluye API_URL y /api/
  const fullUrl = `${PRODUCTS_ENDPOINT}?${queryParams.toString()}`;
  // console.log("Fetching featured products (main page) from:", fullUrl); // Log para depuración
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
interface PageProps {
  searchParams?: {
    page?: string;
    [SEARCH_QUERY_PARAM_NAME]?: string;
    [QUICK_FILTER_PARAM_NAME]?: string;
    // Permite otros parámetros de filtro basados en FILTER_SOURCES
    [key: string]: string | string[] | undefined;
  };
}

export default async function Page({ searchParams }: PageProps) {
  const currentPageQuery = searchParams?.page;
  const parsedPage = currentPageQuery ? parseInt(currentPageQuery, 10) : 1;
  const validCurrentPage = Math.max(1, isNaN(parsedPage) ? 1 : parsedPage);

  const urlSearchParams = new URLSearchParams();
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (typeof value === "string") {
        urlSearchParams.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((v) => urlSearchParams.append(key, v));
      }
    });
  }

  const sidebarQueryParamNames = FILTER_SOURCES.map(
    (source) => source.queryParamName
  );

  // Las funciones de fetch ahora usan las constantes API_URL y endpoints actualizadas
  const [availableFilters, mainProductsData, featuredProducts] =
    await Promise.all([
      getAvailableFilterOptions(),
      getProducts(
        { page: validCurrentPage, pageSize: DEFAULT_PAGE_SIZE },
        urlSearchParams
      ),
      getFeaturedProducts(),
    ]);

  const { products, pagination } = mainProductsData;

  return (
    <main>
      <HeaderBanner />
      <div className="flex flex-col gap-6 px-6 py-8 md:flex-row">
        <div className="hidden w-[270px] shrink-0 lg:block">
          <SidebarFilters filterGroups={availableFilters} />
        </div>
        <div className="flex-1">
          <SearchAndTags
            availableFilters={availableFilters}
            sidebarFilterQueryParamNames={sidebarQueryParamNames}
          />
          {products.length > 0 ? (
            <ProductGrid
              initialProducts={products}
              initialPagination={pagination}
              pageSize={DEFAULT_PAGE_SIZE}
            />
          ) : (
            <div className="py-10 text-center">
              <p className="text-xl text-zinc-700">
                No se encontraron productos que coincidan con los filtros
                seleccionados.
              </p>
              {/* Podrías añadir un mensaje más específico si todos los filtros están vacíos también */}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4">
        <Separator className="my-8 bg-zinc-300 sm:my-10 md:my-12" />
      </div>

      {featuredProducts && featuredProducts.length > 0 && (
        <div className="pb-12">
          <div className="container mx-auto px-4">
            {/* Considera añadir un título aquí si es necesario */}
            {/* <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold uppercase sm:text-4xl">
                <span className="text-blue-700">PRODUCTOS</span>
                <span className="ml-2 inline-block rounded-md bg-red-600 px-3 py-1 text-white">
                  DESTACADOS
                </span>
              </h2>
            </div> */}
            <ProductCarousel products={featuredProducts} />
          </div>
        </div>
      )}
    </main>
  );
}
