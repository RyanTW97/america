"use client";

import Image from "next/image";

export default function ProductoDestacado() {
  return (
    <section
      style={{
        background:
          "linear-gradient(to right, #EEAD49 0%, #EEAD49 45%, #FAD653 55%, #FAD653 100%)",
      }}
      className="w-full px-6 py-10 md:px-12 md:py-16 my-12 rounded-br-[140px]"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Video */}
        <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-300 flex items-center justify-center">
          <video
            src="/imper.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* Imagen del producto */}
        <div className="flex justify-center">
          <Image
            src="/imper.webp"
            alt="Producto Impermlastic"
            width={780}
            height={1000}
            className="object-contain"
          />
        </div>

        {/* Texto + botón */}
        <div className="text-center md:text-left">
          <h2 className="font-archivo font-black text-4xl md:text-5xl text-blue-900">
            IMPERMLASTIC<span className="align-super text-sm">®</span>
          </h2>
          <p className="mt-4 text-xl text-gray-900 font-inter leading-relaxed">
            La solución definitiva en impermeabilización. Con tecnología
            avanzada, alta elasticidad y resistencia UV, protege tus superficies
            de la humedad y filtraciones. Ideal para techos, terrazas y más.
          </p>
          <p className="mt-2 font-bold font-inter text-lg">
            ¡Máxima durabilidad y calidad garantizada!
          </p>

          <a
            href="https://wa.link/fmvzgh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 px-8 py-4 text-base rounded-full bg-neutral-200 bg-opacity-90 border-2 border-blue-800 text-blue-800 font-semibold hover:bg-blue-800 hover:text-white transition"
          >
            COTIZAR PRODUCTO →
          </a>
        </div>
      </div>
    </section>
  );
}
