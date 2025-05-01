"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const HeaderTrabajaConNosotros = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative w-full h-[300px] sm:h-[380px] md:h-[450px] lg:h-[520px]">
        <Image
          src="/trabajaNosotros.png"
          alt="Trabaja con nosotros"
          width={1440}
          height={540}
          sizes="100vw"
          className="w-full h-full object-cover"
          priority
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h1
            className="text-white text-center font-extrabold font-archivo text-2xl sm:text-4xl lg:text-6xl flex flex-row items-center gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.4,
                },
              },
            }}
          >
            <motion.span
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6 }}
            >
              TRABAJA CON
            </motion.span>

            <motion.span
              className="bg-red-600 text-white px-4 py-2 
                         rounded-tl-[30px] rounded-br-[30px]"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              NOSOTROS
            </motion.span>
          </motion.h1>
        </div>
      </div>
    </div>
  );
};

export default HeaderTrabajaConNosotros;
