// app/QuienesSomos/components/PageBannerImage.tsx
import Image from "next/image";
import { cn } from "@/lib/utils"; // Importamos la utilidad de shadcn/ui si la usas

interface PageBannerImageProps {
  /**
   * Ruta de la imagen (ej: '/images/quienes-somos-banner.jpg').
   * Asegúrate de que la imagen esté en la carpeta /public.
   */
  src: string;
  /**
   * Texto alternativo descriptivo para la imagen.
   */
  alt: string;
  /**
   * Clases CSS adicionales para el contenedor de la imagen.
   */
  className?: string;
  /**
   * Establecer en true si la imagen es crítica para el LCP (Largest Contentful Paint).
   * Recomendado para imágenes 'above the fold'.
   */
  priority?: boolean;
}

const PageBannerImage: React.FC<PageBannerImageProps> = ({
  src,
  alt,
  className,
  priority = false, // Por defecto false, pero para este banner probablemente queramos true
}) => {
  // Dimensiones originales proporcionadas
  const originalWidth = 1440;
  const originalHeight = 540;

  return (
    // Usamos un div relativo como contenedor por si necesitamos superponer elementos o
    // controlar el layout más específicamente. w-full asegura que tome el ancho del padre.
    <div className={cn("relative w-full overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        width={originalWidth} // Dimensión original para optimización y aspect-ratio
        height={originalHeight} // Dimensión original para optimización y aspect-ratio
        priority={priority} // Ayuda a Next.js a priorizar la carga si es LCP
        sizes="100vw" // Indica al navegador el tamaño de la imagen en diferentes viewports
        // 100vw es un buen punto de partida si es full-width responsive
        className="w-full h-auto object-cover" // Tailwind: full width, altura automática, cover para llenar
      />
    </div>
  );
};

export default PageBannerImage;
