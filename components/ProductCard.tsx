"use client";

import Image from "next/image";
import { Separator } from "./ui/separator"; // Asumiendo que este path es correcto

interface ProductCardProps {
  title?: string; // Hacemos title opcional para manejar casos donde pueda faltar
  imageUrl?: string; // Opcional: Si quieres hacer la imagen dinámica en el futuro
}

const ProductCard = ({ title, imageUrl }: ProductCardProps) => {
  // Proporciona un texto alternativo de respaldo si el título no está disponible o está vacío.
  const altText =
    title && typeof title === "string" && title.trim() !== ""
      ? title.trim()
      : "Imagen de producto destacado";

  // Proporciona un título visible de respaldo.
  const displayTitle =
    title && typeof title === "string" && title.trim() !== ""
      ? title.trim()
      : "Producto Destacado";

  // Usa la imageUrl proporcionada, o la imagen estática como fallback.
  const imageSource = imageUrl || "/Acrylatex.png";

  return (
    <div className="border hover:border-blue-800 rounded-2xl shadow-md p-4 w-full md:w-[180px] h-[240px] flex flex-col items-center justify-between bg-white">
      {/* Contenedor de imagen con tamaño fijo */}
      <div className="h-full w-full flex items-center justify-center overflow-hidden mb-2">
        <Image
          src={imageSource} // Ahora puede ser dinámico o estático
          alt={altText} // altText siempre será una cadena válida
          width={613} // Tamaño intrínseco de tu imagen de fallback o un tamaño representativo
          height={577} // Tamaño intrínseco de tu imagen de fallback
          className="object-contain max-h-full w-auto" // w-auto para mantener aspect ratio con max-h-full
          priority={false} // Considera `true` para imágenes LCP, pero usualmente no en carruseles
        />
      </div>
      <Separator />
      {/* Título */}
      <h3 className="text-center text-sm font-bold text-blue-900 leading-tight">
        {displayTitle}
      </h3>
    </div>
  );
};

export default ProductCard;
