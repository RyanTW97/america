// components/StoreInitializer.tsx
"use client";

import { useEffect, useRef } from "react";
import { useFavoritesStore } from "@/lib/store/useFavoritesStore";

function StoreInitializer() {
  const isInitialized = useRef(false);
  const { loadInitialFavorites, setLoaded } = useFavoritesStore(
    (state) => state.actions
  );
  const favoritesLoaded = useFavoritesStore((state) => state.isLoaded);

  useEffect(() => {
    // El middleware 'persist' de Zustand ya maneja la carga desde localStorage.
    // Este componente principalmente asegura que 'isLoaded' se establezca correctamente
    // si la rehidratación automática no lo hizo o si queremos lógica adicional al cargar.
    // Con onRehydrateStorage, isLoaded ya debería estar en true.
    // Esta llamada es más una salvaguarda o para lógica de inicialización explícita.
    if (
      typeof window !== "undefined" &&
      !favoritesLoaded &&
      !isInitialized.current
    ) {
      // console.log("StoreInitializer: Attempting to ensure favorites are loaded.");
      loadInitialFavorites(); // Esta acción ahora principalmente marca isLoaded si es necesario.
      isInitialized.current = true;
    } else if (favoritesLoaded && !isInitialized.current) {
      // console.log("StoreInitializer: Favorites already marked as loaded by persist middleware.");
      isInitialized.current = true;
    }
  }, [loadInitialFavorites, favoritesLoaded, setLoaded]);

  return null; // Este componente no renderiza nada
}

export default StoreInitializer;
