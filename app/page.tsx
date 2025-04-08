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
  const destacadoRef = useRef<HTMLElement | null>(null);
  const colorRef = useRef<HTMLElement | null>(null);
  const noticiasRef = useRef<HTMLElement | null>(null);

  const sectionRefs = [
    carouselRef,
    valoresRef,
    videoRef,
    productosRef,
    destacadoRef,
    colorRef,
    noticiasRef,
  ];

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const isScrolling = useRef(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const direction = e.deltaY > 0 ? 1 : -1;

      if (isScrolling.current) return;

      const newIndex = currentSectionIndex + direction;
      if (newIndex < 0 || newIndex >= sectionRefs.length) return;

      isScrolling.current = true;
      setCurrentSectionIndex(newIndex);

      const targetRef = sectionRefs[newIndex].current;
      if (!targetRef) return;

      const rect = targetRef.getBoundingClientRect();
      const scrollY = window.scrollY + rect.top;

      let scrollTo = 0;

      if (newIndex === sectionRefs.length - 1) {
        // Noticias → justo antes del footer
        scrollTo = scrollY - window.innerHeight + rect.height;
      } else if (newIndex === 3) {
        // NuestrosProductos → un poco más abajo (para mostrar el título)
        scrollTo = scrollY - window.innerHeight * 0.1;
      } else {
        // Todas las demás → centrado vertical
        scrollTo = scrollY - window.innerHeight / 2 + rect.height / 2;
      }

      window.scrollTo({
        top: scrollTo,
        behavior: "smooth",
      });

      setTimeout(() => {
        isScrolling.current = false;
      }, 1000);
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

      <section ref={destacadoRef}>
        <ProductoDestacado />
      </section>

      <section ref={colorRef}>
        <ColorSystem />
      </section>

      <section ref={noticiasRef}>
        <Noticias />
      </section>
    </>
  );
}
