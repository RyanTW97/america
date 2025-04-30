"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const ResponsabilidadSocial: React.FC = () => {
  return (
    <section className="w-full max-w-7xl mx-auto">
      {/* Hoja animada */}
      <div className="flex justify-center -my-10">
        <motion.div
          className="relative w-48 h-60"
          initial={{ opacity: 0, x: 40, y: -40, rotate: 15 }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            className="w-full h-full"
            animate={{
              x: [0, 15, 0, -15, 0],
              y: [0, 10, 20, 10, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src="/hoja.png"
              alt="Hoja verde"
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 868px) 40vw, 20vw"
              priority
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Título */}
      <motion.h2
        className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-center mb-12 font-archivo"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <span className="text-blue-900">RESPONSABILIDAD </span>
        <span className="text-red-600">SOCIAL</span>
      </motion.h2>

      {/* Contenido */}
      <div className="flex flex-col md:flex-row gap-10 items-start">
        {/* Columna izquierda */}
        <motion.div
          className="flex flex-col md:w-1/2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="text-base md:text-lg lg:text-xl text-gray-700 text-justify leading-relaxed tracking-wider font-archivo">
            Somos una empresa socialmente responsable, servimos a la sociedad
            con productos de alta calidad y a precios justos. Nuestros procesos
            industriales se orientan a la preservación de los recursos naturales
            disponibles, evitamos en lo posible cualquier tipo de contaminación.
            Nuestra mejora continua en los procesos de manufactura minimiza la
            generación de residuos y nos permiten hacer un uso racional de los
            recursos naturales y energéticos.
          </p>

          {/* Imagen */}
          <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-md">
            <Image
              src="/social.png"
              alt="Exterior de la empresa"
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </motion.div>

        {/* Columna derecha */}
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <ul className="list-disc list-inside space-y-5 text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed tracking-wider text-justify font-archivo">
            <li>
              Nuestro sistema de gestión ambiental está certificado bajo la
              Norma ISO 14001.
            </li>
            <li>
              Cumplimos con rigor las leyes, reglamentos y normativas que rigen
              nuestra actividad, somos respetuosos de los contratos y
              compromisos adquiridos tanto con nuestros clientes, trabajadores,
              proveedores y cualquier persona o institución con la que
              establecemos relaciones.
            </li>
            <li>
              Ofrecemos a nuestros trabajadores y colaboradores condiciones de
              trabajo dignas que favorecen la seguridad y salud laboral y su
              desarrollo humano y profesional, procurando la distribución
              equitativa de la riqueza generada. Buscamos siempre el crecimiento
              razonable de la empresa y su continuidad dentro de un ambiente de
              mantenimiento de la ética empresarial y lucha contra la
              corrupción.
            </li>
            <li>
              Contamos con la certificación de Seguridad y Salud Ocupacional ISO
              45001.
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default ResponsabilidadSocial;
