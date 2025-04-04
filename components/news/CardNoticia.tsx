"use client";

import Image from "next/image";
import Link from "next/link";

interface CardNoticiaProps {
  titulo: string;
  imagen: string;
  descripcion?: string;
}

export default function CardNoticia({
  titulo,
  imagen,
  descripcion = "Aquí va una pequeña descripción de la noticia que se vaya a publicar...",
}: CardNoticiaProps) {
  return (
    <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-md bg-white">
      {/* Imagen con título encima */}
      <div className="relative h-72">
        <Image
          src={imagen}
          alt={titulo}
          fill
          className="object-cover"
          sizes="100%"
        />

        {/* Overlay con fondo azul translúcido */}
        <div className="absolute bottom-0 w-full bg-blue-900 bg-opacity-80 text-white text-center px-4 h-20 flex items-center justify-center">
          <h3 className="text-sm md:text-base font-semibold">{titulo}</h3>
        </div>
      </div>

      {/* Descripción + leer más */}
      <div className="px-4 pt-4 pb-5 text-sm text-gray-700 leading-snug">
        <p>
          {descripcion}
          <Link
            href="#"
            className="text-blue-600 font-medium hover:underline transition ml-1"
          >
            leer más
          </Link>
        </p>
      </div>
    </div>
  );
}
