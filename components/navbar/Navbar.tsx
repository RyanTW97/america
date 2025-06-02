// components/Navbar.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { NavbarMenu } from "./NavbarMenu";
import MobileMenu from "./MobileMenu";
import { Search, Heart, Menu as MenuIcon } from "lucide-react"; // Renombrado Menu a MenuIcon para evitar conflicto
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge"; // Para el contador de favoritos
import { useEffect, useState, forwardRef } from "react";
import { motion } from "framer-motion";
import ProductSearchDialog from "@/components/ProductSearchDialog";
import { useInterfaceStore } from "@/lib/store/useInterfaceStore"; // Importar store de interfaz
import { useFavoritesStore } from "@/lib/store/useFavoritesStore"; // Importar store de favoritos

const Navbar = forwardRef<HTMLDivElement>((props, ref) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  const { openFavoritesSheet } = useInterfaceStore((state) => state.actions); // Acción para abrir el sheet
  const favoriteCount = useFavoritesStore(
    (state) => state.favoriteProducts.length
  ); // Cantidad de favoritos

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        ref={ref}
        className={`w-full fixed top-0 z-30 transition-all bg-[#FFF8E7] backdrop-blur ${
          // z-index ajustado a 30
          isScrolled ? "shadow-md" : ""
        }`}
      >
        <nav className="container mx-auto flex items-center justify-between py-4 px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Link
              href="/"
              className="transition-transform duration-300 hover:scale-105 inline-block"
            >
              <Image
                src="/America.png"
                alt="Logo America"
                width={160}
                height={60}
                className="w-28 sm:w-32 md:w-36 lg:w-40 xl:w-44 h-auto"
                priority
              />
            </Link>
          </motion.div>

          <div className="hidden lg:block">
            <NavbarMenu />
          </div>

          <div className="flex items-center gap-4">
            <Search
              className="w-8 h-8 stroke-[1] cursor-pointer transition-transform duration-300 hover:scale-110 hover:stroke-red-500"
              onClick={() => setIsSearchDialogOpen(true)}
            />
            <button
              onClick={openFavoritesSheet} // Abre el sheet de favoritos
              className="relative transition-transform duration-300 hover:scale-110 group"
              aria-label="Ver favoritos"
            >
              <Heart className="w-8 h-8 stroke-[1] cursor-pointer group-hover:stroke-red-500" />
              {favoriteCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full"
                >
                  {favoriteCount}
                </Badge>
              )}
            </button>

            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button aria-label="Abrir menú móvil">
                    <MenuIcon className="w-8 h-8 cursor-pointer" />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-64 animate-slide-in-left"
                >
                  <SheetHeader>
                    <SheetTitle>Menú</SheetTitle>
                  </SheetHeader>
                  <MobileMenu />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>

      <ProductSearchDialog
        open={isSearchDialogOpen}
        onOpenChange={setIsSearchDialogOpen}
      />
      {/* FavoritesSheet se renderiza desde RootLayout */}
    </>
  );
});
Navbar.displayName = "Navbar";

export default Navbar;
