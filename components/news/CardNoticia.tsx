// components/news/CardNoticia.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface CardNoticiaProps {
  titulo: string;
  imagen: string;
  imagenAlt: string; // Prop requerida para el texto alternativo
  descripcion: string;
  index: number;
}

export default function CardNoticia({
  titulo,
  imagen,
  imagenAlt, // Usar esta prop
  descripcion,
  index,
}: CardNoticiaProps) {
  const displayTitle = titulo || "Noticia";
  // Usar la prop imagenAlt, con fallback al título si imagenAlt está vacía, o un texto genérico.
  const altTextForImage = imagenAlt?.trim()
    ? imagenAlt
    : displayTitle !== "Noticia"
    ? `Imagen de ${displayTitle}`
    : "Imagen de la noticia";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay: index * 0.1,
      }}
      className="h-full"
    >
      <motion.div
        whileHover={{ scale: 1.03, y: -5 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="flex h-full w-full max-w-sm cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg"
      >
        <div className="relative h-48 w-full group sm:h-56">
          <Image
            src={imagen}
            alt={altTextForImage} // Usar la prop imagenAlt procesada
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={index < 4}
          />
          <div className="absolute bottom-0 w-full bg-blue-800 bg-opacity-85 p-3 text-center text-white transition-opacity duration-300 group-hover:bg-opacity-95">
            <h3 className="line-clamp-2 text-sm font-semibold leading-tight md:text-base">
              {displayTitle}
            </h3>
          </div>
        </div>
        <div className="flex flex-grow flex-col justify-between p-4">
          <p className="mb-3 line-clamp-3 text-xs leading-snug text-gray-600 sm:text-sm">
            {descripcion}
          </p>
          <span className="mt-auto self-start text-xs font-medium text-blue-600 hover:underline">
            Leer más...
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
