"use client";

import Link from "next/link";
import Titulo from "../generales/titulo";
import CardProducto from "./CardProducto";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

const productos = [
  {
    titulo: "ARQUITECTÓNICA",
    imagen: "/arquitectonica.png",
    link: "/nuestros-productos?lineas=linea-arquitectonica&page=1",
  },
  {
    titulo: "INDUSTRIAL",
    imagen: "/industrial.png",
    link: "/nuestros-productos?page=1&lineas=linea-industrial",
  },
  {
    titulo: "AUTOMOTRIZ",
    imagen: "/automotriz.png",
    link: "/nuestros-productos?page=1&lineas=linea-automotriz",
  },
  {
    titulo: "METALMECÁNICA",
    imagen: "/metalmecanica.png",
    link: "#",
  },
  {
    titulo: "PISOS EPÓXICOS",
    imagen: "/epoxicos.png",
    link: "/nuestros-productos?page=1&lineas=pisos-epoxicos",
  },
  {
    titulo: "MADERA",
    imagen: "/madera.png",
    link: "/nuestros-productos?page=1&lineas=linea-madera",
  },
  {
    titulo: "DEMARCACIÓN VIAL",
    imagen: "/vial.png",
    link: "/nuestros-productos?page=1&lineas=demarcacion-vial",
  },
  {
    titulo: "ESPECIALES",
    imagen: "/especiales.png",
    link: "/nuestros-productos?page=1&lineas=especiales",
  },
];

export default function NuestrosProductos() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { margin: "-50% 0px", once: true });
  const animation = useAnimation();

  useEffect(() => {
    if (isInView) animation.start("visible");
  }, [isInView, animation]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <section ref={sectionRef} className="py-12 px-4 max-w-7xl mx-auto">
      <Titulo azul="NUESTROS" blanco="PRODUCTOS" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {productos.map((producto, idx) => (
          <Link key={idx} href={producto.link}>
            <motion.div
              custom={idx}
              initial="hidden"
              animate={animation}
              variants={cardVariants}
              className="cursor-pointer"
            >
              <CardProducto titulo={producto.titulo} imagen={producto.imagen} />
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}
