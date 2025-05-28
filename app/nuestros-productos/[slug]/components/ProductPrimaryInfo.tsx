// app/nuestros-productos/[slug]/components/ProductPrimaryInfo.tsx
// @ts-nocheck
"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react"; // Icono para la nota
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

  // Estado y manejadores para selecciones
  selectedPresentation: string | null;
  onPresentationSelect: (presentation: string) => void;
  selectedColor: ColorOptionData | null; // Ahora el color seleccionado puede ser el objeto completo
  onColorSelect: (color: ColorOptionData) => void;
}

// Componente para renderizar Rich Text (simplificado)
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

const ProductPrimaryInfo = ({
  titulo,
  selloCalidad,
  descripcion,
  colores,
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl text-center tracking-widest font-bold text-blue-700 sm:text-4xl">
        {titulo}
      </h1>

      {sello && sello.attributes.url && (
        <div className="mx-auto my-4 flex w-fit justify-center">
          {" "}
          {/* Contenedor para centrar la imagen del sello */}
          <Image
            src={sello.attributes.url}
            alt={
              sello.attributes.alternativeText ||
              sello.attributes.name ||
              "Sello de Calidad"
            }
            width={143} // Ajusta el tamaño del sello según el diseño
            height={191} // Ajusta el tamaño del sello según el diseño
            className="object-contain"
          />
        </div>
      )}

      <RichTextRenderer blocks={descripcion} />

      {colores && colores.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-3">
            {colores && colores.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-md font-semibold text-blue-700">
                  Colores de Línea:
                </h3>
                <div className="flex flex-wrap gap-3">
                  {colores.map((color) => {
                    const isSelected = selectedColor?.id === color.id;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => onColorSelect(color)}
                        className={cn(
                          "flex flex-col items-center gap-1 p-1 rounded-md transition-all hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                          isSelected
                            ? "ring-2 ring-red-500 ring-offset-1  focus-visible:ring-red-500" // Estilo seleccionado con rojo
                            : "focus-visible:ring-blue-500" // Estilo de foco para no seleccionados
                        )}
                        title={color.nombreColor}
                        aria-pressed={isSelected}
                      >
                        <div
                          className="h-10 w-10 rounded-full border-2 shadow-sm sm:h-12 sm:w-12"
                          style={{
                            backgroundColor:
                              color.codigoRGB.trim() || "#E0E0E0", // Fallback a gris si el RGB es inválido
                            borderColor: isSelected
                              ? "#EF4444" // Rojo-500 para el borde del swatch seleccionado
                              : color.codigoRGB.trim().toLowerCase() ===
                                "#ffffff"
                              ? "#D1D5DB" // Borde gris para swatch blanco no seleccionado
                              : "transparent", // Sin borde visible para otros no seleccionados
                          }}
                        />
                        <span
                          className={cn(
                            "block max-w-[60px] truncate text-center text-xs sm:max-w-[70px]",
                            isSelected
                              ? "font-semibold text-red-600" // Texto rojo para seleccionado
                              : "text-zinc-600"
                          )}
                        >
                          {color.nombreColor}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {presentaciones && presentaciones.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
            {" "}
            {/* Para título y botones en línea */}
            <h3 className="text-md font-semibold text-blue-700 shrink-0">
              Presentación:
            </h3>
            <div className="flex flex-wrap gap-2">
              {presentaciones.map((pres) => (
                <Button
                  key={pres.id}
                  variant={
                    selectedPresentation === pres.presentacion
                      ? "default"
                      : "outline"
                  }
                  onClick={() => onPresentationSelect(pres.presentacion)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm sm:px-4 sm:py-2", // Ajustado padding
                    selectedPresentation === pres.presentacion
                      ? "bg-red-600 text-white hover:bg-red-700 border-red-600"
                      : "border-zinc-300 text-zinc-700 hover:bg-zinc-100 hover:border-zinc-400"
                  )}
                >
                  {pres.presentacion}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-start gap-2 rounded-xl shadow-md border border-zinc-800 bg-zinc-200 p-3">
        <Info className="h-5 w-5 shrink-0 text-zinc-500 mt-0.5" />
        <p className="text-xs text-zinc-600">
          <span className="font-bold">Nota:</span> El color real puede variar de
          la representación en pantalla. Para confirmar la selección de color ,
          por favor ver un chip físico de color, una carta de color o nuestra
          muestra pintada.
        </p>
      </div>
    </div>
  );
};

export default ProductPrimaryInfo;
