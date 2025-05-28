// app/nuestros-productos/[slug]/components/ProductActions.tsx
"use client";

import { Button } from "@/components/ui/button";
import { IoLogoWhatsapp } from "react-icons/io5";
import { GrDocumentPdf } from "react-icons/gr";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProductActionsProps {
  productTitle: string;
  selectedPresentation: string | null;
  selectedColorName: string | null;
  fichaTecnicaUrl?: string | null;
}

const ProductActions = ({
  productTitle,
  selectedPresentation,
  selectedColorName,
  fichaTecnicaUrl,
}: ProductActionsProps) => {
  const handleCotizarClick = () => {
    const producto = encodeURIComponent(productTitle);
    const presentacionText = selectedPresentation
      ? encodeURIComponent(selectedPresentation)
      : "No especificada";
    const colorText = selectedColorName
      ? encodeURIComponent(selectedColorName)
      : "No especificado";

    let mensaje = `¡Hola! Quisiera cotizar el producto: ${producto}.`;
    if (selectedPresentation) {
      mensaje += ` Presentación: ${presentacionText}.`;
    }
    if (selectedColorName) {
      mensaje += ` Color: ${colorText}.`;
    }

    // REEMPLAZA 'TUNUMERODEWHATSAPP' con tu número de WhatsApp real (ej: 593991234567)
    const whatsappUrl = `https://wa.me/TUNUMERODEWHATSAPP?text=${encodeURIComponent(
      mensaje.trim()
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6 rounded-lg  p-4  sm:p-6">
      {/* Acción: Cotizar por WhatsApp */}
      <div>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500 text-white sm:h-14 sm:w-14">
            <IoLogoWhatsapp size={28} className="sm:h-7 sm:w-7" />
          </span>
          <Button
            onClick={handleCotizarClick}
            className="flex-grow rounded-md bg-green-500 px-4 py-5 text-sm font-semibold uppercase text-white shadow-md hover:bg-green-600 sm:text-base"
            // Ajusta el padding (py-5) y tamaño de texto para que se vea como el Figma
          >
            COTIZAR
          </Button>
        </div>
        <p className="mt-2 text-left text-xs text-zinc-500 sm:ml-16 md:ml-[calc(3.5rem+1rem)]">
          {" "}
          {/* Alinear con el botón */}
          Nota: Seleccione las opciones que desea cotizar.
        </p>
      </div>

      {/* Acción: Descargar Ficha Técnica */}
      {fichaTecnicaUrl ? (
        <Link
          href={fichaTecnicaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group flex w-full items-center gap-3 sm:gap-4 rounded-lg text-left"
            // Quitado el fondo y borde del Link, se aplicarán al Button interno si es necesario,
            // o se puede estilizar el Link como un bloque clickeable que contiene el ícono y el botón.
            // Por ahora, el Button interno llevará el estilo principal.
          )}
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-800 text-white sm:h-14 sm:w-14">
            <GrDocumentPdf size={24} className="sm:h-6 sm:w-6" />
          </span>
          <Button
            asChild // Para que el Link controle la navegación
            className="flex-grow rounded-md bg-blue-800 px-4 py-5 text-sm font-semibold uppercase text-white shadow-md hover:bg-blue-900 sm:text-base"
          >
            <span>
              {" "}
              {/* Span necesario si Button es asChild de Link y quieres contenido dentro */}
              DESCARGAR FICHA
            </span>
          </Button>
        </Link>
      ) : (
        <div
          className={cn(
            "group flex w-full cursor-not-allowed items-center gap-3 sm:gap-4 rounded-lg text-left opacity-60"
          )}
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-400 text-white sm:h-14 sm:w-14">
            <GrDocumentPdf size={24} className="sm:h-6 sm:w-6" />
          </span>
          <Button
            disabled
            className="flex-grow rounded-md bg-zinc-300 px-4 py-5 text-sm font-semibold uppercase text-zinc-500 shadow-md sm:text-base"
          >
            DESCARGAR FICHA
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductActions;
