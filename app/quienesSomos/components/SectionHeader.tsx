// app/QuienesSomos/components/SectionHeader.tsx
import React from "react";
import { cn } from "@/lib/utils"; // Importar utilidad cn

interface SectionHeaderProps {
  /** El texto que se mostrará en color azul */
  blueText: string;
  /** El texto que se mostrará en color rojo */
  redText: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ blueText, redText }) => {
  return (
    <h2
      className={cn(
        "text-4xl md:text-5xl lg:text-6xl", // Tamaño
        "font-extrabold", // Grosor
        "text-center", // Alineación
        "mb-6 md:mb-8", // Margen inferior
        "tracking-widest",
        "font-archivo"
      )}
    >
      {/* Parte azul y roja con colores fijos y espacio entre ellas */}
      <span className="text-blue-900">{blueText}</span>{" "}
      {/* Espacio importante */}
      <span className="text-red-600">{redText}</span>
    </h2>
  );
};

export default SectionHeader;
