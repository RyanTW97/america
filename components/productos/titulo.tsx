"use client";

import { motion } from "framer-motion";

export default function Titulo() {
  return (
    <div className="text-center mb-10">
      <h2 className="text-2xl  md:text-4xl lg:text-6xl font-extrabold tracking-widest font-archivo flex items-center justify-center gap-1 sm:gap-2">
        <motion.span
          className="text-blue-900"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          NUESTROS
        </motion.span>
        <motion.span
          className="text-white px-3 py-1 sm:px-4 md:px-5 sm:py-1.5"
          style={{
            backgroundColor: "#E5312A",
            borderTopLeftRadius: "20px",
            borderBottomRightRadius: "20px",
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          viewport={{ once: true }}
        >
          PRODUCTOS
        </motion.span>
      </h2>
    </div>
  );
}
