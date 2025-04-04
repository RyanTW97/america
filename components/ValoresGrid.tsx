"use client";

import { Medal, Headset, Truck, Leaf } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Medal,
    title: "CALIDAD",
    description:
      "Garantizamos que los productos cumplan con los más altos estándares.",
  },
  {
    icon: Headset,
    title: "ATENCIÓN AL CLIENTE",
    description:
      "Nuestro equipo está siempre disponible para brindarte asesoría experta.",
  },
  {
    icon: Truck,
    title: "LOGÍSTICA",
    description:
      "Contamos con un sistema eficiente de distribución a nivel nacional.",
  },
  {
    icon: Leaf,
    title: "MEDIO AMBIENTE",
    description:
      "Desarrollamos productos con la mejor tecnología ambiental sin comprometer la calidad.",
  },
];

const ValoresGrid = () => {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-12">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            className="bg-[#18275A] text-white p-4 sm:p-5 md:p-6 rounded-2xl flex flex-col items-center text-center space-y-3 sm:space-y-4 shadow-md hover:shadow-xl transition-shadow"
          >
            {/* Icon responsive */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              whileHover={{ scale: 1.1 }}
            >
              <feature.icon className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12" />
            </motion.div>

            {/* Titulo responsive */}
            <h3 className="font-bold text-base sm:text-lg lg:text-xl">
              {feature.title}
            </h3>

            {/* Descripción responsive */}
            <p className="text-xs sm:text-sm md:text-sm">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ValoresGrid;
