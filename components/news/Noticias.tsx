"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import CardNoticia from "./CardNoticia";
import { useEffect, useRef, useState } from "react";
import Titulo from "../generales/titulo";

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

export default function NoticiasCarousel() {
  const [api, setApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <Titulo azul="ÚLTIMAS" blanco="NOTICIAS" />

      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="mt-10"
      >
        <CarouselContent className="-ml-4">
          {noticias.map((noticia, index) => (
            <CarouselItem
              key={index}
              className="pl-4 basis-full sm:basis-1/2 md:basis-1/3"
            >
              <CardNoticia
                titulo={noticia.titulo}
                imagen={noticia.imagen}
                index={index}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
