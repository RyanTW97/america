import Logo from "./Logo";
import Lineas from "./Lineas";
import Contactos from "./Contactos";
import Copyright from "./Copyright";

const Footer = () => {
  return (
    <footer className="bg-[#463BA2] text-white py-12">
      {/* Fila principal */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {/* LOGO - centrado verticalmente */}
        <div className="h-full flex items-center justify-center md:justify-start">
          <Logo />
        </div>

        {/* LINEAS - al centro */}
        <div className="flex justify-center">
          <Lineas />
        </div>

        {/* CONTACTOS - a la derecha */}
        <div className="flex justify-center md:justify-end">
          <Contactos />
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8">
        <Copyright />
      </div>
    </footer>
  );
};

export default Footer;
