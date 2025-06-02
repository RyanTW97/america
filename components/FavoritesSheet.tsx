// components/FavoritesSheet.tsx
"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { HeartCrack, ShoppingBag, X as XIcon } from "lucide-react";
import { useInterfaceStore } from "@/lib/store/useInterfaceStore";
import { useFavoritesStore } from "@/lib/store/useFavoritesStore";
import ProductCard from "./ProductCard";
import type { ProductForFavorites } from "@/app/types/favorites";
import { toast } from "sonner";
import Link from "next/link";

const FavoritesSheet = () => {
  const { isFavoritesSheetOpen, actions: interfaceActions } =
    useInterfaceStore();
  const { favoriteProducts, actions: favoriteActions } = useFavoritesStore();

  const handleCloseSheet = () => {
    interfaceActions.closeFavoritesSheet();
  };

  const handleRemoveAndToast = (product: ProductForFavorites) => {
    const removedProduct = favoriteActions.removeFavorite(product.id);

    if (removedProduct) {
      toast.info(`"${removedProduct.titulo}" eliminado de favoritos.`, {
        action: {
          label: "Deshacer",
          onClick: () => {
            favoriteActions.addFavorite(removedProduct);
            toast.success(`"${removedProduct.titulo}" restaurado a favoritos.`);
          },
        },
        duration: 5000,
      });
    }
  };

  return (
    <Sheet
      open={isFavoritesSheetOpen}
      onOpenChange={interfaceActions.closeFavoritesSheet}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg md:max-w-xl flex flex-col p-0"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b sticky top-0 bg-background z-10">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-xl font-semibold">Favoritos</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <XIcon className="h-5 w-5" />
              </Button>
            </SheetClose>
          </div>
          {favoriteProducts.length > 0 && (
            <SheetDescription className="mt-1">
              Tienes {favoriteProducts.length} producto
              {favoriteProducts.length === 1 ? "" : "s"} en tu lista.
            </SheetDescription>
          )}
        </SheetHeader>

        {favoriteProducts.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
            <HeartCrack className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-1">
              Tu lista de favoritos está vacía.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              ¡Añade productos que te encanten para verlos aquí!
            </p>
            {/* El SheetClose asChild ya debería cerrar el sheet al navegar */}
            <SheetClose asChild>
              <Link href="/nuestros-productos" passHref legacyBehavior>
                <Button variant="default" size="lg" onClick={handleCloseSheet}>
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Explorar Productos
                </Button>
              </Link>
            </SheetClose>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
            {/* ---- Espacio entre columnas reducido ---- */}
            <div className="grid grid-cols-2 gap-1.5 md:gap-1.5">
              {favoriteProducts.map((favProduct) => (
                /* ---- Al hacer clic en el card, cerramos el sheet ---- */
                <div
                  key={favProduct.id}
                  className="w-full cursor-pointer"
                  onClick={handleCloseSheet}
                >
                  <ProductCard
                    product={{
                      id: favProduct.id,
                      attributes: {
                        titulo: favProduct.titulo,
                        slug: favProduct.slug,
                        // Propiedades obligatorias de ProductAttributes:
                        createdAt: "", // puedes usar "" o poner una fecha válida
                        updatedAt: "", // idem
                        publishedAt: "", // idem
                        // Imagen con todos sus atributos mínimos:
                        imagen: {
                          data: {
                            id: 0,
                            attributes: {
                              url: favProduct.imageUrl,
                              name: favProduct.titulo,
                              alternativeText: favProduct.titulo,
                              caption: favProduct.titulo,
                              width: 180,
                              height: 180,
                              // Agregamos formats vacío para cumplir con StrapiImageDataAttributes:
                              formats: {},
                              hash: "",
                              ext: "",
                              mime: "",
                              size: 0,
                              previewUrl: null,
                              provider: "",
                              provider_metadata: null,
                              createdAt: "",
                              updatedAt: "",
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {favoriteProducts.length > 0 && (
          <div className="px-6 py-4 border-t sticky bottom-0 bg-background z-10">
            {/* ---- Asegurar cierre del sheet al hacer clic en "Continuar Explorando" ---- */}
            <SheetClose asChild>
              <Link href="/nuestros-productos" passHref legacyBehavior>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCloseSheet}
                >
                  Continuar Explorando
                </Button>
              </Link>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default FavoritesSheet;
