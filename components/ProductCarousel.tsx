// components/ProductCarousel.tsx
"use client";

import Slider from "react-slick";
// 1. VERIFICA ESTA RUTA: Asegúrate que apunte a tu ProductCard optimizado
// que espera la prop `product: Product`.
import ProductCard from "@/components/ProductCard";
import { Product } from "@/app/types";
// El Titulo se maneja en la página que usa este carrusel, así que no es necesario aquí.
// import Titulo from "./generales/titulo";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Titulo from "./generales/titulo";

interface ProductCarouselProps {
  products: Product[]; // Recibe los productos como prop
}

const ProductCarousel = ({ products }: ProductCarouselProps) => {
  if (!products || products.length === 0) {
    return null;
  }

  const productCount = products.length;
  // Base slidesToShow para las pantallas más grandes (ej: 2xl y mayores)
  const baseSlidesToShow = Math.min(6, productCount);

  const settings = {
    dots: true,
    infinite: productCount > baseSlidesToShow,
    speed: 500,
    slidesToShow: baseSlidesToShow, // Inicia con 6 (o menos si hay pocos productos)
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: productCount > baseSlidesToShow,
    responsive: [
      {
        breakpoint: 1536, // Tailwind 2xl
        settings: {
          slidesToShow: Math.min(6, productCount), // Mantener 6 en 2xl
          arrows: productCount > Math.min(6, productCount),
          infinite: productCount > Math.min(6, productCount),
        },
      },
      {
        breakpoint: 1280, // Tailwind xl
        settings: {
          slidesToShow: Math.min(5, productCount), // Mostrar 5 en xl
          arrows: productCount > Math.min(5, productCount),
          infinite: productCount > Math.min(5, productCount),
        },
      },
      {
        breakpoint: 1024, // Tailwind lg
        settings: {
          slidesToShow: Math.min(4, productCount), // Mostrar 4 en lg
          arrows: productCount > Math.min(4, productCount),
          infinite: productCount > Math.min(4, productCount),
        },
      },
      {
        breakpoint: 768, // Tailwind md
        settings: {
          slidesToShow: Math.min(3, productCount), // Mostrar 3 en md
          arrows: productCount > Math.min(3, productCount),
          infinite: productCount > Math.min(3, productCount),
        },
      },
      {
        breakpoint: 640, // Tailwind sm
        settings: {
          slidesToShow: Math.min(2, productCount), // Mostrar 2 en sm
          arrows: productCount > Math.min(2, productCount),
          infinite: productCount > Math.min(2, productCount),
          centerMode: false, // Usualmente no se necesita centerMode si muestras 2
          // centerPadding: productCount > 1 ? "40px" : "0px", // No necesario si no es centerMode
        },
      },
      {
        breakpoint: 480, // Móviles más pequeños que sm
        settings: {
          slidesToShow: 1,
          arrows: productCount > 1, // Flechas si hay más de 1
          infinite: productCount > 1,
          centerMode: true, // CenterMode es bueno para 1 slide visible
          centerPadding: "20px", // Un poco de padding para ver los slides adyacentes
        },
      },
    ],
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-center">
        <Titulo azul="MÁS" blanco="PRODUCTOS" />
      </div>
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
