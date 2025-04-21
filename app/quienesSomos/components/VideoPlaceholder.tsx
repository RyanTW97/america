// app/QuienesSomos/components/VideoPlaceholder.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";
import { motion } from "framer-motion"; // Importar motion

interface VideoPlaceholderProps {
  className?: string;
}

const VideoPlaceholder: React.FC<VideoPlaceholderProps> = ({ className }) => {
  return (
    // Contenedor exterior con estilos y aspect ratio
    <div
      className={cn(
        "relative w-full rounded-lg bg-gray-300 dark:bg-gray-700",
        "aspect-[4/3]", // Aspect ratio 4:3
        "overflow-hidden", // Ocultar si el scale interno se sale
        className
      )}
    >
      {/* Contenedor interno para animar el contenido del placeholder */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        // Animación de entrada sutil para el contenido
        initial={{ scale: 0.9, opacity: 0 }} // Empieza un poco más pequeño y transparente
        animate={{ scale: 1, opacity: 1 }} // Termina a tamaño normal y opaco
        // Retraso y duración para que ocurra justo después de que aparezca el contenedor principal
        transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
      >
        {/* Botón simulado */}
        <div className="flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-white shadow-md">
          <Play size={16} fill="currentColor" />
          <span className="text-sm font-medium">Play</span>
        </div>
      </motion.div>
    </div>
  );
};

export default VideoPlaceholder;
