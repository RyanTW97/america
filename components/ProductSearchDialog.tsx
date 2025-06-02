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

// Ahora ambos tipos (Product y StrapiProductsResponse) vienen de un único archivo de tipos
import type { Product, StrapiProductsResponse } from "@/app/types";

interface ProductSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Ejemplo: si en .env tienes NEXT_PUBLIC_STRAPI_API_URL, se usará esa; si no, se recurre al URL “por defecto”
const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "https://servidor-tricolor-64a23aa2b643.herokuapp.com";
const API_PREFIX = "/api";
const PRODUCTS_ENDPOINT = `${STRAPI_BASE_URL}${API_PREFIX}/productos-americas`;

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

  const fetchProducts = useCallback(async (query?: string) => {
    setIsLoading(true);
    setError(null);

    // Los parámetros que pedimos a Strapi:
    // - populate[imagen]=* para traer la imagen completa
    // - fields[]=titulo, fields[]=slug para solo esos campos (junto a imagen)
    // - pagination[pageSize]=6 para mostrar máximo 6 resultados
    const params = new URLSearchParams({
      "populate[imagen]": "*",
      "fields[0]": "titulo",
      "fields[1]": "slug",
      "pagination[pageSize]": "6",
    });

    if (query) {
      // Si hay texto de búsqueda, filtramos por título (case-insensitive)
      params.append("filters[titulo][$containsi]", query);
      params.append("sort[0]", "titulo:asc");
    } else {
      // En la primera carga, mostramos solo los productos destacados
      params.append("filters[destacado][$eq]", "true");
      params.append("sort[0]", "updatedAt:desc");
    }

    try {
      const res = await fetch(`${PRODUCTS_ENDPOINT}?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Error al obtener productos: ${res.statusText}`);
      }
      const data: StrapiProductsResponse = await res.json();
      // data.data es Product[]; cada Product trae atributos completos (incluyendo createdAt, updatedAt, publishedAt, imagen, etc.)
      setDisplayedProducts(data.data || []);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Ocurrió un error desconocido."
      );
      setDisplayedProducts([]);
    } finally {
      setIsLoading(false);
      if (!query) {
        // Si fue carga inicial (sin query), marcamos que ya intentamos cargar una vez
        setInitialLoadAttempted(true);
      }
    }
  }, []);

  // Cuando se abre el diálogo por primera vez, hacemos la carga inicial
  useEffect(() => {
    if (open && !initialLoadAttempted) {
      fetchProducts();
    }
  }, [open, initialLoadAttempted, fetchProducts]);

  // Cada vez que cambia el texto (debounce), volvemos a buscar
  useEffect(() => {
    if (debouncedSearchQuery) {
      fetchProducts(debouncedSearchQuery);
    } else if (initialLoadAttempted && searchQuery === "") {
      // Si borramos el texto de búsqueda y ya hubo carga inicial, recargamos destacados
      fetchProducts();
    }
  }, [debouncedSearchQuery, searchQuery, initialLoadAttempted, fetchProducts]);

  // Cuando se cierra el diálogo, reiniciamos estado de búsqueda
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setInitialLoadAttempted(false);
      setError(null);
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
      // Si todavía no se intentó la carga inicial y no hay query, mostramos “Cargando…”
      if (!initialLoadAttempted && !searchQuery) {
        return (
          <div className="mt-6 py-8 text-center text-zinc-500">
            Cargando productos iniciales...
          </div>
        );
      }
      // Si hay query pero no resultaron coincidencias
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

    // Si hay resultados, los mostramos en un grid
    return (
      <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
        {displayedProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => {
              onOpenChange(false); // Cierra el diálogo si el usuario hace clic en el card
            }}
          >
            {/* Pasamos el objeto “Product” directamente a ProductCard */}
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
