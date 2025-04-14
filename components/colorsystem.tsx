"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function ColorSystem() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50% 0px" });

  return (
    <section
      ref={ref}
      className="relative max-w-7xl mx-auto px-4 md:px-8 mt-mb-16 mb-16 "
    >
      {/* Imagen principal sin animación */}
      <Image
        src="/color-system.png"
        alt="Color System"
        width={1200}
        height={500}
        className="h-auto w-full"
      />

      {/* Imagen tarros animada */}
      <motion.div
        initial={{ opacity: 0, scale: 1.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 18,
          duration: 0.6,
        }}
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
      >
        <Image
          src="/tarros.png"
          alt="Tarros de pintura"
          width={600}
          height={180}
        />
      </motion.div>
    </section>
  );
}
