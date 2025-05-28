"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

// 1. Define el tipo del slide
type Slide = {
  imageUrl: string;
  link: string;
  alt: string;
};

const AUTOPLAY_INTERVAL = 5000; // 5 segundos

const Carousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  // 2. Usa el tipo Slide[]
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Strapi
  useEffect(() => {
    async function fetchSlides() {
      try {
        const res = await fetch(
          "https://servidor-tricolor-64a23aa2b643.herokuapp.com/api/carousel-americas?populate=*"
        );
        const json = await res.json();

        // 3. Agrega el tipado para los items
        const sortedData: any[] = (json.data ?? []).sort(
          (a: any, b: any) => a.id - b.id
        );

        const mappedSlides: Slide[] = sortedData.map((item: any) => ({
          imageUrl: item.attributes.Imagen?.data?.attributes?.url
            ? item.attributes.Imagen?.data?.attributes?.url.startsWith("http")
              ? item.attributes.Imagen?.data?.attributes?.url
              : `https://servidor-tricolor-64a23aa2b643.herokuapp.com${item.attributes.Imagen?.data?.attributes?.url}`
            : "",
          link: item.attributes.Link || "#",
          alt: item.attributes.Text || "Imagen del carrusel",
        }));

        setSlides(mappedSlides);
        setLoading(false);
      } catch (error) {
        console.error("Error al traer los slides de Strapi:", error);
        setLoading(false);
      }
    }
    fetchSlides();
  }, []);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    onSelect();

    const autoplay = setInterval(() => {
      if (!isHovered) {
        emblaApi.scrollNext();
      }
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(autoplay);
  }, [emblaApi, onSelect, isHovered]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span>Cargando imágenes...</span>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center space-y-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel */}
      <div className="relative w-full overflow-hidden rounded-none">
        <div className="embla" ref={emblaRef}>
          <div className="flex transition-transform duration-700 ease-in-out">
            {slides.map((slide, i) => (
              <div key={i} className="min-w-full">
                <a href={slide.link}>
                  {slide.imageUrl ? (
                    <Image
                      src={slide.imageUrl}
                      alt={slide.alt}
                      width={1440}
                      height={540}
                      className="w-full object-cover rounded-xl
                        h-[250px] sm:h-[300px] md:h-[300px] lg:h-[450px] xl:h-[500px]"
                      priority={i === 0}
                    />
                  ) : (
                    <div className="bg-gray-200 h-[250px] flex items-center justify-center">
                      Imagen no disponible
                    </div>
                  )}
                </a>
              </div>
            ))}
          </div>
        </div>
        {/* Flechas (opcional) */}
        <button
          onClick={scrollPrev}
          className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white shadow"
        >
          &#8592;
        </button>
        <button
          onClick={scrollNext}
          className="absolute top-1/2 right-4 z-10 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white shadow"
        >
          &#8594;
        </button>
      </div>

      {/* Dots */}
      <div className="flex space-x-3 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`
              rounded-full border-2 transform transition-transform duration-300 ease-in-out
              w-3 h-3 sm:w-3 sm:h-3 md:w-3 md:h-3
              lg:w-4 lg:h-4
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
    </div>
  );
};

export default Carousel;
