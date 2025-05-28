"use client";

import PageBannerImage from "@/components/pageBannerImage";
import ContactForm from "./components/ContactForm";
import ContactDetails from "./components/ContactDetails";
import LocationMap from "./components/LocationMap";
import { motion } from "framer-motion";

// Variantes para la animación fade-up
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function Page() {
  return (
    <div>
      <PageBannerImage
        src="/contactos.png"
        alt="Vista exterior de las instalaciones de la empresa"
        priority={true}
      />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <ContactForm />
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <ContactDetails />
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <LocationMap />
      </motion.div>
    </div>
  );
}
