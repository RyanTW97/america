"use client";

import { useEffect, useRef, useState } from "react";
import Carousel from "@/components/Carousel";
import NuestrosProductos from "@/components/productos/nuestrosProductos";
import ValoresGrid from "@/components/ValoresGrid";
import VideoBanner from "@/components/VideoBanner";
import ProductoDestacado from "@/components/destacado1/ProductoDestacado";
import ColorSystem from "@/components/colorsystem";
import Noticias from "@/components/news/Noticias";

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
      const direction = e.deltaY > 0 ? 1 : -1;

      // Scroll hacia arriba → permitir scroll normal
      if (direction === -1) {
        return; // No intervenimos, dejamos que el navegador haga su scroll normal
      }

      // Scroll hacia abajo → comportamiento personalizado
      if (isScrolling.current) return;

      const newIndex = currentSectionIndex + direction;

      if (newIndex >= 0 && newIndex < sectionRefs.length) {
        isScrolling.current = true;
        setCurrentSectionIndex(newIndex);

        if (
          currentSectionIndex === 0 &&
          direction === 1 &&
          valoresRef.current
        ) {
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
          const videoElement = videoRef.current;
          const rect = videoElement.getBoundingClientRect();
          const scrollY = window.scrollY + rect.top;
          const scrollTo = scrollY - window.innerHeight / 2 + rect.height / 2;

          window.scrollTo({
            top: scrollTo,
            behavior: "smooth",
          });
        } else {
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
      <ProductoDestacado />
      <ColorSystem />
      <Noticias />
    </>
  );
}
