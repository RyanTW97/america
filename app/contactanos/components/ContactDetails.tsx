// components/ContactDetails.tsx

import { Clock, Phone, Mail } from "lucide-react";
import { FaWhatsapp, FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

export default function ContactDetails() {
  return (
    <section className="w-full py-16 px-4 md:px-24 bg-white">
      {/* Horario */}
      <div className="text-center mb-12">
        <h2 className="text-6xl font-extrabold text-blue-950 mb-4">
          Horario de Atención
        </h2>
        <div className="flex items-center justify-center gap-2 text-lg text-gray-700">
          <Clock size={40} className="text-blue-700" />
          <p>08:00 Am a 16:30 Pm</p>
        </div>
      </div>

      {/* Línea */}
      <hr className="border-gray-300 mb-12" />

      {/* Escríbenos */}
      <div className="text-center mb-12">
        <h3 className="text-6xl font-extrabold text-[#F44336] mb-10">
          Escríbenos
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* WhatsApp */}
          <a
            href="https://wa.me/5930992585394"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 text-[#1D1E8D] transition-transform transform hover:scale-110 group"
          >
            <FaWhatsapp
              size={40}
              className="transition-colors group-hover:text-green-500"
            />
            <p className="text-base font-medium">+593 099 258 5394</p>
          </a>

          {/* Email */}
          <a
            href="mailto:ventas@pinturasamerica.com"
            className="flex flex-col items-center gap-2 text-[#1D1E8D] transition-transform transform hover:scale-110 group"
          >
            <Mail
              size={40}
              strokeWidth={1.5}
              className="transition-colors group-hover:text-[#F44336]"
            />
            <p className="text-base font-medium">ventas@pinturasamerica.com</p>
          </a>

          {/* Teléfono */}
          <a
            href="tel:024758123"
            className="flex flex-col items-center gap-2 text-[#1D1E8D] transition-transform transform hover:scale-110 group"
          >
            <Phone
              size={40}
              strokeWidth={1.5}
              className="transition-colors group-hover:text-blue-500"
            />
            <p className="text-base font-medium">
              Teléfono: (02)4758-123/124/125
            </p>
          </a>
        </div>
      </div>

      {/* Línea */}
      <hr className="border-gray-300 mb-12" />

      {/* Síguenos */}
      <div className="text-center">
        <h3 className="text-6xl font-extrabold text-[#1D1E8D] mb-16">
          Síguenos
        </h3>
        <div className="flex justify-center items-center gap-6 mb-2 text-[#1D1E8D]">
          {/* Facebook */}
          <a
            href="https://www.facebook.com/pintamer"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform transform hover:scale-150 group"
            aria-label="Facebook"
          >
            <FaFacebookF
              size={40}
              className="transition-colors group-hover:text-blue-700"
            />
          </a>
          {/* Instagram */}
          <a
            href="https://www.instagram.com/pinturas_america_s.a/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform transform hover:scale-125 group"
            aria-label="Instagram"
          >
            <FaInstagram
              size={40}
              className="transition-colors group-hover:text-[#F44336]"
            />
          </a>
          {/* TikTok */}
          <a
            href="https://www.tiktok.com/@pinturas_america_s.a"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform transform hover:scale-125 group"
            aria-label="TikTok"
          >
            <FaTiktok
              size={40}
              className="transition-colors group-hover:text-black"
            />
          </a>
        </div>
        <p className="text-[#1D1E8D] font-medium text-lg">@Pinturas América</p>
      </div>
    </section>
  );
}
