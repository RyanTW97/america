import Image from "next/image";

interface CardProductoProps {
  titulo: string;
  imagen: string;
}

export default function CardProducto({ titulo, imagen }: CardProductoProps) {
  return (
    <div className="relative w-full h-48 md:h-56 lg:h-64 rounded-xl overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-105 shadow-md">
      <Image
        src={imagen}
        alt={titulo}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h3 className="text-white text-lg md:text-xl lg:text-2xl font-bold text-center uppercase tracking-wide">
          {titulo}
        </h3>
      </div>
    </div>
  );
}
