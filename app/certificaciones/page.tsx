"use client";

import CertificacionesINEN from "./components/CertificacionesINEN";
import CertificacionesISO from "./components/CertificacionesISO";
import CertificadoGaleria from "./components/CertificadoGaleria";

const letters = "PROXIMAMENTE".split("");
function Certificaciones() {
  return (
    <main className="  min-h-screen ">
      <CertificacionesISO />
      <CertificacionesINEN />
      <CertificadoGaleria />
    </main>
  );
}

export default Certificaciones;
