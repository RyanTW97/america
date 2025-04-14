"use client";

import { Island_Moments } from "next/font/google";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const island = Island_Moments({ subsets: ["latin"], weight: "400" });

const text1 = "Pasión por";
const text2 = "La Calidad";

const VideoBanner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once: true });

  const [index1, setIndex1] = useState(0);
  const [index2, setIndex2] = useState(0);
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [triggerCalidadEffect, setTriggerCalidadEffect] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    if (index1 < text1.length) {
      const timeout = setTimeout(() => {
        setIndex1((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => setShowSecondLine(true), 300);
    }
  }, [index1, isInView]);

  useEffect(() => {
    if (!showSecondLine) return;
    if (index2 < text2.length) {
      const timeout = setTimeout(() => {
        setIndex2((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => setTriggerCalidadEffect(true), 650); // delay opcional
    }
  }, [index2, showSecondLine]);

  const letterVariant = {
    hidden: { opacity: 0, scale: 1.2 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <section
      ref={ref}
      className="relative w-full overflow-visible px-8 pt-16 pb-16 md:pb-24 lg:pb-32 bg-cover bg-center"
      style={{ backgroundImage: "url('/fondo.png')" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center h-full">
        {/* Texto */}
        <div className="flex flex-col justify-center h-full text-left space-y-8 place-items-center transform -skew-y-6 min-h-[300px]">
          {/* Línea 1 */}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`${island.className} relative text-8xl md:text-8xl lg:text-9xl leading-[1.1] text-[#18275A] min-h-[100px]`}
          >
            <span className="invisible">{text1}</span>
            <span className="absolute left-0 top-0 flex">
              {text1.split("").map((char, i) => (
                <motion.span
                  key={i}
                  variants={letterVariant}
                  initial="hidden"
                  animate={i < index1 ? "visible" : "hidden"}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className={char === " " ? "inline-block w-4" : ""}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
          </motion.h2>

          {/* Línea 2 */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: showSecondLine ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className={`${island.className} relative text-8xl md:text-6xl lg:text-9xl leading-[1.1] min-h-[100px]`}
          >
            <span className="invisible">
              <span className="text-[#18275A]">{text2.slice(0, 3)}</span>
              <span className="text-red-600">{text2.slice(3)}</span>
            </span>
            <span className="absolute left-0 top-0 flex">
              {text2.split("").map((char, i) => {
                const isAfter = i >= 3;
                const allLettersShown = triggerCalidadEffect;

                const animatedChar =
                  allLettersShown && isAfter ? (
                    <motion.span
                      key={i}
                      animate={{
                        rotate: [0, 1.5, -1.5, 0],
                        textShadow: [
                          "0px 0px 0px red",
                          "0px 0px 8px red",
                          "0px 0px 0px red",
                        ],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        repeatDelay: 0.5,
                        ease: "easeInOut",
                      }}
                      className="text-red-600"
                    >
                      {char}
                    </motion.span>
                  ) : (
                    <motion.span
                      key={i}
                      variants={letterVariant}
                      initial="hidden"
                      animate={i < index2 ? "visible" : "hidden"}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className={`${char === " " ? "inline-block w-4" : ""} ${
                        i < 3 ? "text-[#18275A]" : "text-red-600"
                      }`}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  );

                return animatedChar;
              })}
            </span>
          </motion.h2>
        </div>

        {/* Video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: showSecondLine ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full h-[250px] md:h-[300px] lg:h-[400px] bg-gray-400 flex items-center justify-center rounded-2xl overflow-hidden"
        >
          <video
            src="/videobanner.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default VideoBanner;
