"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// Los datos de los sellos se mantienen igual.
const certificaciones = [
  {
    icon: "/ISO-9001.webp",
    title: "ISO 9001",
    code: "TR-CQR-1592",
    label: "CALIDAD",
  },
  {
    icon: "/ISO-14001.webp",
    title: "ISO 14001",
    code: "SA-CER440968",
    label: "AMBIENTE",
  },
  {
    icon: "/ISO-45001.webp",
    title: "ISO 45001",
    code: "OS-CER440969",
    label: "SEGURIDAD Y SALUD",
  },
];

const responsabilidadSocial = [
  {
    icon: "/d1.png",
    label: "",
  },
  {
    icon: "/d2.png",
    label: "WORLDCOB RESPONSABILIDAD SOCIAL EMPRESARIAL",
  },
];

// Las variantes de animación no necesitan cambios.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Un poco más rápido para mejor sensación en móvil
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function CertificacionesISO() {
  return (
    // --- CONTENEDOR DE SECCIÓN RESPONSIVE ---
    // Móvil: Altura más corta y margen inferior para dejar espacio a los sellos de abajo.
    // Desktop (lg): Vuelve a la altura original y quita el margen.
    <section className="relative w-full h-[400px] mb-48 lg:h-[540px] lg:mb-0">
      <Image
        src="/empresa.webp"
        alt="Imagen de fondo de la empresa"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* --- CONTENEDOR DE SELLOS RESPONSIVE ---
          Este es el cambio principal.
          - Móvil (default): Es una columna (`flex-col`) para apilar los grupos de sellos.
            Se posiciona más abajo (`bottom-[-220px]`) para que quepa todo.
          - Desktop (lg): Cambia a fila (`lg:flex-row`) y a la alineación y posición originales.
      */}
      <motion.div
        className="absolute w-full px-4 transform -translate-x-1/2 left-1/2
                   flex flex-col items-center gap-y-8
                   bottom-[-220px]
                   lg:flex-row lg:items-baseline lg:justify-center lg:gap-x-6 lg:bottom-[-150px]"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* --- GRUPO 1: SELLOS ISO (AHORA EN SU PROPIO CONTENEDOR FLEX) --- */}
        <motion.div
          className="flex justify-center items-baseline gap-3 lg:gap-6"
          variants={itemVariants}
        >
          {certificaciones.map((cert) => (
            <div
              key={cert.title}
              className="flex flex-col items-center text-center w-24 lg:w-48"
            >
              {/* Contenedor de imagen con tamaño responsive */}
              <div className="relative w-full h-24 lg:h-36">
                <Image
                  src={cert.icon}
                  alt={cert.title}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-xs font-semibold text-center mt-2 lg:text-sm">
                {cert.code}
              </p>
              <p className="text-[10px] text-center text-gray-600 lg:text-xs">
                {cert.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* --- GRUPO 2: SELLOS WORLDCOB --- */}
        <motion.div
          className="flex flex-col items-center space-y-2"
          variants={itemVariants}
        >
          <div className="flex gap-4 lg:gap-6">
            {responsabilidadSocial.map((item, index) => (
              // Contenedor de imagen con tamaño responsive
              <div key={index} className="relative h-24 w-24 lg:h-36 lg:w-32">
                <Image
                  src={item.icon}
                  alt={`Responsabilidad Social ${index + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-center text-gray-600 lg:text-md">
            WORLDCOB RESPONSABILIDAD <br className="hidden lg:block" /> SOCIAL
            EMPRESARIAL
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
