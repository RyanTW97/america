// components/ProductCarousel.tsx
// @ts-nocheck
"use client"; // <--- AÑADIR ESTO PARA HACERLO UN CLIENT COMPONENT

import Slider from "react-slick";
// 1. VERIFICA ESTA RUTA: Asegúrate que apunte a tu ProductCard optimizado
// que espera la prop `product: Product`.
import ProductCard from "@/components/ProductCard";
import { Product } from "@/app/types";
// Titulo ya no se usa aquí si el título "Productos Destacados" se maneja en page.tsx
// import Titulo from "@/components/generales/titulo";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Titulo from "./generales/titulo";

interface ProductCarouselProps {
  products: Product[]; // Recibe los productos como prop
}

const ProductCarousel = ({ products }: ProductCarouselProps) => {
  // Ya no se hace fetch aquí, los productos vienen como props.

  if (!products || products.length === 0) {
    return (
      <div className="my-16 px-4 text-center text-zinc-500 md:px-8">
        {/* <p className="mt-4">No hay productos destacados en este momento.</p> */}
      </div>
    );
  }

  const productCount = products.length;
  let baseSlidesToShow = Math.min(6, productCount);

  const settings = {
    dots: true,
    infinite: productCount > baseSlidesToShow,
    speed: 500,
    slidesToShow: baseSlidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    arrows: productCount > baseSlidesToShow,
    responsive: [
      {
        breakpoint: 1536, // 2xl
        settings: {
          slidesToShow: Math.min(5, productCount),
          arrows: productCount > Math.min(5, productCount),
          infinite: productCount > Math.min(5, productCount),
        },
      },
      {
        breakpoint: 1280, // xl
        settings: {
          slidesToShow: Math.min(4, productCount),
          arrows: productCount > Math.min(4, productCount),
          infinite: productCount > Math.min(4, productCount),
        },
      },
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: Math.min(3, productCount),
          arrows: productCount > Math.min(3, productCount),
          infinite: productCount > Math.min(3, productCount),
        },
      },
      {
        breakpoint: 768, // md
        settings: {
          slidesToShow: Math.min(2, productCount),
          arrows: productCount > Math.min(2, productCount),
          infinite: productCount > Math.min(2, productCount),
        },
      },
      {
        breakpoint: 640, // sm
        settings: {
          slidesToShow: 1,
          arrows: productCount > 1,
          infinite: productCount > 1,
          centerMode: productCount > 1,
          centerPadding: productCount > 1 ? "40px" : "0px",
        },
      },
      {
        breakpoint: 480, // xs
        settings: {
          slidesToShow: 1,
          arrows: false,
          infinite: productCount > 1,
          centerMode: productCount > 1,
          centerPadding: productCount > 1 ? "20px" : "0px",
        },
      },
    ],
  };

  return (
    // El contenedor principal y el título ahora se manejan en page.tsx
    // para esta instancia del carrusel.
    <div>
      <Titulo azul="MÁS" blanco="PRODUCTOS" />
      <Slider {...settings} className="-mx-2 sm:-mx-3">
        {products.map((product) => (
          <div key={product.id} className="px-2 py-4 sm:px-3">
            <ProductCard product={product} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
