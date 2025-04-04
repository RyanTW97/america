"use client";

import { useEffect, useRef, useState } from "react";
import Carousel from "@/components/Carousel";
import NuestrosProductos from "@/components/productos/nuestrosProductos";
import ValoresGrid from "@/components/ValoresGrid";
import VideoBanner from "@/components/VideoBanner";

export default function Page() {
  const carouselRef = useRef<HTMLElement | null>(null);
  const valoresRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLElement | null>(null);
  const productosRef = useRef<HTMLElement | null>(null);

  const sectionRefs = [carouselRef, valoresRef, videoRef, productosRef];

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const isScrolling = useRef(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const newIndex = currentSectionIndex + direction;

      if (newIndex >= 0 && newIndex < sectionRefs.length) {
        isScrolling.current = true;
        setCurrentSectionIndex(newIndex);

        // Personalizamos el PRIMER scroll (Carousel → ValoresGrid)
        if (
          currentSectionIndex === 0 &&
          direction === 1 &&
          valoresRef.current
        ) {
          // Primer scroll → al inicio de ValoresGrid
          const offsetTop = valoresRef.current.offsetTop;
          const scrollTo = offsetTop - window.innerHeight * 0.7;

          window.scrollTo({
            top: scrollTo,
            behavior: "smooth",
          });
        } else if (
          currentSectionIndex === 1 &&
          direction === 1 &&
          videoRef.current
        ) {
          // Segundo scroll → centrar VideoBanner en pantalla
          const videoElement = videoRef.current;
          const rect = videoElement.getBoundingClientRect();
          const scrollY = window.scrollY + rect.top;
          const scrollTo = scrollY - window.innerHeight / 2 + rect.height / 2;

          window.scrollTo({
            top: scrollTo,
            behavior: "smooth",
          });
        } else {
          // Scroll normal entre otras secciones
          const targetRef = sectionRefs[newIndex].current;
          if (targetRef) {
            targetRef.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }

        setTimeout(() => {
          isScrolling.current = false;
        }, 1000);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [currentSectionIndex]);

  return (
    <>
      <section ref={carouselRef}>
        <Carousel />
      </section>

      <section ref={valoresRef}>
        <ValoresGrid />
      </section>

      <section ref={videoRef}>
        <VideoBanner />
      </section>

      <section ref={productosRef}>
        <NuestrosProductos />
      </section>
    </>
  );
}
