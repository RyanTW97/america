"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface CardNoticiaProps {
  titulo: string;
  imagen: string;
  descripcion?: string;
  index: number;
}

export default function CardNoticia({
  titulo,
  imagen,
  descripcion = "Aquí va una pequeña descripción de la noticia que se vaya a publicar...",
  index,
}: CardNoticiaProps) {
  return (
    // Motion exterior: animación de entrada (fade + slide)
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay: index * 0.15, // solo afecta entrada
      }}
    >
      {/* Motion interior: hover instantáneo (zoom + sombra) */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-md bg-white transition-shadow hover:shadow-lg"
      >
        <div className="relative h-72 group">
          <Image
            src={imagen}
            alt={titulo}
            fill
            className="object-cover"
            sizes="100%"
          />

          {/* Overlay animado al hover */}
          <motion.div
            initial={{ opacity: 0.9, y: 0 }}
            whileHover={{ opacity: 1, y: -5 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute bottom-0 w-full bg-blue-900 bg-opacity-80 text-white text-center px-4 h-20 flex items-center justify-center"
          >
            <h3 className="text-sm md:text-base font-semibold">{titulo}</h3>
          </motion.div>
        </div>

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
      </motion.div>
    </motion.div>
  );
}
