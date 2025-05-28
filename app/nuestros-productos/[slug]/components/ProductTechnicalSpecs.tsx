// app/nuestros-productos/[slug]/components/ProductTechnicalSpecs.tsx
// @ts-nocheck
"use client";

import {
  PaintBucket,
  Sun,
  Clock,
  Home,
  Palette,
  Icon as LucideIcon,
} from "lucide-react";
import { PiCertificateBold } from "react-icons/pi";
import { StrapiRichTextBlock } from "@/app/types/productPage";
import React from "react";

interface ProductTechnicalSpecsProps {
  tipoPintura?: string | null;
  brillo?: string | null;
  tiempoSecado?: string | null;
  usoRecomendado?: string | null;
  varianteColores?: StrapiRichTextBlock[] | null;
  norma?: string | null;
}

interface SpecItemProps {
  icon: LucideIcon | React.ElementType<any>;
  label: string;
  value?: string | React.ReactNode | null;
  isReactIcon?: boolean; // Flag para identificar si es un ícono de react-icons
}

const SpecItem: React.FC<SpecItemProps> = ({
  icon: IconComponent,
  label,
  value,
  isReactIcon = false, // Por defecto no es un react-icon
}) => {
  if (!value) return null;

  // Ajuste de clases para los íconos
  const iconSizeClass = "h-7 w-7 sm:h-8 sm:w-8"; // Un poco más pequeño para mejor proporción en el círculo

  return (
    <div
      className="flex items-center gap-3 sm:gap-4 rounded-xl bg-white p-3 sm:p-4 shadow-lg 
                   transition-all duration-200 ease-in-out hover:shadow-xl hover:scale-[1.03]"
    >
      {" "}
      {/* Efecto hover */}
      {/* Círculo del Icono con borde */}
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-md 
                   border border-zinc-400 sm:h-16 sm:w-16"
      >
        {isReactIcon ? (
          // Los íconos de react-icons se controlan mejor con 'size' o font-size via className
          <IconComponent className={`${iconSizeClass} text-black`} />
        ) : (
          // Los íconos de Lucide aceptan strokeWidth
          <IconComponent
            className={`${iconSizeClass} text-black`}
            strokeWidth={1.5}
          />
        )}
      </div>
      {/* Contenido de Texto */}
      <div className="flex-grow">
        <h4 className="text-xs font-semibold text-blue-700 sm:text-sm">
          {" "}
          {/* Texto un poco más pequeño */}
          {label}:
        </h4>
        {typeof value === "string" ? (
          <p className="text-xs text-zinc-700 sm:text-sm">{value}</p>
        ) : (
          <div className="text-xs text-zinc-700 sm:text-sm">{value}</div>
        )}
      </div>
    </div>
  );
};

const RichTextRendererMini = ({
  blocks,
}: {
  blocks: StrapiRichTextBlock[];
}) => {
  if (!blocks || blocks.length === 0) return null;
  return (
    <div className="prose prose-sm max-w-none">
      {" "}
      {/* prose-sm ya define tamaños de texto base */}
      {blocks.map((block, index) =>
        block.type === "paragraph" ? (
          <p key={index} className="mb-1 last:mb-0">
            {block.children.map((child, childIndex) =>
              child.type === "text" ? (
                <span key={childIndex}>
                  {child.bold ? (
                    <strong>{child.text}</strong>
                  ) : child.italic ? (
                    <em>{child.text}</em>
                  ) : (
                    child.text
                  )}
                </span>
              ) : null
            )}
          </p>
        ) : null
      )}
    </div>
  );
};

const ProductTechnicalSpecs = ({
  tipoPintura,
  brillo,
  tiempoSecado,
  usoRecomendado,
  varianteColores,
  norma,
}: ProductTechnicalSpecsProps) => {
  const specsData = [
    { icon: PaintBucket, label: "Tipo de pintura", value: tipoPintura },
    { icon: Sun, label: "Brillo", value: brillo },
    { icon: Clock, label: "Tiempo secado", value: tiempoSecado },
    { icon: Home, label: "Uso recomendado", value: usoRecomendado },
    {
      icon: Palette,
      label: "Colores",
      value:
        varianteColores && varianteColores.length > 0 ? (
          <RichTextRendererMini blocks={varianteColores} />
        ) : null,
    },
    {
      icon: PiCertificateBold,
      label: "Cumple Norma",
      value: norma,
      isReactIcon: true,
    }, // Marcar como react-icon
  ];

  const validSpecs = specsData.filter((spec) => spec.value);

  if (validSpecs.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg  p-4  sm:p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:gap-5">
        {" "}
        {/* Ajustado gap */}
        {validSpecs.map((spec) => (
          <SpecItem
            key={spec.label}
            icon={spec.icon}
            label={spec.label}
            value={spec.value}
            isReactIcon={spec.isReactIcon} // Pasar el flag
          />
        ))}
      </div>
    </div>
  );
};

export default ProductTechnicalSpecs;
