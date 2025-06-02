"use client";

import Link from "next/link";

const Lineas = () => {
  // Array of objects containing the label and the corresponding href
  const lineasData = [
    {
      label: "Arquitectónica",
      href: "/nuestros-productos?lineas=linea-arquitectonica&page=1",
    },
    {
      label: "Metalmecánica",
      href: "#", // As per previous structure
    },
    {
      label: "Industrial", // Corresponds to "Línea Protective Coatings" or original "INDUSTRIAL"
      href: "/nuestros-productos?page=1&lineas=linea-industrial",
    },
    {
      label: "Automotriz",
      href: "/nuestros-productos?page=1&lineas=linea-automotriz",
    },
    {
      label: "Pisos Epóxicos", // Corresponds to "Línea Pisos Industriales" or original "PISOS EPÓXICOS"
      href: "/nuestros-productos?page=1&lineas=pisos-epoxicos",
    },
    {
      label: "Madera",
      href: "/nuestros-productos?page=1&lineas=linea-madera",
    },
    {
      label: "Demarcación Vial",
      href: "/nuestros-productos?page=1&lineas=demarcacion-vial",
    },
    {
      label: "Especial",
      href: "/nuestros-productos?page=1&lineas=especiales",
    },
  ];

  return (
    <div className="flex flex-col gap-4 items-center">
      <h3 className="font-extrabold text-2xl mb-2">NUESTRAS LÍNEAS</h3>
      <div className="grid grid-cols-2 gap-x-20 gap-y-3 text-base">
        {lineasData.map((linea) => (
          // Each item is now a Next.js Link
          <Link
            key={linea.label}
            href={linea.href}
            className=" hover:text-blue-400 cursor-pointer" // Added hover:text-red-600
          >
            {linea.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Lineas;
