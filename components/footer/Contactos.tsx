import { MapPin, Phone, Mail } from "lucide-react";

const Contactos = () => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-extrabold text-2xl mb-2">CONTACTO</h3>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center gap-2">
          <MapPin size={16} /> Turubamba E3E S61-19 y pasaje S61C
        </li>
        <li className="flex items-center gap-2">
          <Phone size={16} /> (02) 9999-999
        </li>
        <li className="flex items-center gap-2">
          <Mail size={16} /> ventas@pinturasamerica.com
        </li>
        <li className="flex items-center gap-2">
          <Mail size={16} /> www.pinturasamerica.com
        </li>
      </ul>
    </div>
  );
};

export default Contactos;
