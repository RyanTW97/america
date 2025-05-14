"use client";

import Image from "next/image";

const inenCerts = [
  { src: "/inen-1544.png", alt: "INEN 1544" },
  { src: "/inen-1042-1.png", alt: "INEN 1042-1" },
  { src: "/inen-1043.png", alt: "INEN 1043" },
  { src: "/inen-2094.png", alt: "INEN 2094" },
];

export default function CertificacionesINEN() {
  return (
    <section className="w-full pt-40 px-4 bg-white">
      <div className="flex flex-wrap justify-center items-center gap-10">
        {inenCerts.map((img, index) => (
          <div key={index} className="w-[180px] h-auto flex justify-center">
            <Image
              src={img.src}
              alt={img.alt}
              width={180}
              height={140}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
