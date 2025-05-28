// app/nuestros-productos/[slug]/components/ProductDetailHeader.tsx
"use client"; // Necesario para Framer Motion y hooks si los usaras

import Image from "next/image";
import { motion } from "framer-motion"; // Importar motion

interface ProductDetailHeaderProps {
  lineaTitle: string;
  lineaImageUrl?: string | null;
  lineaImageAlt?: string | null;
}

const ProductDetailHeader = ({
  lineaTitle,
  lineaImageUrl,
  lineaImageAlt,
}: ProductDetailHeaderProps) => {
  const altText = lineaImageAlt || `Banner de la línea ${lineaTitle}`;

  const intrinsicImageWidth = 1440;
  const intrinsicImageHeight = 540;

  // Variantes para la animación de Framer Motion
  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Retraso entre la animación de los hijos
        delayChildren: 0.3, // Retraso antes de que los hijos comiencen a animarse
        duration: 0.5,
      },
    },
  };

  const textItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <header className="relative w-full">
      {lineaImageUrl ? (
        <div className="relative w-full">
          <Image
            src={lineaImageUrl}
            alt={altText}
            width={intrinsicImageWidth}
            height={intrinsicImageHeight}
            layout="responsive"
            className="block h-auto w-full"
            priority
          />
          <div
            className="absolute inset-0 left-[5%] flex w-[45%] items-center 
                       md:left-[7%] md:w-[40%] lg:w-[35%]"
          >
            <motion.div
              className="w-full p-2 sm:p-4" // Padding dentro del bloque de texto
              variants={textContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.span
                variants={textItemVariants}
                className="block text-lg font-medium text-white text-shadow-sm 
                           sm:text-xl md:text-2xl lg:text-3xl"
                // Quitado text-center para que se alinee a la izquierda por defecto dentro de su contenedor
              >
                Línea
              </motion.span>
              <motion.h1
                variants={textItemVariants}
                className="mt-0 sm:mt-1 text-3xl font-bold leading-tight text-white text-shadow-md 
                           sm:text-4xl md:text-5xl lg:text-6xl"
                // Quitado text-center
              >
                {lineaTitle}
              </motion.h1>
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="flex h-48 w-full items-center justify-center bg-zinc-200 sm:h-60 md:h-72">
          <p className="text-zinc-500">Banner de línea no disponible</p>
        </div>
      )}
    </header>
  );
};

export default ProductDetailHeader;
