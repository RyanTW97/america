// app/QuienesSomos/page.tsx

import PageBannerImage from "./components/pageBannerImage"; // Corregido: Asegúrate que el nombre del archivo coincide (PageBannerImage.tsx)
import AboutIntro from "./components/AboutIntro";
import HistorySectionScroll from "./components/HistorySectionScroll";

// Solo UNA definición de la función del componente de página
export default function QuienesSomosPage() {
  // Definimos la constante DENTRO de la función
  const introText =
    "En Pinturas América S.A. contamos con más de 25 años de experiencia en la elaboración y comercialización de recubrimientos orgánicos e inorgánicos como pinturas, resinas, tintas y disolventes. Atendemos los sectores industrial, naval, petrolero, automotriz, arquitectónico, entre otros, brindando asesoría técnica especializada y productos de alta calidad. Nuestra planta matriz, ubicada en un parque industrial moderno y ecológico, cuenta con el laboratorio más completo del país, reflejando nuestro compromiso con la innovación, la sostenibilidad y el crecimiento constante.";

  // El return con el JSX
  return (
    // Contenedor principal
    <main className="w-full">
      {/* === Sección del Banner === */}
      <PageBannerImage
        src="/empresa.png" // Ruta a tu imagen en la carpeta /public
        alt="Vista exterior de las instalaciones de la empresa" // Describe la imagen
        priority={true} // Priorizar carga
      />

      {/* === Sección Introductoria === */}
      {/* Contenedor para centrar y añadir padding */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <AboutIntro
          titleBlueText="SOBRE"
          titleRedText="NOSOTROS"
          introParagraph={introText}
        />
      </div>
      <div>
        <HistorySectionScroll />
      </div>
    </main> // Cierre de <main>
  ); // Cierre de return
} // Cierre de la función QuienesSomosPage
