"use client";

import Slider from "react-slick";
import ProductCard from "./ProductCard";
import Titulo from "./generales/titulo";

const sampleProducts = Array.from({ length: 10 }).map(
  (_, i) => `Lorem Ipsum ${i + 1}`
);

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  responsive: [
    {
      breakpoint: 1280, // xl
      settings: {
        slidesToShow: 6,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1024, // lg
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768, // md
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 640, // sm
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
};

const ProductCarousel = () => (
  <div className="my-16 px-4 md:px-8">
    <Titulo azul="MÁS" blanco="PRODUCTOS" />
    <Slider {...settings}>
      {sampleProducts.map((title, index) => (
        <div key={index} className="px-2">
          <ProductCard title={title} />
        </div>
      ))}
    </Slider>
  </div>
);

export default ProductCarousel;
