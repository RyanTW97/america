// app/QuienesSomos/components/HistorySectionScroll.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import VideoPlaceholder from "./VideoPlaceholder"; // Asegúrate que VideoPlaceholder.tsx esté actualizado
import { ArrowDown } from "lucide-react";

// --- Datos (sin cambios) ---
const historyStepsData = [
  {
    index: 0,
    text: "Pinturas América S.A. es una Sociedad Anónima constituida el 10 de febrero de 1997, con un enfoque claro en la elaboración, compraventa, importación, exportación y comercialización de una amplia gama de productos de recubrimiento, tanto orgánicos como inorgánicos. Su catálogo incluye pinturas, resinas, tintas, disolventes, diluyentes y tratamientos especiales para diversas industrias, ya sea en estado manufacturado o en bruto. Desde sus inicios, la empresa ha mantenido una visión integral para atender múltiples sectores con soluciones de alta calidad.",
    bgColor: "#FFFFFF",
    textColor: "text-gray-800",
    titleColor: "text-blue-800",
    arrowBg: "bg-gray-600 hover:bg-gray-700",
    arrowColor: "text-white",
  },
  {
    index: 1,
    text: "Conformado por un equipo de profesionales altamente capacitados, Pinturas América S.A. ha logrado consolidarse como un referente técnico en el campo de los recubrimientos. Su experiencia abarca múltiples líneas, incluyendo la industrial, naval, petrolera, de pisos, metalmecánica, automotriz, arquitectónica y maderera. Esta diversidad ha permitido a la empresa ofrecer asesoramiento especializado y asistencia técnica adaptada a las necesidades específicas de cada cliente y proyecto, en los sectores público y privado.",
    bgColor: "#1E40AF", // blue-800
    textColor: "text-white",
    titleColor: "text-white",
    arrowBg: "bg-white/20 hover:bg-white/30",
    arrowColor: "text-white",
  },
  {
    index: 2,
    text: "En junio de 2020, en medio de la pandemia global, la empresa alcanzó un hito importante al trasladar su matriz al nuevo Parque Industrial de Pinturas América S.A. Este moderno complejo cuenta con instalaciones tecnológicas y ecológicas, incluyendo el laboratorio más completo del país para análisis de pinturas y recubrimientos, áreas recreativas para su personal y un amplio espacio para seguir expandiéndose. Este paso representa no solo un logro en infraestructura, sino también una reafirmación del compromiso con la innovación, la calidad y el crecimiento sostenible.",
    bgColor: "#172554", // blue-950
    textColor: "text-white",
    titleColor: "text-red-800", // Title RED-800
    arrowBg: "bg-white/20 hover:bg-white/30",
    arrowColor: "text-white",
  },
];
// --- Fin Datos ---

// --- Variante de Entrada (sin cambios) ---
const fadeInUp = {
  hidden: { opacity: 0, y: 25 }, // Ligero ajuste en Y
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.7, ease: "easeOut" },
  }),
};

const HistorySectionScroll: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // useEffect para reiniciar el índice cuando el componente sale de vista (sin cambios)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setActiveStepIndex((currentIndex) => {
            if (currentIndex !== 0) {
              console.log("Section out of view, resetting index.");
              return 0;
            }
            return currentIndex;
          });
        }
      },
      { threshold: 0.1 } // Umbral bajo para detectar salida
    );
    const sectionEl = sectionRef.current;
    if (sectionEl) observer.observe(sectionEl);
    return () => {
      if (sectionEl) observer.unobserve(sectionEl);
    };
  }, []); // Se ejecuta solo al montar

  // Función para avanzar y centrar (sin cambios)
  const goToNextStep = () => {
    if (activeStepIndex < historyStepsData.length - 1) {
      setActiveStepIndex((prevIndex) => prevIndex + 1);
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  };

  const currentStepData =
    historyStepsData[activeStepIndex] || historyStepsData[0];
  const isLastStep = activeStepIndex === historyStepsData.length - 1;

  return (
    <motion.section
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center overflow-hidden"
      animate={{ backgroundColor: currentStepData.bgColor }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      // Trigger de entrada para hijos
      initial="hidden"
      whileInView="visible"
      // --- CORREGIDO: Eliminado 'once: true' ---
      viewport={{ amount: 0.5 }} // Trigger al 50%, se reactiva cada vez
    >
      <div className="container mx-auto px-4 w-full">
        <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12 py-12 md:py-16">
          {/* Columna Izquierda */}
          <div
            className={cn(
              "w-full md:w-1/2 flex flex-col md:min-h-[60vh] lg:min-h-[50vh]",
              currentStepData.textColor
            )}
          >
            {/* Título */}
            <motion.h2
              className={cn(
                "text-4xl lg:text-5xl font-bold mb-6 lg:mb-8 shrink-0",
                currentStepData.titleColor
              )}
              custom={0} // Retraso de entrada
              variants={fadeInUp} // Variante de entrada
              // No necesita initial/animate aquí, hereda de 'whileInView' del padre
            >
              Historia
            </motion.h2>

            {/* Párrafo */}
            <motion.div
              className="relative flex-grow overflow-hidden min-h-[250px] md:min-h-[300px] mb-6"
              custom={0.6} // Retraso de entrada
              variants={fadeInUp} // Variante de entrada
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeStepIndex}
                  className="text-xl leading-relaxed absolute inset-0 text-justify"
                  initial={{ opacity: 0, x: -20 }} // Animación de actualización
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {currentStepData.text}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* Flecha */}
            {!isLastStep && (
              <motion.div
                className="flex justify-center w-full mt-4 h-12"
                custom={1.2} // Retraso de entrada
                variants={fadeInUp} // Variante de entrada
              >
                <motion.button
                  onClick={goToNextStep}
                  className={cn(
                    "rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent transition-colors",
                    currentStepData.arrowBg,
                    currentStepData.arrowColor,
                    "focus:ring-white"
                  )}
                  aria-label="Siguiente paso de la historia"
                  animate={{ y: [0, 8, -1, 4, 0] }} // Animación rebote
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                  whileHover={{
                    y: -3,
                    transition: { duration: 0.2, ease: "easeOut", repeat: 0 },
                  }} // Hover refinado
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowDown size={24} />
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Columna Derecha - Video */}
          <motion.div
            className="w-full md:w-1/2 flex items-center justify-center max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh]"
            custom={0} // Retraso de entrada (igual que título)
            variants={fadeInUp} // Variante de entrada
          >
            {/* VideoPlaceholder tiene su animación interna */}
            <VideoPlaceholder className="w-full max-w-md lg:max-w-lg shadow-lg" />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default HistorySectionScroll;
