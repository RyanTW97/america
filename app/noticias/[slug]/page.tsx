//app/noticias/[slug].page.tsx
"use client";

import Image from "next/image";
import NoticiasCarousel from "@/components/news/Noticias";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

const API_URL =
  "https://servidor-tricolor-64a23aa2b643.herokuapp.com/api/noticias-americas?populate=*";

// Variantes para animación de entrada
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function NoticiaIndividual() {
  const params = useParams();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        const found = data.data.find((item) => {
          const slug = item.attributes.slug;
          if (slug) {
            return slug === params.slug;
          }
          return String(item.id) === String(params.slug);
        });
        setNoticia(found);
      } catch (error) {
        console.error("Error al cargar la noticia:", error);
      } finally {
        setLoading(false);
      }
    };
    if (params?.slug) {
      fetchNoticia();
    }
  }, [params?.slug]);

  if (loading) {
    return <div className="text-center py-10">Cargando noticia...</div>;
  }

  if (!noticia) {
    return (
      <div className="text-center py-10 text-red-500">
        Noticia no encontrada.
      </div>
    );
  }

  const attrs = noticia.attributes;
  const imagenes = attrs.imagenes?.data || [];
  const imagen1 = imagenes[0]?.attributes?.url || "/noticia-placeholder.png";
  const imagen2 =
    imagenes[1]?.attributes?.url ||
    imagenes[0]?.attributes?.url ||
    "/noticia-placeholder.png";

  // Helper para renderizar parrafos tipo Strapi
  const renderParrafos = (parrafos) =>
    (parrafos || []).map((item, idx) => (
      <p key={idx} className="mb-4">
        {item.children?.[0]?.text || ""}
      </p>
    ));

  return (
    <main className="max-w-6xl mx-auto py-10 space-y-14 font-archivo">
      {/* Título de la noticia */}
      <motion.h1
        className="text-center text-blue-900 font-extrabold text-3xl md:text-4xl lg:text-5xl leading-tight mb-8"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.7 }}
      >
        {attrs.Titulo}
      </motion.h1>

      {/* Bloque 1: Imagen izquierda, texto derecha */}
      <motion.section
        className="grid md:grid-cols-2 gap-6 items-stretch"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div>
          <Image
            src={imagen1}
            alt={attrs.Titulo}
            width={500}
            height={350}
            className="rounded-2xl w-full h-96 object-cover"
          />
        </div>
        <div className="text-gray-800 text-[16px] leading-relaxed text-justify pr-2 flex items-center">
          <div>{renderParrafos(attrs.parrafo1)}</div>
        </div>
      </motion.section>

      {/* Bloque 2: Texto completo */}
      <motion.section
        className="text-gray-800 text-[16px] leading-relaxed text-justify space-y-4"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {renderParrafos(attrs.parrafo2)}
      </motion.section>

      {/* Bloque 3: Texto izquierda, imagen derecha */}
      <motion.section
        className="grid md:grid-cols-2 gap-6 items-stretch"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="text-gray-800 text-[16px] leading-relaxed text-justify pr-2 order-2 md:order-1 flex items-center">
          <div>{renderParrafos(attrs.parrafo3)}</div>
        </div>
        <div className="order-1 md:order-2">
          <Image
            src={imagen2}
            alt={attrs.Titulo}
            width={600}
            height={400}
            className="rounded-2xl w-full h-96 object-cover"
          />
        </div>
      </motion.section>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <NoticiasCarousel />
      </motion.div>
    </main>
  );
}
