// app/layout.tsx
import type { Metadata } from "next";
import { Archivo, Island_Moments, Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans"; // Importación estándar para Geist Sans
import { GeistMono } from "geist/font/mono"; // Importación estándar para Geist Mono
import "./globals.css";
import NavbarWithOffset from "@/components/navbar/NavbarWithOffsets";
import Footer from "@/components/footer/Footer";

// Componentes para la funcionalidad de Favoritos
import { Toaster } from "@/components/ui/sonner";
import FavoritesSheet from "@/components/FavoritesSheet";
import StoreInitializer from "@/components/StoreInitializer";

// Fuentes personalizadas de Google Fonts
const island = Island_Moments({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-moments",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-archivo",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pinturas America",
  description: "La mejor calidad en pinturas.",
  // Directiva para que los robots en general no traduzcan la página
  robots: {
    notranslate: true,
  },
  // Directiva específica para Google (incluyendo Google Translate usado en Chrome)
  // para que no traduzca la página.
  // Next.js generará: <meta name="google" content="notranslate" />
  other: {
    google: "notranslate",
    // Alternativamente, podrías usar 'googlebot': 'notranslate'
    // Ambas son reconocidas, pero 'google' es a menudo más general para los servicios de Google.
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      {/* También podrías añadir la metaetiqueta directamente aquí si prefieres,
        aunque manejarlo a través del objeto metadata es más centralizado:
        <head>
          <meta name="google" content="notranslate" />
        </head>
      */}
      <body
        className={`
          ${archivo.variable}
          ${island.variable}
          ${inter.variable}
          ${GeistSans.variable} 
          ${GeistMono.variable} 
          antialiased
        `}
      >
        <StoreInitializer />
        <NavbarWithOffset>
          <div className="overflow-x-hidden">{children}</div>
          <Footer />
        </NavbarWithOffset>
        <Toaster richColors position="bottom-right" closeButton theme="light" />
        <FavoritesSheet />
      </body>
    </html>
  );
}
