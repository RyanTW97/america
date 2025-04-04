import Link from "next/link";
import { Facebook, Linkedin, Youtube, Instagram } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex flex-col items-center  gap-4">
      {/* Contenedor ajustado */}
      <div className="flex flex-col  ">
        {/* Logo */}
        <Link href="/">
          <img
            src="/America.png"
            alt="Logo America"
            className="w-48 md:w-56 cursor-pointer hover:scale-105 transition-transform"
          />
        </Link>

        {/* Redes sociales alineadas al logo */}
        <div className="flex gap-4 mt-2 justify-center  ">
          <Facebook className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
          <Linkedin className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
          <Youtube className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
          <Instagram className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default Logo;
