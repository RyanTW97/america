"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileMenu = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "INICIO" },
    { href: "/quienesSomos", label: "QUIENES SOMOS" },
    { href: "/nuestros-productos", label: "NUESTROS PRODUCTOS" },
    { href: "/centro-de-capacitacion", label: "CENTRO DE CAPACITACIÓN" },
    { href: "/contactanos", label: "CONTÁCTANOS" },
  ];

  return (
    <ul className="flex flex-col p-4">
      {links.map((link) => (
        <li key={link.href} className="last:border-b-0">
          <Link
            href={link.href}
            className={`font-archivo font-semibold inline-block relative w-full py-2 transition-all duration-300 hover:scale-105 ${
              pathname === link.href
                ? "after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-red-500"
                : "border-b border-gray-300"
            }`}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MobileMenu;
