const Copyright = () => {
  const year = new Date().getFullYear();

  return (
    <div className="w-full text-center mt-8 pt-4 border-t text-xs text-gray-200">
      Copyright © {year} - Todos los derechos reservados
    </div>
  );
};

export default Copyright;
