"use client";

import Image from "next/image";

const certificaciones = [
  {
    icon: "/9001.png",
    title: "ISO 9001",
    code: "TR-CQR-1592",
    label: "CALIDAD",
  },
  {
    icon: "/14001.png",
    title: "ISO 14001",
    code: "SA-CER440968",
    label: "AMBIENTE",
  },
  {
    icon: "/45001.png",
    title: "ISO 45001",
    code: "OS-CER440969",
    label: "SEGURIDAD Y SALUD",
  },
];

const responsabilidadSocial = [
  {
    icon: "/d1.png",
    label: "",
  },
  {
    icon: "/d2.png",
    label: "WORLDCOB RESPONSABILIDAD SOCIAL EMPRESARIAL",
  },
];

export default function CertificacionesISO() {
  return (
    <section className="relative w-full h-[540px]">
      {/* Imagen de fondo */}
      <Image
        src="/empresa.png"
        alt="Empresa"
        fill
        className="object-cover"
        priority
      />

      {/* Contenedor de los sellos sobrepuestos */}
      <div className="absolute bottom-[-150px] left-1/2 transform -translate-x-1/2 w-full px-8">
        <div className="flex flex-wrap justify-center gap-6  py-6 rounded-lg ">
          {certificaciones.map((cert, index) => (
            <div key={index} className="flex flex-col items-center w-48">
              <Image
                src={cert.icon}
                alt={cert.title}
                width={120}
                height={140}
                className="mb-2"
              />
              <p className="text-sm font-semibold text-center">{cert.code}</p>
              <p className="text-xs text-center text-gray-600">{cert.label}</p>
            </div>
          ))}
          {/* Bloque de los 2 sellos de responsabilidad social */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex gap-6 ">
              {responsabilidadSocial.map((item, index) => (
                <div key={index} className="flex flex-col items-center w-48">
                  <Image
                    key={index}
                    src={item.icon}
                    alt={`Responsabilidad Social ${index + 1}`}
                    width={120}
                    height={140}
                  />
                </div>
              ))}
            </div>
            <p className="text-md text-center text-gray-600">
              WORLDCOB RESPONSABILIDAD <br /> SOCIAL EMPRESARIAL
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
