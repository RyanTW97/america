// app/nuestros-productos/page.tsx
// @ts-nocheck
export const dynamic = "force-dynamic";

import HeaderBanner from "./components/HeaderBanner";
import SidebarFilters, {
  FilterGroup,
  FilterOption,
} from "./components/SidebarFilters";
import SearchAndTags from "./components/SearchAndTags";
import ProductGrid from "./components/ProductGrid";
import ProductCarousel from "@/components/ProductCarousel";

import {
  Product,
  StrapiPagination,
  StrapiProductsResponse,
  StrapiFilterCollectionResponse,
  FilterSourceConfig as PageFilterSourceConfig,
  GetProductsParams as PageGetProductsParams,
} from "@/app/types/productPage";

import { Separator } from "@/components/ui/separator";

const STRAPI_BASE_URL =
  process.env.STRAPI_API_URL ||
  "https://servidor-tricolor-64a23aa2b643.herokuapp.com";
const API_PREFIX = "/api";
const PRODUCTS_ENDPOINT = `${STRAPI_BASE_URL}${API_PREFIX}/productos-americas`;

const DEFAULT_PAGE_SIZE = 8;
const QUICK_FILTER_PARAM_NAME = "quick_filter_mode";
const SEARCH_QUERY_PARAM_NAME = "q";

const FILTER_SOURCES: PageFilterSourceConfig[] = [
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

async function getAvailableFilterOptions(): Promise<FilterGroup[]> {
  const fetchOptionPromises = FILTER_SOURCES.map(async (source) => {
    try {
      const optionsUrlParams = new URLSearchParams({
        "pagination[pageSize]": "100",
        "sort[0]": "nombre:asc",
        "fields[0]": "nombre",
        "fields[1]": "slug",
      });
      const fullOptionsUrl = `${STRAPI_BASE_URL}${API_PREFIX}${
        source.apiEndpoint
      }?${optionsUrlParams.toString()}`;

      const res = await fetch(fullOptionsUrl, { next: { revalidate: 3600 } });
      if (!res.ok) {
        console.error(
          `Error fetching options for ${source.uiTitle} from ${fullOptionsUrl}: ${res.status} ${res.statusText}`
        );
        return {
          success: false,
          title: source.uiTitle,
          name: source.queryParamName,
          options: [] as FilterOption[],
        };
      }

      const responseJson: StrapiFilterCollectionResponse = await res.json();
      const options: FilterOption[] = (responseJson.data || []).map((item) => ({
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
      console.error(`Exception fetching options for ${source.uiTitle}:`, error);
      return {
        success: false,
        title: source.uiTitle,
        name: source.queryParamName,
        options: [] as FilterOption[],
      };
    }
  });

  const results = await Promise.allSettled(fetchOptionPromises);
  return results.map((result, i) => {
    if (result.status === "fulfilled" && result.value.success) {
      const { title, name, options } = result.value;
      return { title, name, options: options || [] };
    }
    const sourceInfo = FILTER_SOURCES[i];
    return {
      title: sourceInfo?.uiTitle || "Error de Filtro",
      name: sourceInfo?.queryParamName || "error",
      options: [],
    };
  });
}

async function getProducts(
  fetchParams: PageGetProductsParams = {},
  activeFilters?: URLSearchParams
): Promise<{ products: Product[]; pagination: StrapiPagination | null }> {
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = fetchParams;
  const strapiApiParams = new URLSearchParams({
    "populate[imagen]": "*",
    "fields[0]": "titulo",
    "fields[1]": "slug",
    "fields[2]": "descripcion",
    "populate[lineas_america]": "slug",
    "populate[acabados]": "slug",
    "populate[ambiente_exteriors]": "slug",
    "populate[ambiente_interiors]": "slug",
    "populate[superficies]": "slug",
    "populate[tipo_de_productos]": "slug",
    "populate[selloCalidad]": "*",
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
          strapiApiParams.append(
            `filters[${filterConfig.relationFieldInProduct}][slug][$in][${index}]`,
            slugValue
          );
        });
      }
    });

    const activeQuickFilter = activeFilters?.get(QUICK_FILTER_PARAM_NAME);
    if (activeQuickFilter) {
      if (activeQuickFilter === "inen") {
        strapiApiParams.append(`filters[selloCalidad][$notNull]`, "true");
      } else if (activeQuickFilter === "interiores") {
        const config = FILTER_SOURCES.find(
          (f) => f.queryParamName === "ambiente_interior"
        );
        if (config) {
          strapiApiParams.append(
            `filters[${config.relationFieldInProduct}][$notNull]`,
            "true"
          );
        }
      } else if (activeQuickFilter === "exteriores") {
        const config = FILTER_SOURCES.find(
          (f) => f.queryParamName === "ambiente_exterior"
        );
        if (config) {
          strapiApiParams.append(
            `filters[${config.relationFieldInProduct}][$notNull]`,
            "true"
          );
        }
      }
    }
  }

  const fullUrl = `${PRODUCTS_ENDPOINT}?${strapiApiParams.toString()}`;
  try {
    const res = await fetch(fullUrl, { next: { revalidate: 60 } });
    if (!res.ok) {
      const errorBody = await res.text();
      console.error(
        `Error ${res.status} fetching products from ${fullUrl}: ${errorBody}`
      );
      throw new Error(`Product fetch failed: ${res.status}`);
    }
    const responseJson: StrapiProductsResponse = await res.json();
    return {
      products: responseJson.data || [],
      pagination: responseJson.meta?.pagination || null,
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
    "pagination[limit]": "12",
    "sort[0]": "updatedAt:desc",
  });
  const fullUrl = `${PRODUCTS_ENDPOINT}?${queryParams.toString()}`;

  try {
    const res = await fetch(fullUrl, { next: { revalidate: 3600 } });
    if (!res.ok) {
      const errorBody = await res.text();
      console.error(
        `Error fetching featured products: ${res.status} ${res.statusText}. URL: ${fullUrl}. Response: ${errorBody}`
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

interface PageProps {
  searchParams: Promise<{
    page?: string;
    [SEARCH_QUERY_PARAM_NAME]?: string;
    [QUICK_FILTER_PARAM_NAME]?: string;
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const pageParam = params.page as string | undefined;
  const qParam = params[SEARCH_QUERY_PARAM_NAME] as string | undefined;
  const quickFilterParam = params[QUICK_FILTER_PARAM_NAME] as
    | string
    | undefined;

  const parsedPage = pageParam ? parseInt(pageParam, 10) : 1;
  const validCurrentPage = Math.max(1, isNaN(parsedPage) ? 1 : parsedPage);

  const urlSearchParams = new URLSearchParams();
  if (pageParam) urlSearchParams.append("page", pageParam);
  if (qParam) urlSearchParams.append(SEARCH_QUERY_PARAM_NAME, qParam);
  if (quickFilterParam)
    urlSearchParams.append(QUICK_FILTER_PARAM_NAME, quickFilterParam);

  const sidebarQueryParamNames = FILTER_SOURCES.map(
    (source) => source.queryParamName
  );

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
            <div className="mb-8 text-center"></div>
            <ProductCarousel products={featuredProducts} />
          </div>
        </div>
      )}
    </main>
  );
}
