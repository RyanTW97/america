import { FaMapMarkedAlt } from "react-icons/fa";

export default function LocationMap() {
  return (
    <section className="w-full py-16 px-4 md:px-24 bg-white text-center">
      <hr className="border-gray-300 mb-12" />
      <div className="flex justify-center items-center mb-6">
        <FaMapMarkedAlt size={40} className="text-[#1D1E8D]" />
        <div>
          <h2 className="text-4xl font-extrabold text-[#1D1E8D] mt-4">
            Encuéntranos
          </h2>
          <p className="text-xl text-[#1D1E8D] mt-2">
            Turubamba E3E S61-19 y pasaje S61C
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl overflow-hidden shadow-md">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1790.243434626417!2d-78.54573334528453!3d-0.35078927777785884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d585f54d8a3351%3A0xb0e4f1ac2e205cc9!2sPinturas%20Am%C3%A9rica%20S.A.!5e0!3m2!1ses!2sec!4v1747836323158!5m2!1ses!2sec"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
