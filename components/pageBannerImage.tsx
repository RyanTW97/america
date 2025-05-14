import Image from "next/image";
import { cn } from "@/lib/utils";

interface PageBannerImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

const PageBannerImage: React.FC<PageBannerImageProps> = ({
  src,
  alt,
  className,
  priority = false,
}) => {
  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        width={1440}
        height={540}
        priority={priority}
        sizes="100vw"
        className="w-full object-cover h-[300px]  md:h-[450px] lg:h-[540px] "
      />
    </div>
  );
};

export default PageBannerImage;
