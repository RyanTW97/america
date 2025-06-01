"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState, useRef } from "react";
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
const CACHE_SLIDES_KEY = "carouselSlides";
const CACHE_IMAGES_KEY = "carouselSlideImages";
const CACHE_EXPIRATION_MS = 1000 * 60 * 60; // 1 hora

const Carousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Para depurar si Embla interpreta clic vs drag
  const pointerDownX = useRef<number | null>(null);
  const pointerDownY = useRef<number | null>(null);

  useEffect(() => {
    setLoading(true);

    // 1) Intentamos leer del cache de SLIDES
    try {
      const rawSlidesCache = localStorage.getItem(CACHE_SLIDES_KEY);
      if (rawSlidesCache) {
        const { slides: cachedSlides, timestamp: slidesTimestamp } =
          JSON.parse(rawSlidesCache);
        const now = Date.now();

        if (now - slidesTimestamp < CACHE_EXPIRATION_MS) {
          // El cache de slides completa es válido: lo usamos
          console.log(
            "[Cache SLIDES] Cargando slides completos desde localStorage:"
          );
          setSlides(cachedSlides);

          // 1a) Intentamos leer también el cache de IMAGES
          try {
            const rawImagesCache = localStorage.getItem(CACHE_IMAGES_KEY);
            if (rawImagesCache) {
              const { imageUrls: cachedImageUrls, timestamp: imagesTimestamp } =
                JSON.parse(rawImagesCache);
              if (now - imagesTimestamp < CACHE_EXPIRATION_MS) {
                console.log(
                  "[Cache IMAGES] Cargando solo URLs de imágenes desde localStorage:"
                );
                setImageUrls(cachedImageUrls);
              } else {
                console.log("[Cache IMAGES] Expirado: se borrará:");
                localStorage.removeItem(CACHE_IMAGES_KEY);
              }
            }
          } catch (e) {
            console.error(
              "[Cache IMAGES] Error leyendo/parsing cache de imágenes:",
              e
            );
            localStorage.removeItem(CACHE_IMAGES_KEY);
          }

          setLoading(false);
          return; // ¡Ya cargamos todo del cache de slides!
        } else {
          console.log("[Cache SLIDES] Expirado. Borrando cache de slides.");
          localStorage.removeItem(CACHE_SLIDES_KEY);
        }
      }
    } catch (e) {
      console.error("[Cache SLIDES] Error leyendo/parsing cache de slides:", e);
      localStorage.removeItem(CACHE_SLIDES_KEY);
    }

    // 2) Si llegamos aquí, significa que no queremos (o no podemos) usar el cache de SLIDES, así que hacemos fetch a Strapi
    (async () => {
      try {
        console.log("[Fetch] Solicitando datos a Strapi...");
        const res = await fetch(
          "https://servidor-tricolor-64a23aa2b643.herokuapp.com/api/carousel-americas?populate=*"
        );
        if (!res.ok) {
          throw new Error(`Error de red: ${res.status} ${res.statusText}`);
        }
        const jsonResponse = await res.json();
        console.log("[Fetch] JSON completo devuelto por Strapi:", jsonResponse);

        // Ahora sabemos que jsonResponse es { data: [...], meta: {...} }
        const strapiData = jsonResponse;
        console.log("[Fetch] strapiData:", strapiData);

        if (!strapiData || !Array.isArray(strapiData.data)) {
          console.error(
            "[Fetch] Estructura inesperada. strapiData.data no es un arreglo:",
            strapiData
          );
          setSlides([]);
          setImageUrls([]);
          setLoading(false);
          return;
        }

        // 2a) Ordenamos por id (ascendente)
        const sortedData: any[] = [...strapiData.data].sort(
          (a, b) => a.id - b.id
        );

        // 2b) Mapeamos cada elemento a nuestro tipo Slide
        const mappedSlides: Slide[] = sortedData.map((item: any) => {
          console.log(
            `[Mapeo] item.id=${item.id} → item.attributes COMPLETO:`,
            item.attributes
          );

          // 2b.1) Extraer el campo correcto para el link
          const rawLink1 = item.attributes.Link; // ej. "Link"
          const rawLink2 = item.attributes.link; // ej. "link"
          const rawLink3 = item.attributes.linkInterno; // ej. "linkInterno"
          let linkUrl = "#";

          if (typeof rawLink1 === "string") {
            linkUrl = rawLink1;
          } else if (typeof rawLink2 === "string") {
            linkUrl = rawLink2;
          } else if (typeof rawLink3 === "string") {
            linkUrl = rawLink3;
          } else {
            console.warn(
              `[Mapeo] No se encontró campo "Link" válido en item.id=${item.id}. Usando "#".`
            );
          }

          // 2b.2) Construimos la URL de la imagen
          const imageUrlFromStrapi =
            item.attributes.Imagen?.data?.attributes?.url;
          let finalImageUrl = "";
          if (typeof imageUrlFromStrapi === "string") {
            if (imageUrlFromStrapi.startsWith("http")) {
              finalImageUrl = imageUrlFromStrapi;
            } else {
              finalImageUrl = `https://servidor-tricolor-64a23aa2b643.herokuapp.com${imageUrlFromStrapi}`;
            }
          } else {
            console.warn(
              `[Mapeo] No se encontró "Imagen.data.attributes.url" para item.id=${item.id}.`
            );
          }

          // 2b.3) Determinar si el link es externo
          const isExt =
            typeof linkUrl === "string" &&
            (linkUrl.startsWith("http") || linkUrl.startsWith("mailto:"));
          console.log(
            `[Mapeo] Para item.id=${item.id} → linkUrl="${linkUrl}", isExternal=${isExt}`
          );

          return {
            id: item.id,
            imageUrl: finalImageUrl,
            link: linkUrl,
            alt: item.attributes.Text || `Imagen carrusel ${item.id}`,
            isExternal: isExt,
          };
        });

        console.log("[Fetch] mappedSlides definitivo:", mappedSlides);
        setSlides(mappedSlides);

        // 2c) Guardamos en cache el arreglo completo de slides
        try {
          localStorage.setItem(
            CACHE_SLIDES_KEY,
            JSON.stringify({ slides: mappedSlides, timestamp: Date.now() })
          );
          console.log("[Cache SLIDES] Slides guardados en localStorage.");
        } catch (err) {
          console.error("[Cache SLIDES] Error guardando en localStorage:", err);
        }

        // 2d) Extraemos solo las URLs de las imágenes, y las guardamos en CACHE_IMAGES_KEY
        const onlyImageUrls = mappedSlides.map((s) => s.imageUrl);
        try {
          localStorage.setItem(
            CACHE_IMAGES_KEY,
            JSON.stringify({ imageUrls: onlyImageUrls, timestamp: Date.now() })
          );
          console.log(
            "[Cache IMAGES] Solo URLs de imagen guardadas en localStorage:",
            onlyImageUrls
          );
        } catch (err) {
          console.error(
            "[Cache IMAGES] Error guardando URLs de imagen en localStorage:",
            err
          );
        }

        // 2e) Actualizamos el estado de imageUrls con las mismas URLs que acabamos de guardar
        setImageUrls(onlyImageUrls);
      } catch (err) {
        console.error("[Fetch] Error al traer slides de Strapi:", err);
        setSlides([]);
        setImageUrls([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // -------------------------------------------------------------------------
  // Si quisieras un mecanismo extra (por ejemplo, recargar SOLO las imágenes
  // sin volver a descargar todo el arreglo de slides), podrías exponer aquí
  // una función que:
  //   1) haga fetch de un endpoint “ligero” que devuelva únicamente las URLs
  //      de las nuevas imágenes,
  //   2) actualice localStorage bajo CACHE_IMAGES_KEY,
  //   3) actualice setImageUrls(nuevasUrls).
  //
  // Pero eso ya sale del alcance de cómo Next/Image cachea internamente las imágenes
  // en el navegador; aquí simplemente mantendríamos en localStorage las URLs.
  // -------------------------------------------------------------------------

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    if (slides.length === 0) {
      if (emblaApi.canScrollNext() || emblaApi.canScrollPrev()) {
        emblaApi.reInit();
      }
      return;
    }

    emblaApi.on("select", onSelect);
    onSelect();

    // Detectar pointerDown para depurar drag vs clic
    const handlePointerDown = (event: any) => {
      if (
        event &&
        typeof event.clientX === "number" &&
        typeof event.clientY === "number"
      ) {
        pointerDownX.current = event.clientX;
        pointerDownY.current = event.clientY;
      } else {
        pointerDownX.current = null;
        pointerDownY.current = null;
      }
    };
    // Detectar pointerUp
    const handlePointerUp = (event: any) => {
      if (
        event &&
        typeof event.clientX === "number" &&
        typeof event.clientY === "number" &&
        pointerDownX.current !== null &&
        pointerDownY.current !== null
      ) {
        const dx = Math.abs(event.clientX - pointerDownX.current);
        const dy = Math.abs(event.clientY - pointerDownY.current);
        console.log(
          `[Embla] pointerUp en: (${event.clientX}, ${
            event.clientY
          }), desplazamiento: dx=${dx.toFixed(1)}, dy=${dy.toFixed(1)}`
        );

        if (dx < 5 && dy < 5) {
          const slide = slides[selectedIndex];
          console.log(
            `[Depura] Se consideró CLIC en slide index=${selectedIndex} (id=${slide?.id}), link="${slide?.link}"`
          );
        } else {
          console.log(`[Depura] Esto fue considerado un DRAG (dx o dy >= 5).`);
        }
      } else {
        console.log(
          "[Embla] pointerUp sin coords válidas o pointerDown no registrado."
        );
      }
    };

    emblaApi.on("pointerDown", handlePointerDown);
    emblaApi.on("pointerUp", handlePointerUp);

    const autoplayId = setInterval(() => {
      if (!isHovered) emblaApi.scrollNext();
    }, AUTOPLAY_INTERVAL);

    return () => {
      clearInterval(autoplayId);
      emblaApi.off("select", onSelect);
      emblaApi.off("pointerDown", handlePointerDown);
      emblaApi.off("pointerUp", handlePointerUp);
    };
  }, [emblaApi, onSelect, isHovered, slides, selectedIndex]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span>Cargando carrusel...</span>
      </div>
    );
  }

  if (!slides.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <span>No hay imágenes disponibles para mostrar.</span>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center space-y-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full overflow-hidden">
        <div className="embla" ref={emblaRef}>
          <div className="flex">
            {slides.map((slide, i) => {
              console.log(
                `[Render Slide] índice=${i}, id=${slide.id}, link="${slide.link}", isExternal=${slide.isExternal}`
              );

              const imageElement = slide.imageUrl ? (
                <Image
                  src={slide.imageUrl}
                  alt={slide.alt}
                  width={1440}
                  height={540}
                  className="w-full object-cover rounded-xl
                    h-[250px] sm:h-[300px] md:h-[300px] lg:h-[450px] xl:h-[500px]"
                  priority={i === 0}
                  unoptimized={slide.imageUrl.endsWith(".gif")}
                  draggable={false}
                />
              ) : (
                <div
                  className="w-full bg-gray-200 flex items-center justify-center rounded-xl
                    h-[250px] sm:h-[300px] md:h-[300px] lg:h-[450px] xl:h-[500px]"
                >
                  <span>{slide.alt || "Imagen no disponible"}</span>
                </div>
              );

              const isHash = slide.link === "#" || slide.link.startsWith("#/");
              if (slide.isExternal || isHash) {
                return (
                  <div key={slide.id} className="min-w-full">
                    <a
                      href={slide.link}
                      target={slide.isExternal ? "_blank" : undefined}
                      rel={slide.isExternal ? "noopener noreferrer" : undefined}
                      className="block"
                      onClick={(e) => {
                        console.log(
                          `[Click <a>] Slide ${i}, href="${slide.link}", isExternal=${slide.isExternal}`
                        );
                        // Para pausar la navegación y solo ver el log, descomenta:
                        // e.preventDefault();
                      }}
                    >
                      {imageElement}
                    </a>
                  </div>
                );
              } else {
                return (
                  <div key={slide.id} className="min-w-full">
                    <Link
                      href={slide.link}
                      className="block"
                      onClick={(e) => {
                        console.log(
                          `[Click <Link>] Slide ${i}, href="${slide.link}", isExternal=${slide.isExternal}`
                        );
                        // Para pausar la navegación y solo ver el log, descomenta:
                        // e.preventDefault();
                      }}
                    >
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
              className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label="Slide anterior"
            >
              &#8592;
            </button>
            <button
              onClick={scrollNext}
              className="absolute top-1/2 right-4 z-10 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label="Siguiente slide"
            >
              &#8594;
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="flex space-x-3 mt-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`
                rounded-full border-2 transform transition-all duration-300 ease-in-out
                w-3 h-3 sm:w-3 sm:h-3 md:w-3 md:h-3
                lg:w-4 lg:h-4
                focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-black
                ${
                  selectedIndex === i
                    ? "scale-125 bg-black border-black"
                    : "scale-100 bg-gray-300 border-gray-400 hover:scale-110 hover:bg-gray-400"
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
