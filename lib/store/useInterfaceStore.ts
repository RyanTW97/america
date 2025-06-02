// lib/store/useInterfaceStore.ts
import { create } from "zustand";

interface InterfaceState {
  isFavoritesSheetOpen: boolean;
  actions: {
    openFavoritesSheet: () => void;
    closeFavoritesSheet: () => void;
    toggleFavoritesSheet: () => void;
  };
}

export const useInterfaceStore = create<InterfaceState>((set) => ({
  isFavoritesSheetOpen: false,
  actions: {
    openFavoritesSheet: () => set({ isFavoritesSheetOpen: true }),
    closeFavoritesSheet: () => set({ isFavoritesSheetOpen: false }),
    toggleFavoritesSheet: () =>
      set((state) => ({ isFavoritesSheetOpen: !state.isFavoritesSheetOpen })),
  },
}));

// Exportar acciones directamente
export const { openFavoritesSheet, closeFavoritesSheet, toggleFavoritesSheet } =
  useInterfaceStore.getState().actions;
