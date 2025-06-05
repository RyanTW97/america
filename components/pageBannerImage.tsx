// components/pageBannerImage.tsx
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PageBannerImageProps {
  src: string;
  alt: string;
  className?: string; // clases adicionales para el div contenedor
  priority?: boolean;
}

const PageBannerImage: React.FC<PageBannerImageProps> = ({
  src,
  alt,
  className,
  priority,
}) => {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden h-[150px] md:h-[200px] lg:h-[300px]", // Estas alturas definen el "viewport" del banner
        className // Clases pasadas desde fuera para el div contenedor
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill // fill hace que la imagen ocupe el contenedor padre
        priority={priority}
        sizes="100vw" // Importante para <Image fill> para optimización
        className="object-cover object-center" // Cambiado de object-top a object-bottom
      />
    </div>
  );
};

export default PageBannerImage;
