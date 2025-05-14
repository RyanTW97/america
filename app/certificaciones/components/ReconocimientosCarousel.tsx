"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const trofeos = ["/t1.png", "/t2.png", "/t3.png", "/t4.png", "/t5.png"];

export default function ReconocimientosCarrusel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [positions, setPositions] = useState<
    { x: number; y: number; scale: number; z: number }[]
  >([]);

  const total = trofeos.length;
  const radius = 240;
  const angleStep = (2 * Math.PI) / total;

  useEffect(() => {
    const newPositions = trofeos.map((_, index) => {
      const position = (index - activeIndex + total) % total;
      const angle = position * angleStep;
      const x = Math.sin(angle) * radius;
      const y = Math.cos(angle) * 50;
      const scale = position === 0 ? 1.5 : 1;
      const z = total - position;
      return { x, y, scale, z };
    });
    setPositions(newPositions);
  }, [activeIndex, total]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 4000);
    return () => clearInterval(interval);
  }, [total]);

  const rotateLeft = () => setActiveIndex((prev) => (prev - 1 + total) % total);

  const rotateRight = () => setActiveIndex((prev) => (prev + 1) % total);

  return (
    <>
      {/* Título afuera */}
      <div className="w-full text-center py-6 bg-white">
        <h2 className="text-2xl font-bold text-red-600">RECONOCIMIENTOS</h2>
      </div>

      {/* Carrusel */}
      <section className="relative w-full h-[560px] flex items-center justify-center bg-white overflow-hidden">
        {/* Trofeos */}
        <div className="relative w-[700px] h-[320px] z-10">
          {positions.map(({ x, y, scale, z }, index) => (
            <div
              key={index}
              className="absolute transition-all duration-700"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translateX(${x}px) translateY(${y}px) scale(${scale})`,
                zIndex: z,
              }}
            >
              <Image
                src={trofeos[index]}
                alt={`Trofeo ${index + 1}`}
                width={150}
                height={200}
                className="object-contain"
              />
            </div>
          ))}
        </div>

        {/* Podio más grande + flechas dentro */}
        <div className="absolute bottom-0 z-0 flex items-center justify-center gap-12">
          <button
            onClick={rotateLeft}
            className="bg-white/80 p-2 rounded-full shadow hover:bg-white z-10"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <Image
            src="/podio.png"
            alt="Podio"
            width={650}
            height={250}
            className="object-contain "
          />

          <button
            onClick={rotateRight}
            className="bg-white/80 p-2 rounded-full shadow hover:bg-white z-10"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </section>
    </>
  );
}
