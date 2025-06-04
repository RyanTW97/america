// app/nuestros-productos/[slug]/components/ProductPrimaryInfo.tsx
// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Info, ChevronLeft, ChevronRight } from "lucide-react";
import {
  ProductAttributes,
  StrapiMediaObject,
  StrapiRichTextBlock,
} from "@/app/types/productPage";

// Tipos para las opciones de color y presentación
export type ColorOptionData = ProductAttributes["colores"] extends (infer U)[]
  ? U
  : never;
export type PresentationOptionData =
  ProductAttributes["presentacion"] extends (infer U)[] ? U : never;

interface ProductPrimaryInfoProps {
  titulo: string;
  selloCalidad?: { data: StrapiMediaObject[] | StrapiMediaObject | null };
  descripcion: StrapiRichTextBlock[];
  colores?: ColorOptionData[];
  presentaciones?: PresentationOptionData[];

  selectedPresentation: string | null;
  onPresentationSelect: (presentation: string) => void;
  selectedColor: ColorOptionData | null;
  onColorSelect: (color: ColorOptionData) => void;
}

const RichTextRenderer = ({ blocks }: { blocks: StrapiRichTextBlock[] }) => {
  if (!blocks || blocks.length === 0) {
    return <p className="text-zinc-600">Descripción no disponible.</p>;
  }
  return (
    <div className="prose prose-sm max-w-none text-zinc-700 text-justify">
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p key={index} className="mb-3 last:mb-0">
              {block.children.map((child, childIndex) => {
                if (child.type === "text") {
                  let content: React.ReactNode = child.text;
                  if (child.bold) content = <strong>{content}</strong>;
                  if (child.italic) content = <em>{content}</em>;
                  return <span key={childIndex}>{content}</span>;
                }
                return null;
              })}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
};

const APPROX_ITEM_WIDTH_WITH_GAP = 100;

const ProductPrimaryInfo = ({
  titulo,
  selloCalidad,
  descripcion,
  colores = [],
  presentaciones,
  selectedPresentation,
  onPresentationSelect,
  selectedColor,
  onColorSelect,
}: ProductPrimaryInfoProps) => {
  const sello = selloCalidad?.data
    ? Array.isArray(selloCalidad.data)
      ? selloCalidad.data[0]
      : selloCalidad.data
    : null;

  const validPresentations = Array.isArray(presentaciones)
    ? presentaciones.filter(
        (p) => p.presentacion && p.presentacion.trim() !== ""
      )
    : [];

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  const updateScrollButtonsState = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollPrev(scrollLeft > 5);
      setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 5);
      setShowScrollButtons(scrollWidth > clientWidth + 5);
    }
  };

  useEffect(() => {
    updateScrollButtonsState();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtonsState);
      window.addEventListener("resize", updateScrollButtonsState);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", updateScrollButtonsState);
      }
      window.removeEventListener("resize", updateScrollButtonsState);
    };
  }, [colores]);

  const handleScroll = (direction: "prev" | "next") => {
    if (scrollContainerRef.current) {
      const firstItem = scrollContainerRef.current.firstChild as HTMLElement;
      let scrollAmount = APPROX_ITEM_WIDTH_WITH_GAP;

      if (firstItem) {
        const itemStyle = window.getComputedStyle(firstItem);
        const itemWidth = firstItem.offsetWidth;
        const gapValue =
          parseFloat(itemStyle.marginRight) || // Considera el gap si está como margen
          parseFloat(window.getComputedStyle(scrollContainerRef.current).gap) || // Intenta leer la propiedad gap
          12; // Fallback para gap (ej: gap-3)
        scrollAmount = itemWidth + gapValue;
      }

      const currentScrollLeft = scrollContainerRef.current.scrollLeft;
      const newScrollLeft =
        direction === "prev"
          ? currentScrollLeft - scrollAmount
          : currentScrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl text-center tracking-widest font-bold text-blue-700 sm:text-4xl">
        {titulo}
      </h1>

      {sello && sello.attributes.url && (
        <div className="mx-auto my-4 flex w-fit justify-center">
          <Image
            src={sello.attributes.url}
            alt={
              sello.attributes.alternativeText ||
              sello.attributes.name ||
              "Sello de Calidad"
            }
            width={143}
            height={191}
            className="object-contain"
          />
        </div>
      )}

      <RichTextRenderer blocks={descripcion} />

      {/* ------ Sección de Colores con Carrusel de Scroll ------ */}
      {colores && colores.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-md font-semibold text-blue-700">
            Colores de Línea:
          </h3>
          {/* Removido el px-20 que estaba aquí para pruebas */}
          <div className="relative flex items-center">
            {showScrollButtons && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleScroll("prev")}
                disabled={!canScrollPrev}
                className={cn(
                  "absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full shadow-md bg-white/80 hover:bg-white",
                  "sm:-left-4",
                  !canScrollPrev && "opacity-50 cursor-not-allowed"
                )}
                aria-label="Color anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}

            <div className="flex-grow overflow-hidden mx-1">
              <div
                ref={scrollContainerRef}
                className="flex flex-nowrap items-start justify-start gap-3 sm:gap-4 py-1 overflow-x-auto scrollbar-hide"
                style={{ scrollBehavior: "smooth" }}
              >
                {colores.map((color) => {
                  const isSelected = selectedColor?.id === color.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => onColorSelect(color)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 p-1.5 rounded-lg transition-all hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 w-20 sm:w-24 flex-shrink-0",
                        isSelected
                          ? "ring-2 ring-red-500 ring-offset-1 focus-visible:ring-red-500"
                          : "focus-visible:ring-blue-500"
                      )}
                      title={color.nombreColor}
                      aria-pressed={isSelected}
                    >
                      <div
                        className="h-10 w-10 rounded-full border-2 shadow-sm sm:h-12 sm:w-12"
                        style={{
                          backgroundColor: color.codigoRGB?.trim() || "#E0E0E0",
                          borderColor: isSelected
                            ? "#EF4444"
                            : color.codigoRGB?.trim().toLowerCase() ===
                              "#ffffff"
                            ? "#D1D5DB"
                            : "transparent",
                        }}
                      />
                      <span
                        className={cn(
                          "block text-center text-xs leading-tight", // Removido h-10 y overflow-hidden
                          // Puedes añadir un min-h-X si quieres asegurar un mínimo para dos líneas, ej: min-h-[2.5em]
                          // Opcionalmente, para controlar el alto total del botón, podrías añadir un padding vertical al botón padre.
                          isSelected
                            ? "font-semibold text-red-600"
                            : "text-zinc-600"
                        )}
                        // style={{ minHeight: '2.5em' }} // Alternativa para altura mínima si Tailwind no es suficiente
                      >
                        {color.nombreColor}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {showScrollButtons && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleScroll("next")}
                disabled={!canScrollNext}
                className={cn(
                  "absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full shadow-md bg-white/80 hover:bg-white",
                  "sm:-right-4",
                  !canScrollNext && "opacity-50 cursor-not-allowed"
                )}
                aria-label="Siguiente color"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* ------ Sección de Presentaciones ------ */}
      {validPresentations.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <h3 className="text-md font-semibold text-blue-700 shrink-0">
              Presentación:
            </h3>
            <div className="flex flex-wrap gap-2">
              {validPresentations.map((pres) => {
                const label = pres.presentacion.trim();
                const isSelected = selectedPresentation === label;
                return (
                  <Button
                    key={pres.id}
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => onPresentationSelect(label)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm sm:px-4 sm:py-2",
                      isSelected
                        ? "bg-red-600 text-white hover:bg-red-700 border-red-600"
                        : "border-zinc-300 text-zinc-700 hover:bg-zinc-100 hover:border-zinc-400"
                    )}
                  >
                    {label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ------ Nota Informativa ------ */}
      <div className="mt-6 flex items-start gap-2 rounded-xl shadow-md border border-zinc-800 bg-zinc-200 p-3">
        <Info className="h-5 w-5 shrink-0 text-zinc-500 mt-0.5" />
        <p className="text-xs text-zinc-600">
          <span className="font-bold">Nota:</span> El color real puede variar de
          la representación en pantalla. Para confirmar la selección de color,
          por favor ver un chip físico de color, una carta de color o nuestra
          muestra pintada.
        </p>
      </div>
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default ProductPrimaryInfo;
