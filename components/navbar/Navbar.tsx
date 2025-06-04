// components/Navbar.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { NavbarMenu } from "./NavbarMenu";
import MobileMenu from "./MobileMenu";
import { Search, Heart, Menu as MenuIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, forwardRef, useRef } from "react"; // Added useRef
import { motion } from "framer-motion";
import ProductSearchDialog from "@/components/ProductSearchDialog";
import { useInterfaceStore } from "@/lib/store/useInterfaceStore";
import { useFavoritesStore } from "@/lib/store/useFavoritesStore";

const Navbar = forwardRef<HTMLDivElement>((props, ref) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const lastScrollY = useRef(0); // Using useRef to store lastScrollY to avoid re-renders from its change

  const { openFavoritesSheet } = useInterfaceStore((state) => state.actions);
  const favoriteCount = useFavoritesStore(
    (state) => state.favoriteProducts.length
  );

  // Threshold after which the navbar starts hiding/showing
  const SCROLL_THRESHOLD = 50; // px, adjust as needed

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 0); // For shadow

      if (
        currentScrollY > lastScrollY.current &&
        currentScrollY > SCROLL_THRESHOLD
      ) {
        // Scrolling Down and past threshold
        setNavbarVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling Up
        setNavbarVisible(true);
      }
      // Update lastScrollY, ensuring it's not negative on overscroll (iOS)
      lastScrollY.current = Math.max(0, currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Empty dependency array, lastScrollY is a ref

  return (
    <>
      <header
        ref={ref}
        className={`w-full fixed top-0 z-30 bg-[#FFF8E7] backdrop-blur transition-all duration-300 ease-in-out ${
          isScrolled && navbarVisible ? "shadow-md" : "" // Show shadow only if visible and scrolled
        } ${navbarVisible ? "translate-y-0" : "-translate-y-full"}`} // Dynamic visibility
      >
        {/* Reduced py-4 to py-3 for a slightly smaller navbar height */}
        <nav className="container mx-auto flex items-center justify-between py-3 px-6">
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
                width={150} // Adjusted base width for aspect ratio
                height={56} // Adjusted base height for aspect ratio
                // Adjusted logo widths for a slightly smaller logo
                className="w-24 sm:w-28 md:w-32 lg:w-36 xl:w-40 h-auto"
                priority
              />
            </Link>
          </motion.div>

          <div className="hidden lg:block">
            <NavbarMenu />
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {" "}
            {/* Slightly reduced gap for smaller screens */}
            <Search
              className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1] cursor-pointer transition-transform duration-300 hover:scale-110 hover:stroke-red-500" // Slightly smaller icon
              onClick={() => setIsSearchDialogOpen(true)}
            />
            <button
              onClick={openFavoritesSheet}
              className="relative transition-transform duration-300 hover:scale-110 group"
              aria-label="Ver favoritos"
            >
              <Heart className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1] cursor-pointer group-hover:stroke-red-500" />{" "}
              {/* Slightly smaller icon */}
              {favoriteCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1.5 -right-1.5 h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-[10px] sm:text-xs rounded-full" // Adjusted badge size/pos
                >
                  {favoriteCount}
                </Badge>
              )}
            </button>
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button aria-label="Abrir menú móvil">
                    <MenuIcon className="w-7 h-7 sm:w-8 sm:h-8 cursor-pointer" />{" "}
                    {/* Slightly smaller icon */}
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
    </>
  );
});
Navbar.displayName = "Navbar";

export default Navbar;
