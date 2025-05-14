"use client";

import Image from "next/image";
import CardNoticia from "@/components/news/CardNoticia";

const noticias = [
  {
    titulo: "Evento de los 35 años de Pinturas América",
    imagen: "/noticia-1.png",
  },
  {
    titulo:
      "Trabajo Colaborativo en el Proyecto Pinturas Libres de Plomo en Latinoamérica",
    imagen: "/noticia-2.png",
  },
  {
    titulo: "Reconocimiento de la Cámara de Comercio en el 2008",
    imagen: "/noticia-3.png",
  },
  {
    titulo: "Reconocimiento de la Cámara de Comercio por los 25 años",
    imagen: "/noticia-4.png",
  },
  {
    titulo:
      "Mención Honorífica de Empresa Segura Libre de Violencia y Discriminación contra la Mujer",
    imagen: "/noticia-5.png",
  },
];

export default function NoticiasPage() {
  return (
    <div>
      {/* Imagen de encabezado */}
      <div className="relative w-full aspect-[16/5] sm:aspect-[16/6] md:aspect-[16/4] lg:aspect-[16/3]">
        <Image
          src="/noticias.png"
          alt="Noticias"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Grid de noticias */}
      <section className="px-4 py-10 max-w-7xl mx-auto">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {noticias.map((noticia, index) => (
            <CardNoticia
              key={index}
              titulo={noticia.titulo}
              imagen={noticia.imagen}
              index={index} // Nuevo prop
            />
          ))}
        </div>
      </section>
    </div>
  );
}
