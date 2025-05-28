// app/noticias/[slug]/page.tsx
"use client";

import Image from "next/image";
import NoticiasCarousel from "@/components/news/Noticias"; // Asumiendo que este es para noticias relacionadas
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Noticia,
  StrapiNoticiasResponse,
  StrapiRichTextParagraph,
} from "@/app/types/noticias"; // Importar tipos

// Usar variable de entorno para la URL base de la API
const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "https://servidor-tricolor-64a23aa2b643.herokuapp.com/api";
const NOTICIAS_ENDPOINT = `${STRAPI_BASE_URL}/noticias-americas`;

// Variantes para animación de entrada
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 }, // Reducido y para mejor visibilidad inicial
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

// Helper para renderizar párrafos de Rich Text de Strapi
const RenderStrapiParagraphs = ({
  parrafos,
}: {
  parrafos?: StrapiRichTextParagraph[] | null;
}) => {
  if (!parrafos || parrafos.length === 0) {
    return null; // No renderizar nada si no hay párrafos
  }
  return (
    <>
      {parrafos.map((parrafoItem, idx) => (
        // Asumiendo que cada 'parrafoItem' es un objeto con { type: 'paragraph', children: [{ type: 'text', text: '...' }] }
        // y que no hay otros tipos de nodos dentro de children por ahora.
        <p key={idx} className="mb-4 last:mb-0">
          {parrafoItem.children?.map((child) => child.text).join("") || ""}
        </p>
      ))}
    </>
  );
};

export default function NoticiaIndividualPage() {
  const params = useParams();
  const slug = params?.slug as string | undefined; // Obtener slug y tiparlo

  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError("Slug de noticia no encontrado en la URL.");
      return;
    }

    const fetchNoticiaBySlug = async () => {
      setLoading(true);
      setError(null);
      // Construir URL para obtener la noticia específica por slug, poblando todas las relaciones necesarias
      const queryParams = new URLSearchParams({
        "filters[slug][$eq]": slug,
        "populate[imagenes]": "*", // Poblar el campo de media 'imagenes'
        // Añade aquí otros campos de relación que necesites poblar para la noticia
        // "populate[otraRelacion]": "*",
      });
      const fullUrl = `${NOTICIAS_ENDPOINT}?${queryParams.toString()}`;
      // console.log("Fetching noticia from:", fullUrl); // Para depuración

      try {
        const res = await fetch(fullUrl);
        if (!res.ok) {
          throw new Error(
            `Error al cargar la noticia: ${res.status} ${res.statusText}`
          );
        }
        const data: StrapiNoticiasResponse = await res.json();

        if (data.data && data.data.length > 0) {
          setNoticia(data.data[0]); // Strapi devuelve un array incluso filtrando por campo único
        } else {
          setError("Noticia no encontrada.");
          setNoticia(null);
        }
      } catch (err) {
        console.error("Error detallado al cargar la noticia:", err);
        setError(
          err instanceof Error ? err.message : "Ocurrió un error desconocido."
        );
        setNoticia(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticiaBySlug();
  }, [slug]); // Dependencia del efecto es el slug

  if (loading) {
    return (
      <div className="py-20 text-center text-lg font-semibold text-zinc-600">
        Cargando noticia...
      </div>
    );
  }

  if (error || !noticia) {
    return (
      <div className="py-20 text-center">
        <p className="text-xl font-semibold text-red-600">
          {error || "Noticia no encontrada."}
        </p>
        {/* Podrías añadir un enlace para volver a la lista de noticias */}
      </div>
    );
  }

  const attrs = noticia.attributes;
  const imagenes = attrs.imagenes?.data || []; // Array de objetos de imagen

  // Obtener URLs de imagen con fallbacks más robustos
  const getImageUrl = (index: number, fallbackIndex?: number): string => {
    const primaryUrl = imagenes[index]?.attributes?.url;
    if (primaryUrl) return primaryUrl;
    if (fallbackIndex !== undefined) {
      const fallbackUrl = imagenes[fallbackIndex]?.attributes?.url;
      if (fallbackUrl) return fallbackUrl;
    }
    return "/noticia-placeholder.png"; // Placeholder genérico
  };

  const imagen1Url = getImageUrl(0);
  const imagen2Url = getImageUrl(1, 0); // Si no hay imagen2, usa imagen1 (o placeholder si ninguna existe)

  const imageAltText = attrs.Titulo || "Imagen de la noticia";

  return (
    <main className="mx-auto max-w-5xl space-y-12 px-4 py-10 font-archivo md:space-y-16 lg:py-16">
      <motion.h1
        className="mb-10 text-center text-3xl font-extrabold leading-tight text-blue-800 md:text-4xl lg:text-5xl"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible" // Animar al cargar la página
        // whileInView y viewport son más para animaciones al hacer scroll
      >
        {attrs.Titulo}
      </motion.h1>

      <motion.section
        className="grid items-stretch gap-6 md:grid-cols-2 md:gap-8"
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible" // Animar cuando la sección entra en la vista
        viewport={{ once: true, amount: 0.1 }} // amount: 0.1 para que se active antes
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-lg md:aspect-auto">
          {" "}
          {/* Aspect ratio para la imagen */}
          <Image
            src={imagen1Url}
            alt={imageAltText}
            fill // Usar fill para que la imagen cubra el contenedor
            className="object-cover" // object-cover para llenar y recortar si es necesario
            sizes="(max-width: 768px) 100vw, 50vw"
            priority // Considerar priority para la primera imagen grande
          />
        </div>
        <div className="flex items-center text-justify text-base leading-relaxed text-gray-700 md:text-lg">
          <div>
            <RenderStrapiParagraphs parrafos={attrs.parrafo1} />
          </div>
        </div>
      </motion.section>

      {attrs.parrafo2 && attrs.parrafo2.length > 0 && (
        <motion.section
          className="space-y-4 text-justify text-base leading-relaxed text-gray-700 md:text-lg"
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <RenderStrapiParagraphs parrafos={attrs.parrafo2} />
        </motion.section>
      )}

      {attrs.parrafo3 && attrs.parrafo3.length > 0 && (
        <motion.section
          className="grid items-stretch gap-6 md:grid-cols-2 md:gap-8"
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="order-2 flex items-center text-justify text-base leading-relaxed text-gray-700 md:order-1 md:text-lg">
            <div>
              <RenderStrapiParagraphs parrafos={attrs.parrafo3} />
            </div>
          </div>
          <div className="relative order-1 aspect-[4/3] w-full overflow-hidden rounded-xl shadow-lg md:order-2 md:aspect-auto">
            <Image
              src={imagen2Url}
              alt={imageAltText} // Usar el mismo alt o uno específico si es diferente
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </motion.section>
      )}

      {/* Carrusel de otras noticias (NoticiasCarousel) */}
      {/* Este componente debería ser también un Client Component si usa react-slick */}
      {/* y debería obtener sus propios datos o recibirlos como props. */}
      <motion.div
        className="pt-8" // Añadido padding superior
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <h2 className="mb-8 text-center text-2xl font-bold text-blue-800 md:text-3xl">
          Otras Noticias
        </h2>
        <NoticiasCarousel />
      </motion.div>
    </main>
  );
}
