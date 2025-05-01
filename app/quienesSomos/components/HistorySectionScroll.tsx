"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VideoPlaceholder from "./VideoPlaceholder";

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setActiveStep(0);
      },
      { threshold: 0.1 }
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
    }, 22000);
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    setActiveStep(index);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <motion.section
      id="historia"
      ref={sectionRef}
      className="relative w-full py-16 overflow-hidden bg-white text-gray-800 scroll-mt-80"
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.5 }}
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-800 mb-6 font-archivo"
              custom={0}
              variants={fadeInUp}
            >
              Historia
            </motion.h2>

            <motion.div
              className="relative min-h-[250px] md:min-h-[300px] mb-6 pb-20 md:pb-6"
              custom={0.6}
              variants={fadeInUp}
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeStep}
                  className="text-base md:text-lg lg:text-xl leading-relaxed absolute inset-0 text-justify font-archivo"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {historySteps[activeStep].text}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            <div className="flex justify-center gap-3 mt-24 md:mt-14 lg:mt-10">
              {historySteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Ir al paso ${index + 1}`}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeStep
                      ? "bg-blue-800 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Video */}
          <motion.div
            className="w-full md:w-1/2 flex items-center justify-center max-h-[60vh]"
            custom={0}
            variants={fadeInUp}
          >
            <VideoPlaceholder className="w-full max-w-md lg:max-w-lg shadow-lg" />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default HistorySectionScroll;
