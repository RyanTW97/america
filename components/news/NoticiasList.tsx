// components/news/NoticiasList.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import CardNoticia from "./CardNoticia"; // Asumimos que este componente existe tal cual antes
import { Noticia, StrapiRichTextParagraph } from "@/app/types/noticias";

interface NoticiasListProps {
  noticias: Noticia[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export default function NoticiasList({ noticias }: NoticiasListProps) {
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

  if (noticias.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-lg text-zinc-600">
          No hay noticias disponibles en este momento.
        </p>
      </div>
    );
  }

  return (
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
          attrs.Titulo ||
          "Imagen de la noticia";

        const slug = attrs.slug || noticia.id.toString();
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
                imagenAlt={imagenAlt}
                descripcion={resumen}
                index={index}
              />
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
