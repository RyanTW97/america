import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Contactos = () => {
  // Datos de contacto para facilitar la gestión
  const contactInfo = {
    address: "Turubamba E3E S61-19 y pasaje S61C",
    addressLink: "https://maps.app.goo.gl/BmXYMT7voFGherE4A", // Enlace para el mapa
    phone: "(02) 9999-999",
    phoneLink: "tel:029999999", // Formato para el enlace tel:
    email: "ventas@pinturasamerica.com",
    emailLink: "mailto:ventas@pinturasamerica.com",
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-extrabold text-2xl mb-2">CONTACTO</h3>
      <ul className="space-y-2 text-sm">
        {/* Dirección */}
        <li>
          <a
            href={contactInfo.addressLink}
            target="_blank" // Abrir en nueva pestaña
            rel="noopener noreferrer" // Por seguridad y SEO
            className="flex items-center gap-2 hover:text-blue-600 hover:underline transition-colors duration-200 group"
          >
            <FaMapMarkerAlt
              size={16}
              className="text-white group-hover:text-blue-600 transition-colors duration-200"
            />
            {contactInfo.address}
          </a>
        </li>

        {/* Teléfono */}
        <li>
          <a
            href={contactInfo.phoneLink}
            className="flex items-center gap-2 hover:text-blue-600 hover:underline transition-colors duration-200 group"
          >
            <FaPhoneAlt
              size={16}
              className="text-white group-hover:text-blue-600 transition-colors duration-200"
            />
            {contactInfo.phone}
          </a>
        </li>

        {/* Email */}
        <li>
          <a
            href={contactInfo.emailLink}
            className="flex items-center gap-2 hover:text-blue-600 hover:underline transition-colors duration-200 group"
          >
            <FaEnvelope
              size={16}
              className="text-white group-hover:text-blue-600 transition-colors duration-200"
            />
            {contactInfo.email}
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Contactos;
