"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

const slides = ["/slide1.png", "/slide2.png", "/slide3.png"];

const AUTOPLAY_INTERVAL = 5000; // 5 segundos

const Carousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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
            {slides.map((src, i) => (
              <div key={i} className="min-w-full">
                <img
                  src={src}
                  alt={`Slide ${i + 1}`}
                  className="w-full object-cover rounded-xl
                  h-[250px] sm:h-[300px] md:h-[300px] lg:h-[450px] xl:h-[500px]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dots responsive con animación */}
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
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
