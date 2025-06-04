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
        "relative w-full overflow-hidden h-[150px] md:h-[200px] lg:h-[300px]",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover object-top"
      />
    </div>
  );
};

export default PageBannerImage;
