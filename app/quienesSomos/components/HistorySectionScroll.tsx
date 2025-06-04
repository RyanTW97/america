// components/HistorySectionScroll.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Ya no importamos VideoPlaceholder
// import VideoPlaceholder from "./VideoPlaceholder";

const historySteps = [
  {
    text: "Pinturas América S.A. es una Sociedad Anónima constituida el 10 de febrero de 1997, con un enfoque claro en la elaboración, compraventa, importación, exportación y comercialización de una amplia gama de productos de recubrimiento, tanto orgánicos como inorgánicos. Su catálogo incluye pinturas, resinas, tintas, disolventes, diluyentes y tratamientos especiales para diversas industrias, ya sea en estado manufacturado o en bruto. Desde sus inicios, la empresa ha mantenido una visión integral para atender múltiples sectores con soluciones de alta calidad.",
  },
  {
    text: "Conformado por un equipo de profesionales altamente capacitados, Pinturas América S.A. ha logrado consolidarse como un referente técnico en el campo de los recubrimientos. Su experiencia abarca múltiples líneas, incluyendo la industrial, naval, petrolera, de pisos, metalmecánica, automotriz, arquitectónica y maderera. Esta diversidad ha permitido a la empresa ofrecer asesoramiento especializado y asistencia técnica adaptada a las necesidades específicas de cada cliente y proyecto, en los sectores público y privado.",
  },
  {
    text: "En junio de 2020, en medio de la pandemia global, la empresa alcanzó un hito importante al trasladar su matriz al nuevo Parque Industrial de Pinturas América S.A. Este moderno complejo cuenta con instalaciones tecnológicas y ecológicas, incluyendo el laboratorio más completo del país para análisis de pinturas y recubrimientos, áreas recreativas para su personal y un amplio espacio para seguir expandiéndose. Este paso representa no solo un logro en infraestructura, sino también una reafirmación del compromiso con la innovación, la calidad y el crecimiento sostenible.",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.7, ease: "easeOut" },
  }),
};

const HistorySectionScroll = () => {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null); // Ref para el elemento de video

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setActiveStep(0);
          videoRef.current?.pause(); // Pausar video si la sección no está visible
        } else {
          videoRef.current
            ?.play()
            .catch((error) =>
              console.log("Error al intentar reproducir video:", error)
            ); // Reproducir video cuando la sección es visible
        }
      },
      { threshold: 0.1 } // Ajustar umbral según necesidad
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < historySteps.length - 1 ? prev + 1 : 0));
    }, 10000); // 10 segundos para cambio de texto
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    setActiveStep(index);
    // Opcional: hacer scroll a la sección si se hace clic en un punto
    // sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <motion.section
      ref={sectionRef}
      className="relative w-full py-16 overflow-hidden bg-white text-gray-800 scroll-mt-20 md:scroll-mt-24" // Ajustado scroll-mt
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.2 }} // Umbral para activar la animación
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Sección de Texto */}
          <div className="w-full md:w-1/2">
            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-800 mb-6 font-archivo"
              custom={0}
              variants={fadeInUp}
            >
              Nuestra Historia
            </motion.h2>

            <motion.div
              className="relative min-h-[280px] sm:min-h-[300px] md:min-h-[320px] mb-6" // Altura mínima ajustada
              custom={0.3} // Retraso ajustado
              variants={fadeInUp}
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeStep}
                  className="text-base md:text-lg leading-relaxed text-justify font-archivo text-gray-700" // Color de texto ajustado
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {historySteps[activeStep].text}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* Puntos de Navegación */}
            <div className="flex justify-center items-center gap-3 mt-8 md:mt-6">
              {historySteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Ir al paso de historia ${index + 1}`}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    index === activeStep
                      ? "bg-blue-800 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Sección de Video */}
          <motion.div
            className="w-full md:w-1/2 flex items-center justify-center mt-8 md:mt-0"
            custom={0} // Animación al mismo tiempo que el título o ligeramente después
            variants={fadeInUp}
          >
            <div className="w-full max-w-md lg:max-w-lg rounded-lg overflow-hidden shadow-2xl aspect-video">
              <video
                ref={videoRef}
                src="/videobanner.mp4" // Ruta al video en la carpeta public
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline // Importante para autoplay en móviles, especialmente iOS
                preload="metadata" // Ayuda a cargar metadatos del video rápidamente
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default HistorySectionScroll;
