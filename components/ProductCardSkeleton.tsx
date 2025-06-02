// components/ProductCardSkeleton.tsx
import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div className="flex h-[240px] w-full flex-col items-center justify-between rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm md:w-[180px]">
      {/* Espacio para la imagen */}
      <div className="mb-2 flex h-[60%] w-full items-center justify-center overflow-hidden pt-1 sm:h-[65%]">
        <div className="h-full w-full animate-pulse rounded bg-gray-300"></div>
      </div>

      {/* Separador simulado o simplemente espacio */}
      <div className="my-1 h-px w-full bg-gray-200 md:my-2"></div>

      {/* Espacio para el título */}
      <div className="h-[3em] w-full px-1">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-300"></div>
        <div className="mt-1 h-4 w-1/2 animate-pulse rounded bg-gray-300"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
