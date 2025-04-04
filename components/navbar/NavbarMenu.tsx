"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavbarMenu = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "INICIO" },
    { href: "/quienesSomos", label: "QUIENES SOMOS" },
    { href: "/nuestros-productos", label: "NUESTROS PRODUCTOS" },
    { href: "/centro-de-capacitacion", label: "CENTRO DE CAPACITACIÓN" },
    { href: "/contactanos", label: "CONTÁCTANOS" },
  ];

  return (
    <ul className="hidden lg:text-xs xl:text-base lg:flex gap-8 items-center">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="font-archivo font-semibold inline-block relative transition-transform duration-300 hover:scale-105"
          >
            {link.label}
            {/* Subrayado animado */}
            <span
              className={`absolute left-0 -bottom-1 h-[2px] w-full origin-left scale-x-0 transform bg-red-500 transition-transform duration-300 ${
                pathname === link.href && "scale-x-100"
              }`}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavbarMenu;
