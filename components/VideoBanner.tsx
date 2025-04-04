"use client";

import { Island_Moments } from "next/font/google";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const island = Island_Moments({ subsets: ["latin"], weight: "400" });

const text1 = "Pasión por";
const text2 = "La Calidad";

const VideoBanner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once: true }); // activa al 50% del componente

  const [displayText1, setDisplayText1] = useState("");
  const [displayText2, setDisplayText2] = useState("");
  const [showSecondLine, setShowSecondLine] = useState(false);

  // Máquina de escribir para la primera línea
  useEffect(() => {
    if (!isInView) return;
    let current = 0;
    const interval = setInterval(() => {
      setDisplayText1(text1.slice(0, current));
      current++;
      if (current > text1.length) {
        clearInterval(interval);
        setTimeout(() => setShowSecondLine(true), 300);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isInView]);

  // Máquina de escribir para la segunda línea
  useEffect(() => {
    if (!showSecondLine) return;
    let current = 0;
    const interval = setInterval(() => {
      setDisplayText2(text2.slice(0, current));
      current++;
      if (current > text2.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [showSecondLine]);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-visible px-8 pt-16 pb-16 md:pb-24 lg:pb-32 bg-cover bg-center"
      style={{ backgroundImage: "url('/fondo.png')" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center h-full">
        {/* Texto */}
        <div className="flex flex-col justify-center h-full text-left space-y-4 place-items-center transform -skew-y-6">
          {/* Primera línea */}
          {isInView && (
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`${island.className} text-8xl md:text-8xl lg:text-9xl leading-[1.1] text-[#18275A]`}
            >
              {displayText1}
            </motion.h2>
          )}

          {/* Segunda línea */}
          {showSecondLine && (
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`${island.className} text-8xl md:text-6xl lg:text-9xl leading-[1.1]`}
            >
              <span className="text-[#18275A]">{displayText2.slice(0, 3)}</span>
              <span className="text-red-600">{displayText2.slice(3)}</span>
            </motion.h2>
          )}
        </div>

        {/* Video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: showSecondLine ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full h-[250px] md:h-[300px] lg:h-[400px] bg-gray-400 flex items-center justify-center rounded-2xl"
        >
          <span className="text-white">[ Video Placeholder ]</span>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoBanner;
