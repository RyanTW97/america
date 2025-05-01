import HeaderTrabajaConNosotros from "./components/HeaderTrabajaConNosotros";
import SinPlaza from "./components/SinPlaza";

function trabajaNosotros() {
  return (
    <div>
      <HeaderTrabajaConNosotros />
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-center font-archivo flex justify-center py-8 text-blue-800">
        ¿Deseas formar parte de nuestro equipo de trabajo?
      </h1>
      <div className="p-10 px-20">
        <SinPlaza />
      </div>
    </div>
  );
}

export default trabajaNosotros;
