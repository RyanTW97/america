"use client";

import Image from "next/image";
import { Separator } from "./ui/separator";

interface ProductCardProps {
  title: string;
}

const ProductCard = ({ title }: ProductCardProps) => {
  return (
    <div className="border hover:border-blue-800 rounded-2xl shadow-md p-4 w-full md:w-[180px] h-[240px] flex flex-col items-center justify-between bg-white">
      {/* Contenedor de imagen con tamaño fijo */}
      <div className="h-full w-full flex items-center justify-center overflow-hidden mb-2">
        <Image
          src="/Acrylatex.png"
          alt={title}
          width={613} // tamaño real
          height={577} // tamaño real
          className="object-contain max-h-full"
        />
      </div>
      <Separator />
      {/* Título */}
      <h3 className="text-center text-sm font-bold text-blue-900 leading-tight">
        {title}
      </h3>
    </div>
  );
};

export default ProductCard;
