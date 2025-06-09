"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Certificate {
  name: string;
  imageSrc: string;
  fit?: "cover" | "contain";
}

const certificateData: Certificate[] = [
  { name: "Acrilmax Mate", imageSrc: "/AcrilmaxMate.webp" },
  { name: "Acrylatex Mate", imageSrc: "/AcrylatexMate.webp" },
  { name: "Airlux Brillante", imageSrc: "/AirluxBrillante.webp" },
  { name: "Baroxinc Mate", imageSrc: "/BaroxincMate.webp" },
  {
    name: "Demarcar Acrílica Amarillo",
    imageSrc: "/DemarcarAcrilicaAmarillo.webp",
  },
  {
    name: "Demarcar Acrílica Blanco",
    imageSrc: "/DemarcarAcrilicaBlanco.webp",
  },
  {
    name: "Demarcar Alquídica Amarillo",
    imageSrc: "/DemarcarAlquidicaAmarillo.webp",
  },
  { name: "Globalcryl Semimate", imageSrc: "/GlobalcrylSemimate.webp" },
  { name: "IntraLátex Mate", imageSrc: "/IntraLatexMate.webp" },
  { name: "Megalux Brillante", imageSrc: "/MegaluxBrillante.webp" },
  { name: "Oxifer Mate", imageSrc: "/OxiferMate.webp" },
  { name: "RSE", imageSrc: "/RSE.webp" },
  { name: "Empresa Segura", imageSrc: "/EmpresaSegura.webp", fit: "contain" },
  {
    name: "Certificado CEER",
    imageSrc: "/CertificadoCEER.webp",
    fit: "contain",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

const CertificadoGaleria: React.FC = () => {
  const [selectedCertificate, setSelectedCertificate] =
    React.useState<Certificate | null>(null);

  const handleImageClick = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedCertificate(null);
    }
  };

  return (
    <Dialog open={!!selectedCertificate} onOpenChange={handleOpenChange}>
      <div
        className="w-full bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/fondo-madera.webp')" }}
      >
        <div className="min-h-screen w-full bg-black/35 p-4 sm:p-8">
          <div className="mx-auto max-w-screen-2xl">
            <header className="mb-12 text-center">
              <h1 className="text-4xl font-bold p-10 text-blue-700 drop-shadow-lg md:text-5xl">
                CERTIFICACIONES
              </h1>
            </header>
            <motion.main
              className="grid grid-cols-1 gap-y-20 gap-x-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {certificateData.map((cert) => (
                <DialogTrigger asChild key={cert.name}>
                  <motion.div
                    variants={itemVariants}
                    className="group flex cursor-pointer flex-col items-center text-center"
                    onClick={() => handleImageClick(cert)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      handleImageClick(cert)
                    }
                  >
                    <div className="relative w-full">
                      <div className="absolute -top-[70px] z-20 h-40 w-full">
                        <img
                          src="/fondoluz.webp"
                          alt="Efecto de luz"
                          className="h-full w-full object-contain object-center"
                        />
                      </div>
                      <div className="relative z-10 aspect-[569/711] w-full overflow-hidden rounded-lg  p-2 transition-transform duration-300 ease-in-out group-hover:scale-105">
                        <img
                          src={cert.imageSrc}
                          alt={`Certificado de ${cert.name}`}
                          className={`h-full w-full ${
                            cert.fit === "contain"
                              ? "object-contain"
                              : "object-cover"
                          }`}
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <h2 className="mt-4 font-semibold text-white transition-colors duration-300 group-hover:text-blue-800">
                      {cert.name}
                    </h2>
                  </motion.div>
                </DialogTrigger>
              ))}
            </motion.main>
          </div>
        </div>
      </div>
      {selectedCertificate && (
        <DialogContent className="flex h-full max-h-[90vh] w-[90vw] max-w-7xl items-center justify-center border-none bg-transparent p-0 shadow-none [&>button]:hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedCertificate.name}</DialogTitle>
          </DialogHeader>
          <div className="relative h-full w-full">
            <img
              src={selectedCertificate.imageSrc}
              alt={`Vista ampliada del certificado de ${selectedCertificate.name}`}
              className="h-full w-full object-contain"
            />
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default CertificadoGaleria;
