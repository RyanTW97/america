// app/layout.tsx
import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Archivo,
  Island_Moments,
  Inter,
} from "next/font/google";
import "./globals.css";
import NavbarWithOffset from "@/components/navbar/NavbarWithOffsets";
import Footer from "@/components/footer/Footer";

// Fuentes personalizadas
const island = Island_Moments({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-moments",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "700", "900"], // Ahora incluye Archivo Black
  variable: "--font-archivo",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pinturas America",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${archivo.variable}
          ${island.variable}
          ${inter.variable}
          antialiased
        `}
      >
        <NavbarWithOffset>
          <div className="overflow-x-hidden">{children}</div>
          <Footer />
        </NavbarWithOffset>
      </body>
    </html>
  );
}
