// app/nuestros-productos/[slug]/components/ProductActions.tsx
// @ts-nocheck
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
  // Determinar si el botón de cotizar debe estar habilitado
  const canCotizar = !!selectedColorName && !!selectedPresentation;

  // Lógica para la nota que se muestra en la página
  let cotizarNota = "Por favor, seleccione color y presentación para cotizar.";
  if (canCotizar) {
    cotizarNota = `Ha seleccionado la presentación: ${selectedPresentation} y el color: ${selectedColorName}. ¡Listo para cotizar!`;
  } else if (selectedPresentation && !selectedColorName) {
    cotizarNota = `Ha seleccionado la presentación: ${selectedPresentation}. Por favor, seleccione un color.`;
  } else if (!selectedPresentation && selectedColorName) {
    cotizarNota = `Ha seleccionado el color: ${selectedColorName}. Por favor, seleccione una presentación.`;
  }

  // Construcción del mensaje específico para WhatsApp
  const buildWhatsappMessage = () => {
    let message = `¡Hola! Estoy interesado/a en solicitar una cotización para el producto: ${productTitle}.`;
    if (selectedPresentation) {
      message += `\nPresentación: ${selectedPresentation}.`;
    }
    if (selectedColorName) {
      message += `\nColor: ${selectedColorName}.`;
    }
    message += "\n\nAgradecería su ayuda con esto. ¡Gracias!";
    return encodeURIComponent(message.trim());
  };

  const handleCotizarClick = () => {
    if (!canCotizar) return; // No hacer nada si no se puede cotizar

    const mensajeWhatsapp = buildWhatsappMessage();
    const whatsappUrl = `https://wa.me/593987658326?text=${mensajeWhatsapp}`;

    if (typeof window !== "undefined") {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="space-y-6 rounded-lg p-4 sm:p-6">
      {/* Acción: Cotizar por WhatsApp */}
      <div>
        <div className="flex items-center gap-3 sm:gap-4">
          <span
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white sm:h-14 sm:w-14",
              canCotizar ? "bg-green-500" : "bg-zinc-400" // Cambia el color del ícono si está deshabilitado
            )}
          >
            <IoLogoWhatsapp size={28} className="sm:h-7 sm:w-7" />
          </span>
          <Button
            onClick={handleCotizarClick}
            disabled={!canCotizar}
            className={cn(
              "flex-grow rounded-md px-4 py-5 text-sm font-semibold uppercase text-white shadow-md sm:text-base",
              canCotizar
                ? "bg-green-500 hover:bg-green-600"
                : "bg-zinc-300 cursor-not-allowed opacity-70"
            )}
            aria-disabled={!canCotizar}
          >
            COTIZAR
          </Button>
        </div>
        <p className="mt-2 text-left text-xs text-zinc-500 sm:ml-16 md:ml-[calc(3.5rem+1rem)]">
          {cotizarNota}
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
          )}
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-800 text-white sm:h-14 sm:w-14">
            <GrDocumentPdf size={24} className="sm:h-6 sm:w-6" />
          </span>
          <Button
            asChild
            className="flex-grow rounded-md bg-blue-800 px-4 py-5 text-sm font-semibold uppercase text-white shadow-md hover:bg-blue-900 sm:text-base"
          >
            <span>DESCARGAR FICHA</span>
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
