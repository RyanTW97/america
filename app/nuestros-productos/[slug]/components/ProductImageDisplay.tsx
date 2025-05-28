// app/nuestros-productos/[slug]/components/ProductImageDisplay.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageDisplayProps {
  productId: number;
  imageUrl?: string | null;
  altText?: string | null;
  hasSelloCalidad?: boolean; // Nueva prop
}

const ProductImageDisplay = ({
  productId,
  imageUrl,
  altText = "Imagen del producto",
  hasSelloCalidad = false, // Valor por defecto si no se proporciona
}: ProductImageDisplayProps) => {
  const localStorageKey = `liked_product_${productId}`;
  const [liked, setLiked] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedLikedState = localStorage.getItem(localStorageKey);
      if (storedLikedState !== null) {
        setLiked(JSON.parse(storedLikedState));
      }
    } catch (error) {
      console.error("Error al leer de localStorage:", error);
    }
  }, [localStorageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(localStorageKey, JSON.stringify(liked));
    } catch (error) {
      console.error("Error al escribir en localStorage:", error);
    }
  }, [liked, localStorageKey]);

  const handleLikeClick = () => {
    setLiked((prevLiked) => !prevLiked);
  };

  // Dimensiones condicionales de la imagen
  const productImageWidth = hasSelloCalidad ? 613 : 500;
  const productImageHeight = hasSelloCalidad ? 577 : 470; // Mantiene un aspect ratio similar

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
            "absolute -left-2 -top-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-200 ease-in-out hover:scale-110 sm:-left-3 sm:-top-3",
            liked ? "text-red-500" : "text-zinc-400 hover:text-red-400"
          )}
          aria-label={liked ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          <Heart
            className={cn("h-5 w-5 sm:h-6 sm:w-6", liked && "fill-current")}
            strokeWidth={1.5}
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
              priority
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
