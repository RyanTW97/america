"use client";

import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import TrofeoCoverflow from "@/app/certificaciones/components/TrofeosCoverflow";

const titleVariants = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export default function FondoReconocimientos() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [nombrePremio, setNombrePremio] = useState("Premio a la Excelencia");

  return (
    <section className="relative w-full h-screen">
      {/* Imagen de fondo */}
      <Image
        src="/podio.png"
        alt="Fondo Podio"
        fill
        className="object-cover object-center lg:object-bottom xl:object-bottom"
        priority
      />

      {/* Título + nombre del premio con animación */}
      <motion.h1
        ref={ref}
        variants={titleVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="absolute top-10 left-1/2 transform -translate-x-1/2 text-5xl font-bold text-blue-700 z-20 drop-shadow-xl flex items-center gap-4"
      >
        RECONOCIMIENTOS
        <AnimatePresence mode="wait">
          <motion.span
            key={nombrePremio}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.4 }}
            className="text-lg font-medium text-blue-800 bg-white/80 px-4 py-1 rounded shadow"
          >
            {nombrePremio}
          </motion.span>
        </AnimatePresence>
      </motion.h1>

      {/* Carrusel de trofeos */}
      <TrofeoCoverflow onTrofeoChange={setNombrePremio} />
    </section>
  );
}
