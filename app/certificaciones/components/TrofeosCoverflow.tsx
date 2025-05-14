"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

interface TrofeoCoverflowProps {
  onTrofeoChange?: (nombre: string) => void;
}

const trofeos = ["/t1.png", "/t2.png", "/t3.png", "/t4.png", "/t5.png"];
const nombres = [
  "Premio a la Excelencia",
  "Liderazgo Destacado",
  "Top Ventas",
  "Innovación Global",
  "Impacto Empresarial",
];

const destacadoVariants = {
  hidden: { opacity: 0, y: -30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.3 } },
};

export default function TrofeoCoverflow({
  onTrofeoChange,
}: TrofeoCoverflowProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [trofeoSeleccionado, setTrofeoSeleccionado] = useState(0);

  useEffect(() => {
    if (onTrofeoChange) {
      onTrofeoChange(nombres[trofeoSeleccionado]);
    }
  }, [trofeoSeleccionado, onTrofeoChange]);

  return (
    <div
      ref={ref}
      className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-7xl flex flex-col items-center"
    >
      <AnimatePresence mode="wait">
        {isInView && (
          <motion.div
            key={trofeoSeleccionado}
            variants={destacadoVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative mb-10 flex flex-col items-center"
          >
            <div className="relative w-[400px] h-[300px] z-10">
              <Image
                src={trofeos[trofeoSeleccionado]}
                alt="Trofeo destacado"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isInView && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="flex gap-6"
        >
          {trofeos.map((src, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.4, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              onMouseEnter={() => setTrofeoSeleccionado(index)}
              className="w-[120px] h-[160px] relative cursor-pointer"
            >
              <Image
                src={src}
                alt={`Trofeo ${index + 1}`}
                fill
                className="object-contain"
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
