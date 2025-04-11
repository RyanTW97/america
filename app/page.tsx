"use client";

import Carousel from "@/components/Carousel";
import NuestrosProductos from "@/components/productos/nuestrosProductos";
import ValoresGrid from "@/components/ValoresGrid";
import VideoBanner from "@/components/VideoBanner";
import ProductoDestacado from "@/components/destacado1/ProductoDestacado";
import ColorSystem from "@/components/colorsystem";
import Noticias from "@/components/news/Noticias";

export default function Page() {
  return (
    <>
      <section>
        <Carousel />
      </section>

      <section>
        <ValoresGrid />
      </section>

      <section>
        <VideoBanner />
      </section>

      <section>
        <NuestrosProductos />
      </section>

      <section>
        <ProductoDestacado />
      </section>

      <section>
        <ColorSystem />
      </section>

      <section>
        <Noticias />
      </section>
    </>
  );
}
