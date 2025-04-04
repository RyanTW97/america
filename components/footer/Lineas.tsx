const Lineas = () => {
  const lineas = [
    "Arquitectonica",
    "Metalmecánica",
    "Industrial",
    "Automotriz",
    "Pisos Epoxicos",
    "Madera",
    "Demarcación Vial",
    "Especial",
  ];

  return (
    <div className="flex flex-col gap-4 items-center">
      <h3 className="font-extrabold text-2xl mb-2">NUESTRAS LÍNEAS</h3>
      <div className="grid grid-cols-2 gap-x-20 gap-y-3 text-base">
        {lineas.map((linea) => (
          <span key={linea} className="hover:underline cursor-pointer">
            {linea}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Lineas;
