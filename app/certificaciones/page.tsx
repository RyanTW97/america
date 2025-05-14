import React from "react";
import CertificacionesISO from "./components/CertificacionesISO";
import CertificacionesINEN from "./components/CertificacionesINEN";
import ReconocimientosCarousel from "./components/ReconocimientosCarousel";
import CertificadosGaleria from "./components/CertificadoGaleria";
import Test from "@/components/Test";

function Certificaciones() {
  return (
    <div>
      <CertificacionesISO />
      <CertificacionesINEN />
      <ReconocimientosCarousel />
      <Test />
      <CertificadosGaleria />
    </div>
  );
}

export default Certificaciones;
