"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const letters = "PROXIMAMENTE".split("");

const ProximamentePage = () => {
  return (
    <main className="flex justify-center items-center min-h-screen px-4 py-12 bg-white">
      <div className="relative max-w-[1200px] w-full  overflow-hidden ">
        {/* Imagen de fondo */}
        <Image
          src="/Proximamente.png" // asegúrate de que esté en /public
          alt="Proximamente"
          width={1200}
          height={666}
          className="w-full h-auto object-cover"
          priority
        />

        {/* Capa oscura solo sobre la imagen */}
        <div className="absolute inset-0 bg-black/50 z-10 rounded-4xl" />

        {/* Texto animado */}
        <div className="absolute inset-0 z-20 flex justify-center items-center">
          <h1 className="text-white text-5xl md:text-7xl font-extrabold flex space-x-2">
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.4,
                  ease: "easeOut",
                }}
              >
                {letter}
              </motion.span>
            ))}
          </h1>
        </div>
      </div>
    </main>
  );
};

export default ProximamentePage;
