// Asegúrate de que la ruta de importación sea correcta si este archivo está en una subcarpeta
import Link from "next/link";
// Importa los iconos específicos de react-icons/fa
import { FaFacebookF, FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";

const Logo = () => {
  // Define los enlaces a las redes sociales.
  // ¡IMPORTANTE! Actualiza el enlace de YouTube con tu URL real.
  const socialLinks = {
    facebook: "https://www.facebook.com/pintamer",
    youtube: "https://www.youtube.com/user/PINTURASAMERICASA", // Ejemplo, reemplaza con tu URL real
    instagram: "https://www.instagram.com/pinturas_america_s.a/",
    tiktok: "https://www.tiktok.com/@pinturas_america_s.a",
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Contenedor principal del logo y redes */}
      <div className="flex flex-col items-center">
        {/* Logo de la empresa */}
        <Link href="/">
          {/* En Next.js 13+ no es necesario anidar <a> dentro de <Link> si el hijo es un elemento simple */}
          <img
            src="/America.png" // Asegúrate que esta ruta a tu imagen sea correcta desde la carpeta `public`
            alt="Logo Pinturas America"
            className="w-48 md:w-56 cursor-pointer hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Iconos de Redes Sociales */}
        <div className="flex gap-4 mt-3 justify-center">
          {/* Enlace a Facebook */}
          <a
            href={socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visita nuestra página de Facebook"
            className="text-white hover:text-blue-600 cursor-pointer transform hover:scale-125 transition-all duration-300"
          >
            <FaFacebookF size={24} /> {/* Tamaño del icono */}
          </a>

          {/* Enlace a YouTube */}
          <a
            href={socialLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visita nuestro canal de YouTube"
            className="text-white hover:text-red-600 cursor-pointer transform hover:scale-125 transition-all duration-300"
          >
            <FaYoutube size={24} /> {/* Tamaño del icono */}
          </a>

          {/* Enlace a Instagram */}
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visita nuestro perfil de Instagram"
            className="text-white hover:text-pink-500 cursor-pointer transform hover:scale-125 transition-all duration-300"
          >
            <FaInstagram size={24} /> {/* Tamaño del icono */}
          </a>

          <a
            href={socialLinks.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visita nuestro perfil de TikTok"
            className="text-white hover:text-black cursor-pointer transform hover:scale-125 transition-all duration-300"
          >
            <FaTiktok size={24} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Logo;
