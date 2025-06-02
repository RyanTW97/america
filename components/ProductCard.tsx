// src/components/ProductCard.tsx
"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useFavoritesStore } from "@/lib/store/useFavoritesStore";
import { useInterfaceStore } from "@/lib/store/useInterfaceStore";

// Importamos el tipo Product tal cual como lo definimos en /app/types.ts
import type { Product } from "@/app/types";
import type { ProductForFavorites } from "@/app/types/favorites";

interface ProductCardProps {
  // Ahora ProductCard recibe Product (el mismo que viene de Strapi) o null/undefined
  product: Product | null | undefined;
  onFavoriteAction?: (
    actionType: "added" | "removed",
    product: ProductForFavorites
  ) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onFavoriteAction,
}) => {
  // 1) Separamos las llamadas a useFavoritesStore para evitar devolver un objeto nuevo cada render
  const toggleFavorite = useFavoritesStore(
    (state) => state.actions.toggleFavorite
  );
  const addFavorite = useFavoritesStore((state) => state.actions.addFavorite);
  const favoriteProducts = useFavoritesStore((state) => state.favoriteProducts);

  // 2) Acciones del store de interfaz
  const { openFavoritesSheet } = useInterfaceStore((state) => state.actions);

  // 3) Early return si no hay producto o no tiene atributos
  if (!product?.attributes) {
    return (
      <div className="flex h-[240px] w-full flex-col items-center justify-center rounded-2xl border bg-white p-4 text-center shadow-md md:w-[180px]">
        <p className="text-xs text-red-500">Producto no disponible</p>
      </div>
    );
  }

  // 4) Desestructuramos id y atributos del producto
  const { id } = product;
  const { titulo, slug, imagen } = product.attributes;

  // 5) isLiked: comprobamos si este producto ya está en favoritos
  const isLiked = useMemo(
    () => favoriteProducts.some((fav) => fav.id === id),
    [favoriteProducts, id]
  );

  // 6) Normalizamos `imagen.data` (puede venir como objeto o como arreglo)
  const imagenData = useMemo(() => {
    if (!imagen?.data) return undefined;
    return Array.isArray(imagen.data) ? imagen.data[0] : imagen.data;
  }, [imagen]);

  // 7) Construimos la URL de la imagen (o fallback placeholder)
  const imageUrl = useMemo(() => {
    const formats = imagenData?.attributes.formats;
    return (
      formats?.small?.url ??
      formats?.thumbnail?.url ??
      imagenData?.attributes.url ??
      `https://placehold.co/180x180/E2E8F0/AAAAAA?text=${encodeURIComponent(
        titulo || "Imagen"
      )}`
    );
  }, [imagenData, titulo]);

  // 8) Texto alternativo para la imagen
  const imageAltText =
    imagenData?.attributes.alternativeText || titulo || "Imagen de producto";

  // 9) Preparamos el slug/o id para la URL del producto
  const productSlugOrId = slug || id.toString();
  const productUrl = `/nuestros-productos/${productSlugOrId}`;

  // 10) Handler para el botón de corazón (favoritos)
  const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const productForFav: ProductForFavorites = {
      id,
      titulo,
      slug: productSlugOrId,
      imageUrl,
    };

    const result = toggleFavorite(productForFav);

    if (result.status === "added") {
      toast.success(`"${titulo}" añadido a favoritos.`, {
        action: { label: "Ver favoritos", onClick: () => openFavoritesSheet() },
        duration: 3000,
      });
    } else if (result.status === "removed" && result.product) {
      const removedProduct = result.product;
      toast.info(`"${titulo}" eliminado de favoritos.`, {
        action: {
          label: "Deshacer",
          onClick: () => {
            addFavorite(removedProduct);
            toast.success(`"${removedProduct.titulo}" restaurado a favoritos.`);
          },
        },
        duration: 5000,
      });
    }

    if (onFavoriteAction && result.product) {
      onFavoriteAction(result.status, result.product);
    }
  };

  return (
    <div className="group relative flex h-[240px] w-full flex-col items-center justify-between rounded-2xl border bg-white p-3 shadow-sm transition-all duration-200 ease-in-out hover:border-blue-600 hover:shadow-lg md:w-[180px]">
      {/* Link transparente que cubre todo el card */}
      <Link
        href={productUrl}
        className="absolute inset-0 z-0"
        aria-label={`Ver detalles de ${titulo}`}
        prefetch={false}
      >
        <span className="sr-only">Ver detalles de {titulo}</span>
      </Link>

      {/* Botón de corazón (like) */}
      <button
        type="button"
        onClick={handleLikeClick}
        className="absolute top-3 right-3 z-20 rounded-full bg-white/80 p-1.5 shadow-md backdrop-blur-sm transition-colors hover:bg-rose-50"
        aria-label={isLiked ? "Quitar de favoritos" : "Añadir a favoritos"}
      >
        <Heart
          className={`h-5 w-5 transition-all ${
            isLiked
              ? "fill-red-500 text-red-600"
              : "text-gray-400 hover:text-red-500 group-hover:text-red-400"
          }`}
          strokeWidth={isLiked ? 2 : 1.5}
        />
      </button>

      {/* Contenido principal: imagen + nombre */}
      <Link
        href={productUrl}
        className="relative z-10 flex h-full w-full flex-col items-center justify-between"
        prefetch={false}
      >
        <div className="mb-2 flex h-[60%] w-full items-center justify-center overflow-hidden pt-1 sm:h-[65%]">
          <Image
            src={imageUrl}
            alt={imageAltText}
            width={160}
            height={140}
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
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

        <h3 className="line-clamp-2 h-[3em] px-1 text-center text-xs font-semibold leading-tight text-blue-900 group-hover:text-blue-700 sm:text-sm">
          {titulo || "Nombre no disponible"}
        </h3>
      </Link>
    </div>
  );
};

export default ProductCard;
