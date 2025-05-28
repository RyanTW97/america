// app/nuestros-productos/[slug]/components/ProductAdvantages.tsx
"use client";

import { ShieldCheck } from "lucide-react"; // Ícono para ventajas

interface VentajaItem {
  id: number; // El ID que Strapi asigna a cada entrada del componente repetible
  ventaja: string; // El texto de la ventaja
  // __component?: string; // Strapi a veces añade esto, pero no lo necesitamos para el tipado aquí
}

interface ProductAdvantagesProps {
  ventajas?: VentajaItem[] | null; // El array de ventajas puede ser opcional o nulo
}

const ProductAdvantages = ({ ventajas }: ProductAdvantagesProps) => {
  // Si no hay ventajas o el array está vacío, no renderizar nada.
  if (!ventajas || ventajas.length === 0) {
    return null;
  }

  return (
    // Contenedor principal con estilos consistentes
    <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
      {/* Encabezado de la sección */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500 text-white sm:h-14 sm:w-14">
          <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2} />
        </div>
        <h3 className="text-xl font-bold text-red-600 sm:text-2xl md:text-3xl">
          {" "}
          {/* Ajustado tamaño de fuente */}
          Ventajas
        </h3>
      </div>
      {/* Lista de ventajas */}
      <ul className="list-disc space-y-1.5 pl-5 text-sm text-zinc-700 sm:space-y-2 sm:text-base">
        {ventajas.map((item) => (
          // Usar item.id como key, ya que es único para cada ventaja en el array de Strapi.
          <li key={item.id}>{item.ventaja}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductAdvantages;
