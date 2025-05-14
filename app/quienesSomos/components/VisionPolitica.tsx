"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const VisionPolitica: React.FC = () => {
  return (
    <div className="w-full mx-auto rounded-lg md:flex min-h-screen py-14">
      {/* Imagen */}
      <motion.div
        className="relative w-full h-64 md:h-auto md:w-1/2 "
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        {/*Aplicar borde a la imagen*/}
        <Image
          src="/bodega.png"
          alt="Interior de una bodega con estanterías y productos"
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          className="rounded-2xl"
        />
      </motion.div>

      {/* Texto */}
      <div className="w-full py-8 bg-white md:w-1/2 flex flex-col justify-between">
        {/* VISIÓN */}
        <div className="mb-8">
          <motion.h2
            className="mb-4 text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-red-600 uppercase font-archivo"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            VISIÓN
          </motion.h2>
          <motion.p
            className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed text-justify font-archivo"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Liderar el mercado nacional y proyectarnos internacionalmente,
            respaldados en la continua innovación tecnológica, de manera que las
            necesidades de nuestros clientes alcancen plena realización.
          </motion.p>
        </div>

        {/* POLÍTICA HSEQ */}
        <div>
          <motion.h3
            className="mb-4 text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-blue-900 font-archivo"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Política de gestión integral{" "}
            <span className="font-bold text-red-600 uppercase">HSEQ</span>
          </motion.h3>
          <motion.p
            className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed text-justify font-archivo"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Trabajar en conformidad con las Normas Internacionales de Gestión de
            la Calidad ISO 9001, de Gestión Ambiental ISO 14001, de Gestión de
            Seguridad y Salud Ocupacional ISO 45001, Responsabilidad Social
            Empresarial RSE y requisitos legales; para satisfacer los
            requerimientos de nuestros clientes, mediante el mejoramiento
            continuo en sistemas, procesos y productos; utilizando tecnología
            avanzada y talento humano competente, comprometido y consciente de
            que "La Calidad se Produce".
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default VisionPolitica;
