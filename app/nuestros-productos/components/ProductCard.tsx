"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/app/types/productPage";
import type { ProductForFavorites } from "@/app/types/favorites";
import { useFavoritesStore } from "@/lib/store/useFavoritesStore";
import { useInterfaceStore } from "@/lib/store/useInterfaceStore";
import { toast } from "sonner";

interface ProductCardProps {
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
  // Si no existe el producto o no tiene atributos, mostramos mensaje de "no disponible"
  if (!product || !product.attributes) {
    return (
      <div className="flex h-[240px] w-full flex-col items-center justify-center rounded-2xl border bg-white p-4 text-center shadow-md md:w-[180px]">
        <p className="text-xs text-red-500">Producto no disponible</p>
      </div>
    );
  }

  const { id } = product;
  const { titulo, slug, imagen } = product.attributes;

  // 1) Obtenemos las acciones del store de favoritos
  const {
    toggleFavorite: toggleFavoriteAction,
    addFavorite: addFavoriteAction,
  } = useFavoritesStore((state) => state.actions);

  // 2) Obtenemos acciones del store de interfaz
  const { openFavoritesSheet } = useInterfaceStore((state) => state.actions);

  // 3) Comprobamos si el id actual está en favoritos
  const isLiked = useFavoritesStore((state) =>
    state.favoriteProducts.some((favProduct) => favProduct.id === id)
  );

  // 4) Normalizamos "imagen" por si viene como array o como objeto
  //    De Strapi podríamos recibir:
  //    - imagen.data = { attributes: { ... } }
  //    - imagen.data = [{ attributes: { ... } }, ...]
  //
  //    Con esta constante, forzamos a que "imagenData" sea undefined o bien el primer elemento
  const imagenData = useMemo(() => {
    if (!imagen?.data) return undefined;

    // Si "data" es arreglo, tomamos el primer elemento
    if (Array.isArray(imagen.data)) {
      return imagen.data.length > 0 ? imagen.data[0] : undefined;
    }

    // Si "data" es objeto único, lo devolvemos directamente
    return imagen.data;
  }, [imagen]);

  // 5) Construimos la URL de la imagen (o placeholder si no existiera ninguna)
  const imageUrl = useMemo(() => {
    // Si encontramos "formats.small.url", lo usamos
    if (imagenData?.attributes.formats?.small?.url) {
      return imagenData.attributes.formats.small.url;
    }
    // Si no, usamos "formats.thumbnail.url"
    if (imagenData?.attributes.formats?.thumbnail?.url) {
      return imagenData.attributes.formats.thumbnail.url;
    }
    // Si no, usamos la URL base
    if (imagenData?.attributes.url) {
      return imagenData.attributes.url;
    }
    // Si nada existe, devolvemos un placeholder con el título
    return `https://placehold.co/180x180/E2E8F0/AAAAAA?text=${encodeURIComponent(
      titulo || "Imagen"
    )}`;
  }, [imagenData, titulo]);

  // 6) Texto alternativo para la imagen
  const imageAltText =
    imagenData?.attributes.alternativeText || titulo || "Imagen de producto";

  // 7) Construimos el slug o id para la URL del producto
  const productSlugOrId = slug || id.toString();
  const productUrl = `/nuestros-productos/${productSlugOrId}`;

  // 8) Manejador para click en "like"
  const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const productDataForFavorite: ProductForFavorites = {
      id,
      titulo,
      slug: productSlugOrId,
      imageUrl,
    };

    const result = toggleFavoriteAction(productDataForFavorite);

    if (result.status === "added") {
      toast.success(`"${titulo}" añadido a favoritos.`, {
        action: {
          label: "Ver favoritos",
          onClick: () => openFavoritesSheet(),
        },
        duration: 3000,
      });
    } else if (result.status === "removed" && result.product) {
      const removedProduct = result.product;
      toast.info(`"${titulo}" eliminado de favoritos.`, {
        action: {
          label: "Deshacer",
          onClick: () => {
            addFavoriteAction(removedProduct);
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
    <div className="group relative flex h-full w-full flex-col rounded-2xl border bg-white p-3 shadow-sm transition-all duration-200 ease-in-out hover:border-blue-600 hover:shadow-lg md:w-[180px]">
      {/* Capa transparente para enlazar todo el card */}
      <Link
        href={productUrl}
        className="absolute inset-0 z-0"
        aria-label={`Ver detalles de ${titulo}`}
        prefetch={false}
      >
        <span className="sr-only">Ver detalles de {titulo}</span>
      </Link>

      {/* Botón de "like" */}
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

      {/* Contenido principal del card (imagen + título) */}
      <Link
        href={productUrl}
        className="relative z-10 flex h-full flex-col"
        prefetch={false}
      >
        {/* Contenedor de la imagen */}
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
