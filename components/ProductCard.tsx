// components/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator"; // Ajusta la ruta si tu 'ui' está en otro lugar
import { Product } from "@/app/types";

interface ProductCardProps {
  product: Product | null | undefined;
}

const ProductCard = ({ product }: ProductCardProps) => {
  if (!product || !product.attributes) {
    return (
      <div className="flex h-[240px] w-full flex-col items-center justify-center rounded-2xl border bg-white p-4 text-center shadow-md md:w-[180px]">
        <p className="text-xs text-red-500">Producto no disponible</p>
      </div>
    );
  }

  const { titulo, slug, imagen } = product.attributes;

  const imageUrl =
    imagen?.data?.attributes?.formats?.small?.url || // Priorizar 'small' para tarjetas
    imagen?.data?.attributes?.formats?.thumbnail?.url ||
    imagen?.data?.attributes?.url ||
    `https://placehold.co/180x180/E2E8F0/AAAAAA?text=${encodeURIComponent(
      titulo || "Imagen"
    )}`; // Ajustado placeholder

  const imageAltText =
    imagen?.data?.attributes?.alternativeText || titulo || "Imagen de producto";

  const productSlugOrId =
    slug || (product.id ? product.id.toString() : "detalle");
  const productUrl = `/nuestros-productos/${productSlugOrId}`;

  return (
    <Link
      href={productUrl}
      className="block h-full text-decoration-none"
      prefetch={false}
    >
      <div className="flex h-[240px] w-full flex-col items-center justify-between rounded-2xl border bg-white p-3 shadow-sm transition-all duration-200 ease-in-out hover:border-blue-600 hover:shadow-lg md:w-[180px]">
        {/* Contenedor de imagen: aumentado a h-2/3 o h-4/6 */}
        <div className="mb-2 flex h-[60%] w-full items-center justify-center overflow-hidden pt-1 sm:h-[65%]">
          {" "}
          {/* Usando porcentaje para más control */}
          <Image
            src={imageUrl}
            alt={imageAltText}
            // Estas dimensiones son para el aspect ratio y reserva de espacio.
            // La imagen se escalará con object-contain dentro del div padre.
            width={160}
            height={140}
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const placeholderUrl = `https://placehold.co/160x140/E2E8F0/AAAAAA?text=${encodeURIComponent(
                titulo || "Error"
              )}`;
              if (target.src !== placeholderUrl) {
                target.srcset = placeholderUrl;
                target.src = placeholderUrl;
              }
            }}
          />
        </div>

        <Separator className="my-1 w-full bg-zinc-200 md:my-2" />

        {/* Título del producto: ajustado para el nuevo espacio */}
        <h3 className="line-clamp-2 h-[3em] px-1 text-center text-xs font-semibold leading-tight text-blue-900 sm:text-sm">
          {/* Reducido line-clamp y altura fija para el título si la imagen es más grande */}
          {titulo || "Nombre no disponible"}
        </h3>
      </div>
    </Link>
  );
};

export default ProductCard;
