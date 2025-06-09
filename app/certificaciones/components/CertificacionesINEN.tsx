"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// --- DATOS DEL COMPONENTE ---
const inenCerts = [
  { src: "/INEN-1042-1.webp", alt: "INEN 1042-1" },
  { src: "/INEN-1043.webp", alt: "INEN 1043" },
  { src: "/INEN-1544.webp", alt: "INEN 1544" },
  { src: "/INEN-2094.webp", alt: "INEN 2094" },
];

// --- VARIANTES DE ANIMACIÓN ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
    },
  },
};

export default function CertificacionesINEN() {
  return (
    // --- ESPACIADO AJUSTADO ---
    // 1. Aumentado el padding superior: `pt-32` (móvil) y `md:pt-40` (desktop).
    // 2. Reducido el padding lateral: `px-2`.
    <section className="w-full pt-32 pb-24 md:pt-48 md:pb-32  bg-white">
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        {inenCerts.map((img) => (
          <motion.div
            key={img.src}
            className="flex justify-center"
            variants={itemVariants}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={250}
              height={250}
              className="object-contain h-auto w-full max-w-[180px]"
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
