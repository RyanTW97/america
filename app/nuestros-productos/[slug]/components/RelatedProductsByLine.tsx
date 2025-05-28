// app/nuestros-productos/[slug]/components/RelatedProductsByLine.tsx
// @ts-nocheck
"use client";

import Slider from "react-slick";
// 1. VERIFICA ESTA RUTA: Asegúrate que apunte a tu ProductCard optimizado
// que espera la prop `product: Product`.
import ProductCard from "@/components/ProductCard";
import { Product } from "@/app/types";
import Titulo from "@/components/generales/titulo";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface RelatedProductsByLineProps {
  lineaNombre: string;
  relatedProducts: Product[] | null;
}

const RelatedProductsByLine = ({
  lineaNombre,
  relatedProducts,
}: RelatedProductsByLineProps) => {
  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  const productCount = relatedProducts.length;

  // Define base slidesToShow, y luego ajústalo si es necesario
  let baseSlidesToShow = Math.min(6, productCount);

  const settings = {
    dots: true,
    infinite: productCount > baseSlidesToShow, // 'infinite' si hay más productos que los que se muestran
    speed: 500,
    slidesToShow: baseSlidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: productCount > baseSlidesToShow, // 'arrows' si hay más productos que los que se muestran
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
        breakpoint: 480, // xs más pequeños
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

  // No es necesario el bucle posterior para actualizar 'infinite' y 'arrows' en 'responsive'
  // porque ya se calculan con Math.min(X, productCount) directamente.

  return (
    <div className="my-12 px-4 md:my-16 lg:px-8 xl:px-16">
      <div className="mb-4 flex items-center justify-center">
        <Titulo azul="MÁS" blanco="PRODUCTOS" />
      </div>
      <div className="mb-8 flex items-center gap-4">
        <h3 className="whitespace-nowrap text-lg font-medium text-blue-700 sm:text-xl">
          Línea {lineaNombre}
        </h3>
        <hr className="w-full border-t-2 border-zinc-300" />
      </div>

      <Slider {...settings} className="-mx-2 sm:-mx-3">
        {relatedProducts.map((product) => (
          <div key={product.id} className="px-2 py-4 sm:px-3">
            <ProductCard product={product} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RelatedProductsByLine;
