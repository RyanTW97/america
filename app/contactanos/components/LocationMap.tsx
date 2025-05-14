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
          src="https://www.google.com/maps?q=-0.35050674621757766,-78.54487398532294&z=18&output=embed"
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
