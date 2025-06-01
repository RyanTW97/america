// app/favorites/page.tsx
"use client";

import React, { Suspense } from "react";
import ProductGrid from "../nuestros-productos/components/ProductGrid";
import {
  ListingProduct as Product,
  StrapiPagination,
} from "@/app/types/productPage";

export default function FavoritosPage() {
  // Por defecto, dejamos el arreglo de favoritos vacío.
  // En tu lógica real, aquí obtendrás un array de objetos “ProductForListing”
  // p. ej. desde localStorage, contexto, o un fetch a tu API de favoritos.
  const favoriteProducts: Product[] = [];
  const favoritePagination: StrapiPagination | null = null;
  const pageSize = 8;

  return (
    <main className="w-full min-h-screen bg-white">
      {/* Título */}
      <div className="py-16 px-4 md:px-24 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1D1E8D]">
          Tus productos favoritos
        </h1>
      </div>

      {/* Grid de Productos Favoritos */}
      <section className="px-4 md:px-24 pb-24">
        <Suspense fallback={<p>Cargando productos favoritos…</p>}>
          <ProductGrid
            initialProducts={favoriteProducts}
            initialPagination={favoritePagination}
            pageSize={pageSize}
          />
        </Suspense>
      </section>
    </main>
  );
}
