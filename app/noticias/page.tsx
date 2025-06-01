// app/noticias/page.tsx

import Image from "next/image";
import Link from "next/link";
import {
  Noticia,
  StrapiNoticiasResponse,
  StrapiRichTextParagraph,
} from "@/app/types/noticias";
import NoticiasList from "@/components/news/NoticiasList"; // <— importamos el componente cliente que usará framer-motion
import { Separator } from "@/components/ui/separator";

// 1. Asegúrate de que en tu .env.local TENGAS: STRAPI_API_URL=https://servidor-tricolor-64a23aa2b643.herokuapp.com
//    (sin "/api" al final).
const STRAPI_BASE_URL =
  process.env.STRAPI_API_URL ||
  "https://servidor-tricolor-64a23aa2b643.herokuapp.com";
const NOTICIAS_ENDPOINT = `${STRAPI_BASE_URL}/api/noticias-americas`;

async function getAllNoticias(): Promise<Noticia[]> {
  const queryParams = new URLSearchParams({
    "sort[0]": "publishedAt:desc",
    "pagination[limit]": "20",
    "populate[imagenes]": "*",
    "fields[0]": "Titulo",
    "fields[1]": "slug",
    "fields[2]": "parrafo1",
    "fields[3]": "publishedAt",
  });

  const fullUrl = `${NOTICIAS_ENDPOINT}?${queryParams.toString()}`;

  try {
    const res = await fetch(fullUrl, { next: { revalidate: 3600 } });
    if (!res.ok) {
      const errorBody = await res.text();
      console.error(
        `Error fetching noticias: ${res.status} ${res.statusText}. URL: ${fullUrl}. Response: ${errorBody}`
      );
      return [];
    }
    const data: StrapiNoticiasResponse = await res.json();
    return data.data || [];
  } catch (error) {
    console.error(`Exception fetching noticias from ${fullUrl}:`, error);
    return [];
  }
}

export default async function NoticiasPage() {
  // Como esto es un Server Component, podemos usar “await” dentro de la definición:
  const noticias = await getAllNoticias();

  return (
    <div>
      <div className="relative w-full aspect-[16/5] sm:aspect-[16/4] md:aspect-[16/3.5] lg:aspect-[16/3]">
        <Image
          src="/noticias.webp"
          alt="Encabezado de la sección de Noticias"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
          <span className="text-white text-4xl font-extrabold tracking-wider uppercase drop-shadow-xl sm:text-5xl md:text-6xl">
            NOTICIAS
          </span>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-16">
        {/* Pasamos el array de “noticias” al componente Cliente que se encargará de renderizar con framer-motion */}
        <NoticiasList noticias={noticias} />
      </section>
    </div>
  );
}
