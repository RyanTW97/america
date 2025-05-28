// components/ProductGrid.tsx
"use client";

import { useCallback, useMemo } from "react"; // Importar useCallback y useMemo
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { Product, StrapiPagination } from "@/app/types";
import { Button } from "@/components/ui/button";

interface ProductGridProps {
  initialProducts: Product[];
  initialPagination: StrapiPagination | null;
  pageSize: number;
}

const ProductGrid = ({
  initialProducts,
  initialPagination,
  pageSize,
}: ProductGridProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = useMemo(
    () => initialPagination?.page || 1,
    [initialPagination]
  );
  const pageCount = useMemo(
    () => initialPagination?.pageCount || 1,
    [initialPagination]
  );
  const totalProducts = useMemo(
    () => initialPagination?.total || 0,
    [initialPagination]
  );
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage < 1 || newPage > pageCount) return;

      const currentUrlParams = new URLSearchParams(
        Array.from(searchParams.entries())
      );
      currentUrlParams.set("page", newPage.toString());
      router.push(`${pathname}?${currentUrlParams.toString()}`, {
        scroll: false,
      });
    },
    [searchParams, router, pathname, pageCount]
  );
  const { startItem, endItem } = useMemo(() => {
    const calculatedStartItem = (currentPage - 1) * pageSize + 1;
    const calculatedEndItem = Math.min(currentPage * pageSize, totalProducts);
    return { startItem: calculatedStartItem, endItem: calculatedEndItem };
  }, [currentPage, pageSize, totalProducts]);

  if (!initialProducts || initialProducts.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-lg text-zinc-600">No hay productos para mostrar.</p>
        {/* Podrías añadir un ícono o una ilustración aquí */}
      </div>
    );
  }

  return (
    <div>
      {/* Información sobre los productos mostrados */}
      <div className="mb-6 text-sm text-zinc-600">
        {totalProducts > 0 ? (
          <p>
            Mostrando {startItem} - {endItem} de {totalProducts} productos
          </p>
        ) : (
          // Este mensaje podría aparecer si initialProducts está vacío pero totalProducts es 0
          // (por ejemplo, si los filtros no devuelven nada).
          <p>No hay productos que coincidan con tu búsqueda o filtros.</p>
        )}
      </div>

      {/* Cuadrícula de productos */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {initialProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Controles de Paginación */}
      {pageCount > 1 && (
        <div className="mt-10 flex items-center justify-center space-x-3 sm:space-x-4">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            aria-label="Ir a la página anterior"
          >
            Anterior
          </Button>

          <span className="text-sm font-medium text-zinc-700">
            Página {currentPage} de {pageCount}
          </span>

          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pageCount}
            variant="outline"
            size="sm"
            aria-label="Ir a la página siguiente"
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
