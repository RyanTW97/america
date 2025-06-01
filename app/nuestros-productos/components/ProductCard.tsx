// components/ProductCard.tsx
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, StrapiRichTextParagraphNode } from "@/app/types";

interface ProductCardProps {
  product: Product;
}

/**
 * Extracts and formats a short description from the product's description data.
 * @param descripcion - The description data from product attributes.
 * @param maxLength - The maximum length of the short description before truncating.
 * @returns A short description string.
 */
function getShortDescription(
  descripcion: Product["attributes"]["descripcion"],
  maxLength: number = 120
): string {
  if (descripcion && descripcion.length > 0) {
    const firstParagraph = descripcion[0];
    if (
      firstParagraph &&
      firstParagraph.type === "paragraph" &&
      firstParagraph.children &&
      firstParagraph.children.length > 0
    ) {
      const text = firstParagraph.children
        .filter(
          (child): child is StrapiRichTextParagraphNode & { type: "text" } =>
            child.type === "text"
        )
        .map((child) => child.text)
        .join(" ");

      if (text.length > maxLength) {
        return text.substring(0, maxLength).trimEnd() + "...";
      }
      return text;
    }
  }
  return "Descripción no disponible.";
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [liked, setLiked] = useState(false);

  const { titulo, descripcion, imagen, slug } = product.attributes;

  // Memoize derived values to prevent recalculation on re-renders unless dependencies change.
  const imageUrl = useMemo(
    () =>
      imagen?.data?.attributes?.formats?.small?.url ||
      imagen?.data?.attributes?.url ||
      `https://placehold.co/600x400/E2E8F0/AAAAAA?text=${encodeURIComponent(
        titulo
      )}`,
    [imagen, titulo]
  );

  const shortDescription = useMemo(
    () => getShortDescription(descripcion),
    [descripcion]
  );

  // Construct the URL for the product detail page.
  const productUrl = `/nuestros-productos/${slug}`;

  return (
    // Main card container: relative positioning for absolute children, flex column layout.
    <div className="group relative flex h-full flex-col overflow-visible rounded-lg border border-zinc-200 bg-white shadow-sm transition-all duration-300 ease-in-out hover:border-blue-600 hover:shadow-lg">
      {/* Clickable area for navigation, covering most of the card. */}
      <Link
        href={productUrl}
        className="absolute inset-0 z-0"
        aria-label={`Ver detalles de ${titulo}`}
      >
        <span className="sr-only">Ver detalles de {titulo}</span>
      </Link>
      {/* Content wrapper with padding, ensuring it's above the main Link for interaction. */}
      <div className="relative z-10 flex flex-grow flex-col p-4 pb-0">
        {" "}
        {/* pb-0 here as button will occupy space */}
        {/* Like button */}
        <button
          type="button"
          className="absolute top-3 right-3 z-20 rounded-full bg-white p-1.5 shadow-md transition-colors hover:bg-zinc-100"
          onClick={(e) => {
            e.stopPropagation(); // Prevent Link navigation when liking.
            e.preventDefault();
            setLiked(!liked);
          }}
          aria-label={liked ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          <Heart
            className={`h-5 w-5 transition-all ${
              liked
                ? "fill-red-500 text-red-500"
                : "text-zinc-400 hover:text-red-400"
            }`}
            strokeWidth={liked ? 2 : 1.5}
          />
        </button>
        {/* Image container */}
        <div className="relative mb-4 flex h-48 w-full items-center justify-center md:h-56">
          <Link
            href={productUrl}
            className="absolute inset-0 z-0"
            aria-label={`Ver detalles de ${titulo}`}
          >
            <Image
              src={imageUrl}
              alt={
                imagen?.data?.attributes?.alternativeText ||
                `Imagen de ${titulo}`
              }
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" // Responsive image sizes
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const placeholderUrl = `https://placehold.co/600x400/E2E8F0/AAAAAA?text=${encodeURIComponent(
                  titulo
                )}`;
                if (target.src !== placeholderUrl) {
                  target.srcset = placeholderUrl;
                  target.src = placeholderUrl;
                }
              }}
              priority={false} // Set to true for above-the-fold images if applicable, false is default
            />
          </Link>
        </div>
        {/* Product Title */}
        <h3 className="mb-1 line-clamp-2 text-center text-sm font-semibold text-zinc-800 group-hover:text-blue-700">
          {titulo}
        </h3>
        <p className="mb-4 line-clamp-3 text-justify text-sm text-zinc-600">
          {" "}
          {/* Changed to text-justify, adjusted margin */}
          {shortDescription}
        </p>
      </div>
      {/* "Ver Producto" Button - Positioned to overlap the bottom border */}
      {/* This div is outside the main content padding flow to allow precise absolute positioning */}
      <div className="relative z-10 mt-auto px-4 pb-4">
        {" "}
        {/* Added px-4 pb-4 for consistent padding around button */}
        <div className="absolute bottom-[-18px] left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 transform sm:w-auto">
          {/* w-[calc(100%-2rem)] makes button responsive to card padding on small screens, sm:w-auto for larger button */}
          <Button
            asChild
            className="w-full rounded-full bg-blue-700 px-6 py-2.5 text-sm font-medium text-white shadow-md transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:w-auto"
          >
            <Link
              href={productUrl}
              onClick={(e) => e.stopPropagation()}
              className="block w-full text-center sm:w-auto"
            >
              Ver Producto
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
