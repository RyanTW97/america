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

const API_URL = "https://servidor-tricolor-64a23aa2b643.herokuapp.com";
const PRODUCTS_ENDPOINT = `${API_URL}/api/productos-americas`;
const DEFAULT_PAGE_SIZE = 8;
const QUICK_FILTER_PARAM_NAME = "quick_filter_mode";
const SEARCH_QUERY_PARAM_NAME = "q";

// --- CONFIGURACIÓN DE FILTROS ---

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
  apiEndpoint: string; // Ruta relativa después de API_URL, ej: /api/lineas-americas
  relationFieldInProduct: string;
}

const FILTER_SOURCES: FilterSourceConfig[] = [
  {
    uiTitle: "Líneas",
    queryParamName: "lineas",
    apiEndpoint: "/api/lineas-americas",
    relationFieldInProduct: "lineas_america",
  },
  {
    uiTitle: "Acabados",
    queryParamName: "acabados",
    apiEndpoint: "/api/acabados",
    relationFieldInProduct: "acabados",
  },
  {
    uiTitle: "Ambiente Exterior",
    queryParamName: "ambiente_exterior",
    apiEndpoint: "/api/ambiente-exteriors",
    relationFieldInProduct: "ambiente_exteriors",
  },
  {
    uiTitle: "Ambiente Interior",
    queryParamName: "ambiente_interior",
    apiEndpoint: "/api/ambiente-interiors",
    relationFieldInProduct: "ambiente_interiors",
  },
  {
    uiTitle: "Superficies",
    queryParamName: "superficies",
    apiEndpoint: "/api/superficies",
    relationFieldInProduct: "superficies",
  },
  {
    uiTitle: "Tipo de Producto",
    queryParamName: "tipo_producto",
    apiEndpoint: "/api/tipo-de-productos",
    relationFieldInProduct: "tipo_de_productos",
  },
];

// --- FUNCIONES DE FETCH ---

async function getAvailableFilterOptions(): Promise<FilterGroup[]> {
  const promises = FILTER_SOURCES.map(async (source) => {
    const params = new URLSearchParams({
      "pagination[pageSize]": "100",
      "sort[0]": "nombre:asc",
      "fields[0]": "nombre",
      "fields[1]": "slug",
    });
    const url = `${API_URL}${source.apiEndpoint}?${params.toString()}`;

    try {
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) {
        console.error(
          `Error ${res.status} al cargar ${source.uiTitle} desde ${url}`
        );
        return {
          success: false,
          title: source.uiTitle,
          name: source.queryParamName,
          options: [],
        };
      }
      const json: StrapiFilterCollectionResponse = await res.json();
      const options: FilterOption[] = json.data.map((item) => ({
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
      console.error(`Excepción cargando ${source.uiTitle}:`, error);
      return {
        success: false,
        title: source.uiTitle,
        name: source.queryParamName,
        options: [],
      };
    }
  });

  const settled = await Promise.allSettled(promises);
  return settled.map((result, i) => {
    if (result.status === "fulfilled" && result.value.success) {
      const { title, name, options } = result.value;
      return { title, name, options: options || [] };
    } else {
      const src = FILTER_SOURCES[i];
      return { title: src.uiTitle, name: src.queryParamName, options: [] };
    }
  });
}

interface GetProductsParams {
  page?: number;
  pageSize?: number;
}

async function getProducts(
  fetchParams: GetProductsParams = {},
  activeFilters?: URLSearchParams
): Promise<{ products: Product[]; pagination: StrapiPagination | null }> {
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = fetchParams;
  const apiParams = new URLSearchParams({
    populate: "*",
    "pagination[page]": page.toString(),
    "pagination[pageSize]": pageSize.toString(),
    "sort[0]": "titulo:asc",
  });

  const searchQuery = activeFilters?.get(SEARCH_QUERY_PARAM_NAME)?.trim();
  if (searchQuery) {
    apiParams.append(`filters[titulo][$containsi]`, searchQuery);
  } else {
    FILTER_SOURCES.forEach((source) => {
      const selected = activeFilters?.getAll(source.queryParamName) || [];
      selected.forEach((slugValue, idx) => {
        apiParams.append(
          `filters[${source.relationFieldInProduct}][slug][$in][${idx}]`,
          slugValue
        );
      });
    });

    const quick = activeFilters?.get(QUICK_FILTER_PARAM_NAME);
    if (quick === "inen") {
      apiParams.append(`filters[selloCalidad][$notNull]`, "true");
    } else if (quick === "interiores") {
      const cfg = FILTER_SOURCES.find(
        (f) => f.queryParamName === "ambiente_interior"
      );
      if (cfg)
        apiParams.append(
          `filters[${cfg.relationFieldInProduct}][$notNull]`,
          "true"
        );
    } else if (quick === "exteriores") {
      const cfg = FILTER_SOURCES.find(
        (f) => f.queryParamName === "ambiente_exterior"
      );
      if (cfg)
        apiParams.append(
          `filters[${cfg.relationFieldInProduct}][$notNull]`,
          "true"
        );
    }
  }

  const url = `${PRODUCTS_ENDPOINT}?${apiParams.toString()}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      console.error(`Error ${res.status} al cargar productos desde ${url}`);
      throw new Error(`Product fetch failed: ${res.status}`);
    }
    const json: StrapiProductsResponse = await res.json();
    return {
      products: json.data || [],
      pagination: json.meta?.pagination || null,
    };
  } catch (error) {
    console.error("Error detallado cargando productos:", error);
    return { products: [], pagination: null };
  }
}

async function getFeaturedProducts(): Promise<Product[]> {
  const params = new URLSearchParams({
    "filters[destacado][$eq]": "true",
    "populate[imagen]": "*",
    "fields[0]": "titulo",
    "fields[1]": "slug",
    "fields[2]": "descripcion",
    "pagination[limit]": "12",
    "sort[0]": "updatedAt:desc",
  });
  const url = `${PRODUCTS_ENDPOINT}?${params.toString()}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error(`Error ${res.status} al cargar destacados desde ${url}`);
      return [];
    }
    const json: StrapiProductsResponse = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Excepción cargando productos destacados:", error);
    return [];
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// Esta página depende de searchParams para filtrar y paginar en cada petición.
// Al usar searchParams, Next.js la tratará como dinámica por defecto.
// ───────────────────────────────────────────────────────────────────────────────
export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };

interface PageProps {
  searchParams?: SearchParams;
}

export default async function Page({ searchParams }: PageProps) {
  // En Next.js 15, searchParams llega como promesa. Debemos await antes de usarlo.
  const sp: SearchParams = (await searchParams) || {};
  const rawPage = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const parsedPage = rawPage ? parseInt(rawPage, 10) : NaN;
  const currentPage = !isNaN(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  // Construimos un objeto URLSearchParams a partir de sp
  const urlSearchParams = new URLSearchParams();
  Object.entries(sp).forEach(([key, value]) => {
    if (typeof value === "string") {
      urlSearchParams.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v) => urlSearchParams.append(key, v));
    }
  });

  // Nombre de parámetros de filtros para pasarlos a los componentes hijos
  const sidebarQueryParamNames = FILTER_SOURCES.map(
    (src) => src.queryParamName
  );

  // Ejecutamos las tres llamadas concurrentemente
  const [availableFilters, mainProductsData, featuredProducts] =
    await Promise.all([
      getAvailableFilterOptions(),
      getProducts(
        { page: currentPage, pageSize: DEFAULT_PAGE_SIZE },
        urlSearchParams
      ),
      getFeaturedProducts(),
    ]);

  const { products, pagination } = mainProductsData;

  return (
    <main>
      <HeaderBanner />

      <div className="flex flex-col gap-6 px-6 py-8 md:flex-row">
        {/* Sidebar con filtros */}
        <div className="hidden w-[270px] shrink-0 lg:block">
          <SidebarFilters filterGroups={availableFilters} />
        </div>

        {/* Contenido principal: buscador y grilla de productos */}
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
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4">
        <Separator className="my-8 bg-zinc-300 sm:my-10 md:my-12" />
      </div>

      {featuredProducts.length > 0 && (
        <div className="pb-12">
          <div className="container mx-auto px-4">
            <ProductCarousel products={featuredProducts} />
          </div>
        </div>
      )}
    </main>
  );
}
