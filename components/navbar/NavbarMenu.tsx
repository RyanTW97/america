"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"; // Asegúrate que esta ruta sea correcta
import { useState } from "react";

export const NavbarMenu = () => {
  const pathname = usePathname();

  const [quienesOpen, setQuienesOpen] = useState(false);
  const [productosOpen, setProductosOpen] = useState(false);
  const [capacitacionOpen, setCapacitacionOpen] = useState(false);

  const baseLink =
    "font-archivo font-semibold inline-block relative transition-transform duration-300 hover:scale-105";
  const underline =
    "absolute left-0 -bottom-1 h-[2px] w-full origin-left transform bg-red-500 transition-transform duration-300";

  // Enlaces para "NUESTROS PRODUCTOS" con los parámetros de consulta correctos
  const productosLinks = [
    {
      label: "Línea Arquitectónica",
      href: "/nuestros-productos?lineas=linea-arquitectonica&page=1",
    },
    {
      label: "Línea Metalmecánica",
      href: "#", // Según la data original, este es un placeholder
    },
    {
      label: "Línea Madera",
      href: "/nuestros-productos?page=1&lineas=linea-madera", // URL corregida
    },
    {
      label: "Línea Automotriz",
      href: "/nuestros-productos?page=1&lineas=linea-automotriz",
    },
    {
      label: "Línea Protective Coatings", // Corresponde a "INDUSTRIAL"
      href: "/nuestros-productos?page=1&lineas=linea-industrial",
    },
    {
      label: "Línea Demarcación Vial",
      href: "/nuestros-productos?page=1&lineas=demarcacion-vial",
    },
    {
      label: "Línea Pisos Industriales", // Corresponde a "PISOS EPÓXICOS"
      href: "/nuestros-productos?page=1&lineas=pisos-epoxicos",
    },
    {
      label: "Línea Especial",
      href: "/nuestros-productos?page=1&lineas=especiales",
    },
  ];

  return (
    <ul className="hidden lg:text-sm xl:text-base lg:flex gap-8 items-center">
      {/* INICIO */}
      <li>
        <Link href="/" className={baseLink}>
          INICIO
          <span
            className={`${underline} ${
              pathname === "/" ? "scale-x-100" : "scale-x-0"
            }`}
          />
        </Link>
      </li>
      {/* QUIENES SOMOS */}
      <li className="relative">
        <div
          onMouseEnter={() => setQuienesOpen(true)}
          onMouseLeave={() => setQuienesOpen(false)}
          className="inline-flex"
        >
          <Popover open={quienesOpen} onOpenChange={setQuienesOpen}>
            <PopoverTrigger asChild>
              <span className={`${baseLink} py-2 cursor-pointer`}>
                <Link href="/quienesSomos">QUIENES SOMOS</Link>
                <span
                  className={`${underline} ${
                    pathname.startsWith("/quienesSomos")
                      ? "scale-x-100"
                      : "scale-x-0"
                  }`}
                />
              </span>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="p-2 rounded-md shadow-lg border bg-white animate-in fade-in slide-in-from-top-1"
            >
              <div className="flex flex-col text-sm font-medium w-60">
                {[
                  { label: "Historia", href: "/quienesSomos#historia" },
                  { label: "Nosotros", href: "/quienesSomos#nosotros" },
                  {
                    label: "Responsabilidad Social",
                    href: "/quienesSomos#responsabilidad-social",
                  },
                  {
                    label: "Certificaciones",
                    href: "/certificaciones",
                  },
                  {
                    label: "Noticias Destacadas",
                    href: "/noticias",
                  },
                  {
                    label: "Trabaja con Nosotros",
                    href: "/trabajaNosotros",
                  },
                ].map((item, index, arr) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setQuienesOpen(false)}
                    className={`px-4 py-2 hover:text-red-500 border-b border-gray-200 ${
                      index === arr.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </li>
      {/* NUESTROS PRODUCTOS */}
      <li className="relative">
        <div
          onMouseEnter={() => setProductosOpen(true)}
          onMouseLeave={() => setProductosOpen(false)}
          className="inline-flex"
        >
          <Popover open={productosOpen} onOpenChange={setProductosOpen}>
            <PopoverTrigger asChild>
              <span className={`${baseLink} py-2 cursor-pointer`}>
                {/* Este es el Link principal para la sección de productos */}
                <Link href="/nuestros-productos">NUESTROS PRODUCTOS</Link>
                <span
                  className={`${underline} ${
                    pathname.startsWith("/nuestros-productos")
                      ? "scale-x-100"
                      : "scale-x-0"
                  }`}
                />
              </span>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="p-4 rounded-md shadow-lg border bg-white animate-in fade-in slide-in-from-top-1"
            >
              <div className="grid grid-cols-1 gap-x-6 text-sm font-medium w-[250px]">
                {/* Aquí se itera sobre productosLinks y se usa item.href directamente */}
                {productosLinks.map((item, index, arr) => (
                  <Link
                    key={item.label}
                    href={item.href} // Se usa el href definido en productosLinks
                    onClick={() => setProductosOpen(false)}
                    className={`px-4 py-2 hover:text-red-500 border-b border-gray-200 ${
                      index === arr.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </li>
      {/* CENTRO DE CAPACITACIÓN */}
      <li className="relative">
        <div
          onMouseEnter={() => setCapacitacionOpen(true)}
          onMouseLeave={() => setCapacitacionOpen(false)}
          className="inline-flex"
        >
          <Link href="/centro-de-capacitacion" legacyBehavior passHref>
            <Popover open={capacitacionOpen} onOpenChange={setCapacitacionOpen}>
              <PopoverTrigger asChild>
                <a className={`${baseLink} py-2 cursor-pointer`}>
                  CENTRO DE CAPACITACIÓN
                  <span
                    className={`${underline} ${
                      pathname.startsWith("/centro-de-capacitacion")
                        ? "scale-x-100"
                        : "scale-x-0"
                    }`}
                  />
                </a>
              </PopoverTrigger>
              {/* Puedes añadir PopoverContent aquí si es necesario */}
            </Popover>
          </Link>
        </div>
      </li>
      {/* CONTACTÁCTANOS */}
      <li>
        <Link href="/contactanos" className={baseLink}>
          CONTÁCTANOS
          <span
            className={`${underline} ${
              pathname === "/contactanos" ? "scale-x-100" : "scale-x-0"
            }`}
          />
        </Link>
      </li>
    </ul>
  );
};

export default NavbarMenu;
