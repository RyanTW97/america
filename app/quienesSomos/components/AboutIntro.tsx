"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutIntro() {
  const introText =
    "En Pinturas América S.A. contamos con más de 25 años de experiencia en la elaboración y comercialización de recubrimientos orgánicos e inorgánicos como pinturas, resinas, tintas y disolventes. Atendemos los sectores industrial, naval, petrolero, automotriz, arquitectónico, entre otros, brindando asesoría técnica especializada y productos de alta calidad. Nuestra planta matriz, ubicada en un parque industrial moderno y ecológico, cuenta con el laboratorio más completo del país, reflejando nuestro compromiso con la innovación, la sostenibilidad y el crecimiento constante.";

  return (
    <motion.section
      className="py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.55 }}
    >
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-center font-archivo flex justify-center gap-2">
        <motion.span
          className="text-blue-800"
          variants={itemVariants}
          transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
        >
          SOBRE
        </motion.span>
        <motion.span
          className="text-red-500"
          variants={itemVariants}
          transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
        >
          NOSOTROS
        </motion.span>
      </h2>

      <motion.p
        className={cn(
          "text-justify tracking-wide",
          "text-gray-800 dark:text-gray-300",
          "text-base md:text-lg lg:text-xl leading-relaxed font-archivo",
          "py-6"
        )}
        variants={itemVariants}
        transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
      >
        {introText}
      </motion.p>
    </motion.section>
  );
}
