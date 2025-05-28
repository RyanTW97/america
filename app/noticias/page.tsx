// app/noticias/page.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import CardNoticia from "@/components/news/CardNoticia";
import { motion } from "framer-motion";
import {
  Noticia,
  StrapiNoticiasResponse,
  StrapiRichTextParagraph,
} from "@/app/types/noticias";

// 1. Asegúrate que STRAPI_API_URL en .env.local sea la URL base
//    (ej: https://servidor-tricolor-64a23aa2b643.herokuapp.com)
//    SIN el '/api' al final.
const STRAPI_BASE_URL =
  process.env.STRAPI_API_URL ||
  "https://servidor-tricolor-64a23aa2b643.herokuapp.com";
// 2. NOTICIAS_ENDPOINT ahora construye la ruta completa incluyendo '/api'
const NOTICIAS_ENDPOINT = `${STRAPI_BASE_URL}/api/noticias-americas`;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const headerTextVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
  },
};

async function getAllNoticias(): Promise<Noticia[]> {
  const queryParams = new URLSearchParams({
    "sort[0]": "publishedAt:desc",
    "pagination[limit]": "20",
    "populate[imagenes]": "*",
    "fields[0]": "Titulo", // Nombre exacto del campo en Strapi (con T mayúscula según tu JSON)
    "fields[1]": "slug", // Nombre exacto del campo en Strapi (con s minúscula según tu JSON)
    "fields[2]": "parrafo1", // Nombre exacto del campo en Strapi
    "fields[3]": "publishedAt", // Nombre exacto del campo en Strapi
  });

  const fullUrl = `${NOTICIAS_ENDPOINT}?${queryParams.toString()}`;
  // console.log("Fetching all noticias from (app/noticias/page.tsx - CORRECTED URL):", fullUrl); // Descomenta para depurar

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
  const noticias = await getAllNoticias();

  const getResumen = (
    parrafo1?: StrapiRichTextParagraph[] | null,
    maxLength: number = 80
  ): string => {
    if (parrafo1 && parrafo1.length > 0 && parrafo1[0].children?.length > 0) {
      const text = parrafo1[0].children
        .filter((child) => child.type === "text")
        .map((child) => child.text)
        .join(" ");
      return text.length > maxLength
        ? text.slice(0, maxLength).trimEnd() + "..."
        : text;
    }
    return "";
  };

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
        <motion.div
          initial="hidden"
          animate="visible"
          variants={headerTextVariants}
          className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none"
        >
          <span className="text-white text-4xl font-extrabold tracking-wider uppercase drop-shadow-xl sm:text-5xl md:text-6xl">
            NOTICIAS
          </span>
        </motion.div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-16">
        {noticias.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-8">
            {noticias.map((noticia, index) => {
              if (!noticia || !noticia.attributes) {
                console.warn(
                  "Noticia inválida o sin atributos encontrada en map:",
                  noticia
                );
                return null;
              }
              const attrs = noticia.attributes;

              const imagenUrl =
                attrs.imagenes?.data?.[0]?.attributes?.formats?.small?.url ||
                attrs.imagenes?.data?.[0]?.attributes?.url ||
                "/noticia-placeholder.png";

              const imagenAlt =
                attrs.imagenes?.data?.[0]?.attributes?.alternativeText ||
                attrs.Titulo || // Usar attrs.Titulo (con T mayúscula)
                "Imagen de la noticia";

              const slug = attrs.slug || noticia.id.toString(); // Usar attrs.slug (con s minúscula)
              const resumen = getResumen(attrs.parrafo1);

              return (
                <motion.div
                  key={noticia.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                >
                  <Link
                    href={`/noticias/${slug}`}
                    className="block h-full transition-shadow duration-200 hover:shadow-xl"
                    prefetch={false}
                  >
                    <CardNoticia
                      titulo={attrs.Titulo || "Noticia sin título"}
                      imagen={imagenUrl}
                      imagenAlt={imagenAlt} // Prop imagenAlt ahora se pasa
                      descripcion={resumen}
                      index={index}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-lg text-zinc-600">
              No hay noticias disponibles en este momento.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
