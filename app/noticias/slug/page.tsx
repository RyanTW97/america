import Image from "next/image";
import Titulo from "@/components/generales/titulo";
import { loremIpsum } from "lorem-ipsum";
import NoticiasCarousel from "@/components/news/Noticias";

export default function NoticiaIndividual() {
  const textoSuperior = loremIpsum({ count: 3, units: "paragraphs" });
  const textoMedio = loremIpsum({ count: 1, units: "paragraphs" });
  const textoInferior = loremIpsum({ count: 3, units: "paragraphs" });

  return (
    <main className="max-w-6xl mx-auto  py-10 space-y-14 font-archivo">
      {/* Título */}
      <Titulo azul="25 AÑOS DE" blanco="PINTURAS AMÉRICA" />

      {/* Bloque 1: Imagen izquierda, texto derecha */}
      <section className="grid md:grid-cols-2 gap-6 items-stretch">
        <div>
          <Image
            src="/noticia-1.png"
            alt="Noticia"
            width={500}
            height={350}
            className="rounded-2xl w-full h-96 object-cover"
          />
        </div>

        <div className="h-96 flex flex-col justify-between overflow-y-auto text-gray-800 text-[16px] leading-relaxed text-justify pr-2">
          <div className="flex-grow flex items-stretch">
            <p className="flex-grow">{textoSuperior}</p>
          </div>
        </div>
      </section>

      {/* Bloque 2: Texto completo */}
      <section className="text-gray-800 text-[16px] leading-relaxed text-justify space-y-4">
        <p>{textoMedio}</p>
      </section>

      {/* Bloque 3: Texto izquierda, imagen derecha */}
      <section className="grid md:grid-cols-2 gap-6 items-stretch">
        <div className="h-96 flex flex-col justify-between overflow-y-auto text-gray-800 text-[16px] leading-relaxed text-justify pr-2 order-2 md:order-1">
          <div className="flex-grow flex items-stretch">
            <p className="flex-grow">{textoInferior}</p>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <Image
            src="/noticia-1.png"
            alt="Noticia"
            width={600}
            height={400}
            className="rounded-2xl w-full h-96 object-cover"
          />
        </div>
      </section>
      <NoticiasCarousel />
    </main>
  );
}
