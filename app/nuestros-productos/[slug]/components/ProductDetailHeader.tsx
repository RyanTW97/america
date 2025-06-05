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

  // These are the intrinsic dimensions of your image.
  // They are used by Next.js to calculate the aspect ratio
  // and prevent layout shift, especially important for LCP elements.
  const intrinsicImageWidth = 1440;
  const intrinsicImageHeight = 250;

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
          {/*
            Updated next/image component:
            - Removed `layout="responsive"`.
            - `width` and `height` props define the aspect ratio.
            - `className="block h-auto w-full"` makes the image responsive.
            - Added `sizes` prop for optimization. It tells the browser
              how wide the image will be at different viewport sizes,
              helping it select the most appropriate image source from the srcset
              Next.js generates. "100vw" means the image will be 100% of the viewport width.
          */}
          <Image
            src={lineaImageUrl}
            alt={altText}
            width={intrinsicImageWidth}
            height={intrinsicImageHeight}
            className="block h-auto w-full" // Makes the image responsive, respecting aspect ratio
            priority // Good for LCP (Largest Contentful Paint) images
            sizes="100vw" // Crucial for performance with responsive images
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
              >
                Línea
              </motion.span>
              <motion.h1
                variants={textItemVariants}
                className="mt-0 sm:mt-1 text-3xl font-bold leading-tight text-white text-shadow-md 
                           sm:text-4xl md:text-5xl lg:text-6xl"
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
