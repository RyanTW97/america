// app/nuestros-productos/[slug]/components/ProductImageDisplay.tsx
"use client";

// Eliminamos useState y useEffect para el 'liked' local
import Image from "next/image";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

// Importaciones para la funcionalidad de Favoritos
import type { ProductForFavorites } from "@/app/types/favorites"; // Ajusta la ruta si es necesario
import { useFavoritesStore } from "@/lib/store/useFavoritesStore"; // Ajusta la ruta si es necesario
import { useInterfaceStore } from "@/lib/store/useInterfaceStore"; // Ajusta la ruta si es necesario
import { toast } from "sonner"; // Para las notificaciones

interface ProductImageDisplayProps {
  productId: number;
  productTitulo: string; // Nueva prop
  productSlug: string; // Nueva prop
  imageUrl?: string | null;
  altText?: string | null;
  hasSelloCalidad?: boolean;
}

const ProductImageDisplay = ({
  productId,
  productTitulo,
  productSlug,
  imageUrl,
  altText = "Imagen del producto",
  hasSelloCalidad = false,
}: ProductImageDisplayProps) => {
  // Conectar a los stores de Zustand
  const {
    toggleFavorite: toggleFavoriteAction,
    addFavorite: addFavoriteAction,
  } = useFavoritesStore((state) => state.actions);

  const isLiked = useFavoritesStore((state) =>
    state.favoriteProducts.some((favProduct) => favProduct.id === productId)
  );

  const { openFavoritesSheet } = useInterfaceStore((state) => state.actions);

  const handleLikeClick = () => {
    if (!imageUrl) {
      // No se puede añadir a favoritos si no hay imagen (o la info esencial)
      toast.error(
        "No se puede añadir este producto a favoritos en este momento."
      );
      return;
    }

    const productDataForFavorite: ProductForFavorites = {
      id: productId,
      titulo: productTitulo,
      slug: productSlug,
      imageUrl: imageUrl, // Usamos la imageUrl proporcionada
    };

    const result = toggleFavoriteAction(productDataForFavorite);

    if (result.status === "added") {
      toast.success(`"${productTitulo}" añadido a favoritos.`, {
        action: {
          label: "Ver favoritos",
          onClick: () => openFavoritesSheet(),
        },
        duration: 3000,
      });
    } else if (result.status === "removed" && result.product) {
      const removedProduct = result.product;
      toast.info(`"${productTitulo}" eliminado de favoritos.`, {
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
  };

  // Dimensiones condicionales de la imagen
  const productImageWidth = hasSelloCalidad ? 613 : 500;
  const productImageHeight = hasSelloCalidad ? 577 : 470;

  return (
    <div className="relative flex w-full justify-center">
      <div
        className="relative"
        style={{
          width: `${productImageWidth}px`,
          height: `${productImageHeight}px`,
        }}
      >
        <button
          type="button"
          onClick={handleLikeClick}
          className={cn(
            "absolute -left-2 -top-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-200 ease-in-out hover:scale-110 sm:-left-3 sm:-top-3"
            // Las clases de texto para el color del corazón ya no son necesarias aquí si 'fill-current' se usa bien
          )}
          aria-label={isLiked ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          <Heart
            className={cn(
              "h-5 w-5 sm:h-6 sm:w-6 transition-all", // Añadido transition-all
              isLiked
                ? "fill-red-500 text-red-600" // Estilo cuando está "liked"
                : "text-zinc-400 hover:text-red-500" // Estilo cuando no está "liked"
            )}
            strokeWidth={isLiked ? 2 : 1.5} // Ajusta el strokeWidth también
          />
        </button>

        <div className="h-full w-full overflow-hidden rounded-lg ">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={altText || "Imagen del producto"}
              width={productImageWidth}
              height={productImageHeight}
              className="h-full w-full object-contain"
              priority // Es la imagen principal de la página de producto, priority es bueno
            />
          ) : (
            <div
              style={{
                aspectRatio: `${productImageWidth}/${productImageHeight}`,
              }}
              className="flex w-full items-center justify-center rounded-lg bg-zinc-100"
            >
              <p className="text-zinc-500">Imagen no disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductImageDisplay;
