import Image from "next/image";
import React from "react";

interface HeaderBannerProps {
  imageSrc?: string;
}

const HeaderBanner: React.FC<HeaderBannerProps> = ({
  imageSrc = "/nuestrosProductos.png",
}) => {
  return (
    <div className="relative w-full h-[150px] md:h-[200px] lg:h-[300px]">
      <Image
        src={imageSrc}
        alt="Banner"
        layout="fill"
        objectFit="cover"
        priority
      />
      <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center">
        <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-inter font-extrabold uppercase leading-[1.2] tracking-wide">
          <span className="block">Nuestros</span>
          <span className="block mt-2">Productos</span>
        </h1>
      </div>
    </div>
  );
};

export default HeaderBanner;
