"use client";

import Titulo from "../generales/titulo";
import CardProducto from "./CardProducto";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

const productos = [
  { titulo: "ARQUITECTÓNICA", imagen: "/arquitectonica.png" },
  { titulo: "INDUSTRIAL", imagen: "/industrial.png" },
  { titulo: "AUTOMOTRIZ", imagen: "/automotriz.png" },
  { titulo: "METALMECÁNICA", imagen: "/metalmecanica.png" },
  { titulo: "PISOS EPÓXICOS", imagen: "/epoxicos.png" },
  { titulo: "MADERA", imagen: "/madera.png" },
  { titulo: "DEMARCACIÓN VIAL", imagen: "/vial.png" },
  { titulo: "ESPECIALES", imagen: "/especiales.png" },
];

export default function NuestrosProductos() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    margin: "-50% 0px", // activa cuando se llega a la mitad del componente
    once: true,
  });

  const animation = useAnimation();

  useEffect(() => {
    if (isInView) {
      animation.start("visible");
    }
  }, [isInView, animation]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section ref={sectionRef} className="py-12 px-4 max-w-7xl mx-auto">
      <Titulo azul="NUESTROS" blanco="PRODUCTOS" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {productos.map((producto, idx) => (
          <motion.div
            key={idx}
            custom={idx}
            initial="hidden"
            animate={animation}
            variants={cardVariants}
          >
            <CardProducto titulo={producto.titulo} imagen={producto.imagen} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
