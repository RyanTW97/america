// lib/store/useFavoritesStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ProductForFavorites } from "@/app/types/favorites";

interface ToggleFavoriteResult {
  status: "added" | "removed";
  product?: ProductForFavorites; // El producto afectado, especialmente útil para 'removed'
}

interface FavoritesState {
  favoriteProducts: ProductForFavorites[];
  isLoaded: boolean;
  actions: {
    toggleFavorite: (product: ProductForFavorites) => ToggleFavoriteResult; // Modificado
    removeFavorite: (productId: number) => ProductForFavorites | undefined;
    addFavorite: (product: ProductForFavorites) => void;
    isFavorite: (productId: number) => boolean;
    loadInitialFavorites: () => void;
    setLoaded: (loaded: boolean) => void;
  };
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteProducts: [],
      isLoaded: false,
      actions: {
        loadInitialFavorites: () => {
          if (!get().isLoaded) {
            get().actions.setLoaded(true);
          }
        },
        setLoaded: (loaded) => set({ isLoaded: loaded }),
        toggleFavorite: (product) => {
          const currentFavorites = get().favoriteProducts;
          const isAlreadyFavorite = currentFavorites.some(
            (p) => p.id === product.id
          );

          if (isAlreadyFavorite) {
            set({
              favoriteProducts: currentFavorites.filter(
                (p) => p.id !== product.id
              ),
            });
            return { status: "removed", product: product }; // Devolver el producto eliminado
          } else {
            set({ favoriteProducts: [...currentFavorites, product] });
            return { status: "added", product: product }; // Devolver el producto añadido
          }
        },
        removeFavorite: (productId) => {
          const currentFavorites = get().favoriteProducts;
          const productToRemove = currentFavorites.find(
            (p) => p.id === productId
          );
          if (productToRemove) {
            set({
              favoriteProducts: currentFavorites.filter(
                (p) => p.id !== productId
              ),
            });
            return productToRemove;
          }
          return undefined;
        },
        addFavorite: (product) => {
          const currentFavorites = get().favoriteProducts;
          if (!currentFavorites.some((p) => p.id === product.id)) {
            set({ favoriteProducts: [...currentFavorites, product] });
          }
        },
        isFavorite: (productId) => {
          return get().favoriteProducts.some((p) => p.id === productId);
        },
      },
    }),
    {
      name: "america-favorites-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ favoriteProducts: state.favoriteProducts }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.actions.setLoaded(true);
        }
      },
    }
  )
);

// Exportar acciones directamente para facilitar su uso
// Nota: toggleFavorite ahora devuelve un objeto, así que su uso directo podría necesitar ajuste
// si se espera solo el status. Es mejor usarlo a través del hook en componentes.
export const { removeFavorite, addFavorite, isFavorite, loadInitialFavorites } =
  useFavoritesStore.getState().actions;
// No exportamos toggleFavorite directamente aquí porque su firma cambió y es mejor usarla con el hook.
