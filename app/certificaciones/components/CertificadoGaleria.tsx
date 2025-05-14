"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CertificadosGaleria() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const certificados = Array.from({ length: 20 }, (_, i) => ({
    src: "/Certificado.png",
    texto1: `CERTIFICADO ${i + 1}`,
    texto2: "DESCRIPCIÓN",
  }));

  return (
    <>
      <div className="w-full text-center py-6 bg-white">
        <h2 className="text-2xl font-bold text-[#0D2B63]">CERTIFICACIONES</h2>
      </div>

      <section
        className="w-full min-h-screen bg-repeat-y bg-top bg-cover px-4 py-12"
        style={{
          backgroundImage: "url('/fondo-madera.png')",
        }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
          {certificados.map((cert, i) => (
            <Dialog key={i}>
              <DialogTrigger asChild>
                <div
                  className={`flex flex-col items-center text-center space-y-2 cursor-pointer transition-transform transform hover:scale-110 ${
                    i % 2 === 1 ? "mt-16" : ""
                  }`}
                  onClick={() => setSelectedImage(cert.src)}
                >
                  <Image
                    src={cert.src}
                    alt={`Certificado ${i + 1}`}
                    width={300}
                    height={380}
                    className="object-contain rounded-lg "
                  />
                  <p className="text-md font-bold text-blue-800 leading-tight">
                    {cert.texto1}
                  </p>
                  <p className="text-md text-blue-800 uppercase tracking-wide">
                    {cert.texto2}
                  </p>
                </div>
              </DialogTrigger>

              <DialogContent className="max-w-3xl">
                <DialogTitle />
                {selectedImage && (
                  <Image
                    src={selectedImage}
                    alt="Certificado ampliado"
                    width={600}
                    height={800}
                    className="w-full h-auto object-contain mt-4"
                  />
                )}
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </section>
    </>
  );
}
