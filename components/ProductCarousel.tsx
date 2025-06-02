// src/components/ProductCarousel.tsx
"use client";

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Importamos el mismo tipo Product de /app/types.ts
import type { Product } from "@/app/types";
import ProductCard from "@/components/ProductCard";
import Titulo from "./generales/titulo";

interface ProductCarouselProps {
  // Recibe arreglo de Product (tal cual lo devuelve Strapi)
  products: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return null;
  }

  const productCount = products.length;
  const baseSlidesToShow = Math.min(6, productCount);

  const settings = {
    dots: true,
    infinite: productCount > baseSlidesToShow,
    speed: 500,
    slidesToShow: baseSlidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: productCount > baseSlidesToShow,
    responsive: [
      {
        breakpoint: 1536, // 2xl
        settings: {
          slidesToShow: Math.min(6, productCount),
          arrows: productCount > Math.min(6, productCount),
          infinite: productCount > Math.min(6, productCount),
        },
      },
      {
        breakpoint: 1280, // xl
        settings: {
          slidesToShow: Math.min(5, productCount),
          arrows: productCount > Math.min(5, productCount),
          infinite: productCount > Math.min(5, productCount),
        },
      },
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: Math.min(4, productCount),
          arrows: productCount > Math.min(4, productCount),
          infinite: productCount > Math.min(4, productCount),
        },
      },
      {
        breakpoint: 768, // md
        settings: {
          slidesToShow: Math.min(3, productCount),
          arrows: productCount > Math.min(3, productCount),
          infinite: productCount > Math.min(3, productCount),
        },
      },
      {
        breakpoint: 640, // sm
        settings: {
          slidesToShow: Math.min(2, productCount),
          arrows: productCount > Math.min(2, productCount),
          infinite: productCount > Math.min(2, productCount),
          centerMode: false,
        },
      },
      {
        breakpoint: 480, // < sm
        settings: {
          slidesToShow: 1,
          arrows: productCount > 1,
          infinite: productCount > 1,
          centerMode: true,
          centerPadding: "20px",
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
            {/* Ahora ProductCard espera un Product y recibe justo el mismo item */}
            <ProductCard product={product} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
