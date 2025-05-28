// app/QuienesSomos/page.tsx

"use client";

import { motion } from "framer-motion";
import PageBannerImage from "../../components/pageBannerImage";
import AboutIntro from "./components/AboutIntro";
import HistorySectionScroll from "./components/HistorySectionScroll";
import VisionPolitica from "./components/VisionPolitica";
import ResponsabilidadSocial from "./components/ResponsabilidadSocial";
import Certificaciones from "./components/Certificaciones";

export default function QuienesSomosPage() {
  return (
    <main>
      <PageBannerImage
        src="/empresa.webp"
        alt="Vista exterior de las instalaciones de la empresa"
        priority={true}
      />

      <section className="w-full max-w-7xl mx-auto px-4">
        <AboutIntro />
        <div id="historia" className="relative -top-32 h-0" />
        <HistorySectionScroll />

        <motion.div
          className="w-full max-w-7xl mx-auto py-6"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.6 }}
        >
          <div className="flex">
            <h1 className="font-extrabold text-3xl md:text-4xl lg:text-5xl text-red-500 mb-4 font-archivo">
              MISIÓN
            </h1>
            <hr />
          </div>

          <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed text-justify font-archivo">
            Diseñar, fabricar y comercializar pinturas y/o recubrimientos de
            alta calidad y valor agregado; utilizando tecnología avanzada,
            materias primas selectas y talento humano calificado y comprometido
            con el mejoramiento continuo del desempeño global de la
            organización, a fin de satisfacer las necesidades y expectativas de
            nuestros clientes, proteger el medio ambiente, contribuir al
            desarrollo del Ecuador y lograr el crecimiento y rentabilidad de la
            organización.
          </p>
        </motion.div>

        <VisionPolitica />
        <ResponsabilidadSocial />
        <Certificaciones />
      </section>
    </main>
  );
}
