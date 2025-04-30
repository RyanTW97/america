"use client";

import Link from "next/link";
import { CircleArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Certificaciones() {
  return (
    <section className="w-full max-w-7xl mx-auto py-6">
      {/* Título y flecha */}
      <motion.div
        className="flex justify-center items-center gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-900 font-archivo">
          CERTIFICACIONES
        </h2>

        {/* Icono con movimiento constante hacia la derecha */}
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Link href="/" className="rounded-full p-2 text-red-500">
            <CircleArrowRight size={38} />
          </Link>
        </motion.div>
      </motion.div>

      <motion.p
        className="mx-auto text-gray-700 text-base md:text-lg lg:text-xl tracking-wider text-justify font-archivo"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        En Pinturas América S.A. nos regimos por altos estándares de calidad,
        contamos con certificaciones que avalan nuestros procesos de producción,
        control de calidad y compromiso ambiental. Estas acreditaciones
        garantizan que cada uno de nuestros productos cumple con normativas
        nacionales e internacionales, reforzando la confianza de nuestros
        clientes en sectores tan exigentes como el industrial, naval, petrolero
        y arquitectónico.
      </motion.p>
    </section>
  );
}
