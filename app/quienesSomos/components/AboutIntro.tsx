// app/QuienesSomos/components/AboutIntro.tsx
"use client"; // Necesario para Framer Motion

import React from "react";
import SectionHeader from "./SectionHeader"; // Importamos el SectionHeader simplificado
import { cn } from "@/lib/utils";
import { motion } from "framer-motion"; // Importamos motion

// --- Variante de Animación para los Items ---
// Define cómo se ve el elemento en estado oculto y visible
// El timing exacto se controla con la prop 'transition' en cada elemento
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20, // Empieza invisible y 20px abajo
  },
  visible: {
    opacity: 1,
    y: 0, // Termina visible y en su posición Y original
  },
};
// --- Fin Variante ---

interface AboutIntroProps {
  titleBlueText: string;
  titleRedText: string;
  introParagraph: string;
  className?: string;
}

const AboutIntro: React.FC<AboutIntroProps> = ({
  titleBlueText,
  titleRedText,
  introParagraph,
  className,
}) => {
  return (
    // Contenedor principal que dispara la animación al entrar en vista
    <motion.section
      // Clases CSS exactas del último código que pasaste
      className={cn("py-8 md:py-12", className)}
      initial="hidden" // Empieza con los hijos en estado 'hidden'
      whileInView="visible" // Anima los hijos a 'visible' cuando entre en pantalla
      viewport={{ once: true, amount: 0.55 }} // Disparar una vez cuando 30% esté visible
    >
      {/* Wrapper para animar el Título con su delay específico */}
      <motion.div
        className="mb-8 md:mb-10 font-archivo" // Añadido margen inferior para separar del párrafo
        variants={itemVariants}
        // Transición específica para el título
        transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
      >
        <SectionHeader blueText={titleBlueText} redText={titleRedText} />
      </motion.div>

      {/* Párrafo animado con su delay específico */}
      <motion.p
        // Clases CSS exactas del último código que pasaste
        className={cn(
          "text-justify tracking-wider",
          "text-gray-800 dark:text-gray-300",
          "px-10 mx-auto", // Clases tal cual las pasaste
          "text-lg",
          "leading-relaxed",
          "font-archivo"
        )}
        variants={itemVariants}
        // Transición específica para el párrafo (0.4s después del título)
        transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
      >
        {introParagraph}
      </motion.p>
    </motion.section>
  );
};

export default AboutIntro;
