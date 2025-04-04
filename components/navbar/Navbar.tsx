"use client";
import Image from "next/image";
import Link from "next/link";
import { NavbarMenu } from "./NavbarMenu";
import MobileMenu from "./MobileMenu";
import { Search, Heart, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState, forwardRef } from "react";
import { motion } from "framer-motion";

const Navbar = forwardRef<HTMLDivElement>((props, ref) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      ref={ref}
      className={`w-full fixed top-0 z-50 transition-all bg-[#FFF8E7] backdrop-blur ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
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
            />
          </Link>
        </motion.div>

        {/* Desktop menu */}
        <div className="hidden lg:block">
          <NavbarMenu />
        </div>

        {/* Right icons + Mobile Menu */}
        <div className="flex items-center gap-4">
          <Search className="w-8 h-8 stroke-[1] cursor-pointer transition-transform duration-300 hover:scale-110 hover:stroke-red-500" />
          <Heart className="w-8 h-8 stroke-[1] cursor-pointer transition-transform duration-300 hover:scale-110 hover:stroke-red-500" />

          {/* Mobile */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger>
                <Menu className="w-8 h-8 cursor-pointer" />
              </SheetTrigger>
              <SheetContent side="left" className="w-64 animate-slide-in-left">
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
  );
});

// NECESARIO para usar forwardRef
Navbar.displayName = "Navbar";

export default Navbar;
