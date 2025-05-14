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
        <div className="flex  items-center justify-center gap-2 text-lg text-gray-700">
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
          <div className="flex flex-col items-center gap-2 text-[#1D1E8D]">
            <FaWhatsapp size={40} />
            <p className="text-base font-medium">+593 099 258 5394</p>
          </div>

          {/* Email */}
          <div className="flex flex-col items-center gap-2 text-[#1D1E8D]">
            <Mail size={40} strokeWidth={1.5} />
            <p className="text-base font-medium">ventas@pinturasamerica.com</p>
          </div>

          {/* Teléfono */}
          <div className="flex flex-col items-center gap-2 text-[#1D1E8D]">
            <Phone size={40} strokeWidth={1.5} />
            <p className="text-base font-medium">
              Teléfono: (02)4758-123/124/125
            </p>
          </div>
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
          <FaFacebookF size={24} />
          <FaInstagram size={24} />
          <FaTiktok size={24} />
        </div>
        <p className="text-[#1D1E8D] font-medium text-lg">@Pinturas América</p>
      </div>
    </section>
  );
}
