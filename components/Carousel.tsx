"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Slide = {
  id: number;
  imageUrl: string;
  link: string;
  alt: string;
  isExternal: boolean;
};

const AUTOPLAY_INTERVAL = 5000;
const CACHE_SLIDES_KEY = "carouselSlidesData"; // Cambiado para evitar colisiones con caché antigua
const CACHE_EXPIRATION_MS = 1000 * 60 * 60; // 1 hora (60 minutos)

const Carousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // 1. Intentar cargar slides desde localStorage
    try {
      const rawSlidesCache = localStorage.getItem(CACHE_SLIDES_KEY);
      if (rawSlidesCache) {
        const { slides: cachedSlides, timestamp } = JSON.parse(rawSlidesCache);
        if (Date.now() - timestamp < CACHE_EXPIRATION_MS) {
          setSlides(cachedSlides);
          setLoading(false);
          return; // Datos cargados desde caché válida
        }
        localStorage.removeItem(CACHE_SLIDES_KEY); // Caché expirada
      }
    } catch (error) {
      console.error("Error al leer/parsear caché de slides:", error);
      localStorage.removeItem(CACHE_SLIDES_KEY); // Limpiar caché corrupta
    }

    // 2. Si no hay caché válida, hacer fetch a Strapi
    const fetchSlides = async () => {
      try {
        const res = await fetch(
          "https://servidor-tricolor-64a23aa2b643.herokuapp.com/api/carousel-americas?populate=*"
        );
        if (!res.ok) {
          throw new Error(`Error de red: ${res.status} ${res.statusText}`);
        }
        const jsonResponse = await res.json();

        if (!jsonResponse || !Array.isArray(jsonResponse.data)) {
          console.error(
            "Estructura de respuesta inesperada de Strapi:",
            jsonResponse
          );
          setSlides([]);
          return;
        }

        const sortedData: any[] = [...jsonResponse.data].sort(
          (a, b) => a.id - b.id
        );

        const mappedSlides: Slide[] = sortedData.map((item: any) => {
          const attributes = item.attributes;
          let linkUrl =
            attributes.Link || attributes.link || attributes.linkInterno || "#";

          let finalImageUrl = "";
          const imageUrlFromStrapi = attributes.Imagen?.data?.attributes?.url;
          if (typeof imageUrlFromStrapi === "string") {
            finalImageUrl = imageUrlFromStrapi.startsWith("http")
              ? imageUrlFromStrapi
              : `https://servidor-tricolor-64a23aa2b643.herokuapp.com${imageUrlFromStrapi}`;
          }

          const isExt =
            typeof linkUrl === "string" &&
            (linkUrl.startsWith("http") || linkUrl.startsWith("mailto:"));

          return {
            id: item.id,
            imageUrl: finalImageUrl,
            link: linkUrl,
            alt: attributes.Text || `Imagen carrusel ${item.id}`,
            isExternal: isExt,
          };
        });

        setSlides(mappedSlides);

        // Guardar en caché
        try {
          localStorage.setItem(
            CACHE_SLIDES_KEY,
            JSON.stringify({ slides: mappedSlides, timestamp: Date.now() })
          );
        } catch (err) {
          console.error("Error guardando slides en localStorage:", err);
        }
      } catch (err) {
        console.error("Error al obtener slides de Strapi:", err);
        setSlides([]); // Asegurar que slides esté vacío en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []); // Se ejecuta solo al montar

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || slides.length === 0) return;

    emblaApi.on("select", onSelect);
    onSelect(); // Llamar inicialmente para setear el índice correcto

    const autoplayId = setInterval(() => {
      if (!isHovered) {
        emblaApi.scrollNext();
      }
    }, AUTOPLAY_INTERVAL);

    return () => {
      clearInterval(autoplayId);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect, isHovered, slides.length]); // slides.length como dependencia para re-inicializar si los slides cambian

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <span className="text-gray-500">Cargando carrusel...</span>
      </div>
    );
  }

  if (!slides.length) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <span className="text-gray-500">
          No hay imágenes disponibles para mostrar.
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center w-full" // Asegura que ocupe el ancho disponible
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full overflow-hidden rounded-xl">
        {" "}
        {/* Contenedor principal del carrusel */}
        <div className="embla" ref={emblaRef}>
          <div className="flex">
            {" "}
            {/* Contenedor de slides de Embla */}
            {slides.map((slide, i) => {
              const imageElement = slide.imageUrl ? (
                <Image
                  src={slide.imageUrl}
                  alt={slide.alt}
                  width={1440} // Ancho base para cálculo de aspect ratio
                  height={540} // Alto base para cálculo de aspect ratio
                  className="w-full object-cover h-[250px] sm:h-[300px] md:h-[350px] lg:h-[450px] xl:h-[500px]" // Alturas responsivas
                  priority={i === 0}
                  unoptimized={slide.imageUrl.endsWith(".gif")} // Si usas GIFs
                  draggable={false}
                />
              ) : (
                <div
                  className="w-full bg-gray-200 flex items-center justify-center 
                    h-[250px] sm:h-[300px] md:h-[350px] lg:h-[450px] xl:h-[500px]"
                >
                  <span className="text-gray-500">
                    {slide.alt || "Imagen no disponible"}
                  </span>
                </div>
              );

              const isHashLink =
                slide.link === "#" || slide.link.startsWith("#/");

              // Si el link es solo "#" o empieza con "#/", no lo envolvemos en Link de Next.js para evitar errores de navegación,
              // y usamos un <a> simple. Tampoco abrimos en nueva pestaña.
              if (slide.isExternal || isHashLink) {
                return (
                  <div key={slide.id} className="min-w-full flex-shrink-0">
                    {" "}
                    {/* Cada slide ocupa todo el ancho */}
                    <a
                      href={slide.link}
                      target={
                        slide.isExternal && !isHashLink ? "_blank" : undefined
                      }
                      rel={
                        slide.isExternal && !isHashLink
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="block"
                    >
                      {imageElement}
                    </a>
                  </div>
                );
              } else {
                return (
                  <div key={slide.id} className="min-w-full flex-shrink-0">
                    <Link href={slide.link} className="block">
                      {imageElement}
                    </Link>
                  </div>
                );
              }
            })}
          </div>
        </div>
        {slides.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute top-1/2 left-3 sm:left-4 z-10 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-700 transition-opacity"
              aria-label="Slide anterior"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              onClick={scrollNext}
              className="absolute top-1/2 right-3 sm:right-4 z-10 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-700 transition-opacity"
              aria-label="Siguiente slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="flex space-x-2 sm:space-x-3 mt-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`
                rounded-full border-2 transform transition-all duration-300 ease-in-out
                w-2.5 h-2.5 sm:w-3 sm:h-3 
                focus:outline-none 
                ${
                  selectedIndex === i
                    ? "scale-110 bg-gray-800 border-gray-800"
                    : "bg-gray-300 border-gray-400 hover:bg-gray-400 hover:border-gray-500"
                }
              `}
              aria-label={`Ir al slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
