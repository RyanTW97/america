// components/ProductSearchDialog.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";

import type { Product, StrapiProductsResponse } from "@/app/types";

interface ProductSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "https://servidor-tricolor-64a23aa2b643.herokuapp.com";
const API_PREFIX = "/api";
const PRODUCTS_ENDPOINT = `${STRAPI_BASE_URL}${API_PREFIX}/productos-americas`;

// Clave que usaremos en localStorage para cachear los 6 productos destacados
const CACHE_KEY = "featuredProductsCache";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const ProductSearchDialog: React.FC<ProductSearchDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * fetchProducts: hace una petición a Strapi.
   *   - Si ‘query’ está indefinido (primera carga), pide los destacados.
   *   - Si ‘query’ existe, filtra por título.
   * Además, si es carga inicial, guarda la respuesta en localStorage.
   */
  const fetchProducts = useCallback(async (query?: string) => {
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams({
      "populate[imagen]": "*",
      "fields[0]": "titulo",
      "fields[1]": "slug",
      "pagination[pageSize]": "6",
    });

    if (query) {
      // Búsqueda por texto
      params.append("filters[titulo][$containsi]", query);
      params.append("sort[0]", "titulo:asc");
    } else {
      // Primera carga: productos destacados
      params.append("filters[destacado][$eq]", "true");
      params.append("sort[0]", "updatedAt:desc");
    }

    try {
      const res = await fetch(`${PRODUCTS_ENDPOINT}?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Error al obtener productos: ${res.statusText}`);
      }
      const data: StrapiProductsResponse = await res.json();
      const productsArray: Product[] = data.data || [];
      setDisplayedProducts(productsArray);

      // Si se trata de la carga inicial (sin query), guardamos en localStorage
      if (!query) {
        try {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(
              CACHE_KEY,
              JSON.stringify(productsArray)
            );
          }
        } catch (e) {
          console.warn(
            "No se pudo guardar productos destacados en localStorage:",
            e
          );
        }
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Ocurrió un error desconocido."
      );
      setDisplayedProducts([]);
    } finally {
      setIsLoading(false);
      if (!query) {
        // Marcamos que ya se intentó la carga inicial, para no volverla a ejecutar
        setInitialLoadAttempted(true);
      }
    }
  }, []);

  /**
   * Al abrir el diálogo por primera vez:
   *   1) Intentamos leer del localStorage.
   *   2) Si existe cache, lo parseamos y seteamos en estado.
   *   3) Si no existe (o hay error de parse), hacemos fetch normal.
   */
  useEffect(() => {
    if (open && !initialLoadAttempted) {
      if (typeof window !== "undefined") {
        const cached = window.localStorage.getItem(CACHE_KEY);
        if (cached) {
          try {
            const parsed: Product[] = JSON.parse(cached);
            setDisplayedProducts(parsed);
            setInitialLoadAttempted(true);
            return; // Ya tenemos los productos desde el cache: no volvemos a fetch
          } catch (e) {
            console.warn("Error parseando cache de productos destacados:", e);
            window.localStorage.removeItem(CACHE_KEY);
          }
        }
      }
      // Si no hay cache válido, hacemos fetch normal
      fetchProducts();
    }
  }, [open, initialLoadAttempted, fetchProducts]);

  /**
   * Cada vez que cambia el texto de búsqueda (debounced):
   *   - Si hay texto, buscamos por ese texto.
   *   - Si se borra el texto y ya hubo carga inicial, recargamos destacados.
   */
  useEffect(() => {
    if (debouncedSearchQuery) {
      fetchProducts(debouncedSearchQuery);
    } else if (initialLoadAttempted && searchQuery === "") {
      fetchProducts();
    }
  }, [debouncedSearchQuery, searchQuery, initialLoadAttempted, fetchProducts]);

  /**
   * Cuando se cierra el diálogo, reseteamos el searchQuery y permitimos
   * que, en la próxima apertura, se lea del cache o se vuelva a cargar.
   */
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setInitialLoadAttempted(false);
      setError(null);
      // NOTA: no limpiamos displayedProducts aquí para que al reabrir,
      // si hay cache, muestre inmediatamente los productos.
    }
  }, [open]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="col-span-1 sm:col-span-2 mt-6 py-8 text-center text-red-500">
          <p>Error: {error}</p>
          <p>Inténtalo de nuevo más tarde.</p>
        </div>
      );
    }

    if (displayedProducts.length === 0) {
      // Si no se ha intentado la carga inicial (ni hay query), mostramos mensaje de carga
      if (!initialLoadAttempted && !searchQuery) {
        return (
          <div className="mt-6 py-8 text-center text-zinc-500">
            Cargando productos iniciales...
          </div>
        );
      }
      // Si hay query pero no hay resultados
      if (searchQuery) {
        return (
          <div className="col-span-1 sm:col-span-2 mt-6 py-8 text-center text-zinc-700">
            No hay productos que coincidan con "
            <span className="font-semibold">{searchQuery}</span>".
          </div>
        );
      }
      // Si no hay destacados para mostrar
      return (
        <div className="col-span-1 sm:col-span-2 mt-6 py-8 text-center text-zinc-700">
          No hay productos a destacar en este momento.
        </div>
      );
    }

    // Si hay productos (sean destacados o resultado de búsqueda), los mostramos
    return (
      <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
        {displayedProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => {
              onOpenChange(false); // Cierra el diálogo si el usuario hace clic en un card
            }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
      <DialogContent
        className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-xl transform -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg
          data-[state=open]:animate-in data-[state=closed]:animate-out
          data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
          data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
          data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]
          data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]
          sm:rounded-lg md:w-full md:max-w-2xl lg:max-w-3xl"
        onEscapeKeyDown={() => onOpenChange(false)}
      >
        <VisuallyHidden>
          <DialogTitle>Buscar Productos</DialogTitle>
        </VisuallyHidden>

        <div className="relative mb-2 p-2">
          <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar producto por nombre..."
            className="w-full rounded-lg border-gray-300 py-3 pl-10 pr-4 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Buscar producto"
          />
        </div>

        <div className="max-h-[calc(70vh-90px)] overflow-y-auto pr-2 custom-scrollbar">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductSearchDialog;
