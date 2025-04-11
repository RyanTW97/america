"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductCard = () => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="border hover:border-blue-600 rounded-lg p-4 pb-14 relative shadow-sm hover:shadow-md transition flex flex-col h-full">
      {/* Botón corazón */}
      <button
        className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
        onClick={() => setLiked(!liked)}
      >
        <Heart
          className={`w-5 h-5 ${
            liked ? "text-red-500 fill-red-500" : "text-zinc-400"
          }`}
        />
      </button>

      {/* Imagen */}
      <div className="flex justify-center mb-3">
        <Image
          src="/Acrylatex.png"
          alt="Producto"
          width={613}
          height={577}
          className="object-contain"
        />
      </div>

      {/* Título y descripción */}
      <h3 className="text-base font-bold mb-1 text-center">
        Lorem Ipsum Producto
      </h3>
      <p className="text-sm text-zinc-700">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.{" "}
        <span className="text-blue-600 underline cursor-pointer">ver más.</span>
      </p>

      {/* Botón fijo abajo */}
      <div className="absolute bottom-[-18px] left-1/2 transform -translate-x-1/2">
        <Button className="bg-blue-800 hover:bg-blue-900 rounded-full px-6 shadow">
          Ver Producto
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
