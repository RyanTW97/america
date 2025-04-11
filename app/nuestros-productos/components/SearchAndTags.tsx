"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SidebarFilters from "./SidebarFilters";
import { filters } from "@/utils/filters";
import { cn } from "@/lib/utils";

const quickFilters = ["INEN", "INTERIORES", "EXTERIORES", "QUITAR FILTROS"];

const SearchAndTags = () => {
  const [selectedTag, setSelectedTag] = useState("INEN");

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      {/* Input con ícono */}
      <div className="relative w-full max-w-xs">
        <Input
          placeholder="Buscar producto..."
          className="rounded-full pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
      </div>

      {/* Filtros rápidos + Botón Filtros (mobile) */}
      <div className="flex gap-2 items-center overflow-x-auto flex-nowrap">
        {/* Filtros (mobile sheet) */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="bg-zinc-100 text-zinc-700 rounded-full">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[260px] sm:w-[300px]">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <SidebarFilters filters={filters} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Quick filters */}
        {quickFilters.map((tag) => (
          <Button
            key={tag}
            variant={selectedTag === tag ? "default" : "ghost"}
            className={cn(
              "rounded-full px-4 h-8 text-xs",
              "md:h-9 md:text-sm",
              selectedTag === tag
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-700"
            )}
            onClick={() => setSelectedTag(tag)}
          >
            {selectedTag === tag && <span className="mr-2">✓</span>}
            {tag}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SearchAndTags;
