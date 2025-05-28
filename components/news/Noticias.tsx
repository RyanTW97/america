// @ts-nocheck
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
import { useEffect, useState } from "react";
import Titulo from "../generales/titulo";
import Link from "next/link";

const API_URL =
  "https://servidor-tricolor-64a23aa2b643.herokuapp.com/api/noticias-americas?populate=*";

export default function NoticiasCarousel() {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const res = await fetch(API_URL);
        const json = await res.json();
        setNoticias(json.data);
      } catch (error) {
        console.error("Error al obtener las noticias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticias();
  }, []);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [api]);

  if (loading) {
    return (
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <Titulo azul="ÚLTIMAS" blanco="NOTICIAS" />
        <div className="text-center py-10">Cargando noticias...</div>
      </section>
    );
  }

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
          {noticias.map((noticia, index) => {
            const attrs = noticia.attributes;
            const imagen =
              attrs.imagenes?.data?.[1]?.attributes?.url ||
              "/noticia-placeholder.png";
            const titulo = attrs.Titulo;
            const resumen =
              attrs.parrafo1?.[0]?.children?.[0]?.text?.slice(0, 80) || "";
            const slug = attrs.slug || noticia.id;

            return (
              <CarouselItem
                key={noticia.id}
                className="pl-4 basis-full sm:basis-1/2 md:basis-1/3"
              >
                <Link
                  href={`/noticias/${slug}`}
                  className="block hover:shadow-lg transition-shadow h-full"
                  prefetch={false}
                >
                  <CardNoticia
                    titulo={titulo}
                    imagen={imagen}
                    descripcion={resumen}
                    index={index}
                  />
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
