// app/QuienesSomos/components/HistoryStep.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion"; // Importar motion

interface HistoryStepProps {
  text: string;
  isActive: boolean; // Para saber si este paso es el activo
  className?: string;
}

const HistoryStep: React.FC<HistoryStepProps> = ({
  text,
  isActive,
  className,
}) => {
  // Podemos usar isActive más adelante para aplicar estilos (ej. opacidad)
  // Por ahora, solo renderizamos el párrafo.
  // Añadimos una altura mínima considerable para asegurar que haya espacio para scrollear
  // y que el intersection observer tenga margen para detectar cambios.
  return (
    <div className={cn("min-h-[80vh] py-16 md:py-24", className)}>
      {" "}
      {/* Altura mínima y padding vertical */}
      {/* Usaremos motion.p para animar la opacidad o la entrada/salida */}
      <motion.p
        className={cn(
          "text-lg leading-relaxed text-gray-700 dark:text-gray-300 transition-opacity duration-300",
          isActive ? "opacity-100" : "opacity-30" // Ejemplo: Atenuar si no está activo
        )}
        // Animaciones Framer Motion (se configurarán mejor en el componente padre con AnimatePresence)
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0.3 }}
        transition={{ duration: 0.5 }}
      >
        {text}
      </motion.p>
    </div>
  );
};

export default HistoryStep;
