// app/nuestros-productos/components/SearchAndTags.tsx
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
import SidebarFilters, { FilterGroup } from "./SidebarFilters"; // Ensure FilterGroup is exported
import { cn } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface SearchAndTagsProps {
  availableFilters: FilterGroup[];
  sidebarFilterQueryParamNames: string[];
}

// Constants for URL parameter names and search behavior
const QUICK_FILTER_PARAM_NAME = "quick_filter_mode";
const SEARCH_QUERY_PARAM_NAME = "q";
const MIN_SEARCH_LENGTH = 3;
const DEBOUNCE_DELAY = 500; // milliseconds

// Configuration for quick filter buttons
const quickFilterConfig = [
  { id: "inen", label: "INEN", modeValue: "inen" },
  { id: "interiores", label: "INTERIORES", modeValue: "interiores" },
  { id: "exteriores", label: "EXTERIORES", modeValue: "exteriores" },
  { id: "clear", label: "QUITAR FILTROS" }, // This item has a special clear action
];

const SearchAndTags = ({
  availableFilters,
  sidebarFilterQueryParamNames,
}: SearchAndTagsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State for the search input term
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get(SEARCH_QUERY_PARAM_NAME) || ""
  );
  // State for the currently active quick filter mode
  const [activeQuickFilterMode, setActiveQuickFilterMode] = useState<
    string | null
  >(searchParams.get(QUICK_FILTER_PARAM_NAME));

  // Ref for the debounce timeout
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Effect to synchronize component state (searchTerm, activeQuickFilterMode) with URL searchParams
  useEffect(() => {
    setActiveQuickFilterMode(searchParams.get(QUICK_FILTER_PARAM_NAME));
    setSearchTerm(searchParams.get(SEARCH_QUERY_PARAM_NAME) || "");
  }, [searchParams]);

  // Memoized function to handle navigation when a search is performed
  const performSearchNavigation = useCallback(
    (term: string) => {
      // Search has top priority: start with fresh URLSearchParams, clearing all other filters.
      const newParams = new URLSearchParams();
      if (term.trim()) {
        newParams.set(SEARCH_QUERY_PARAM_NAME, term.trim());
      }
      newParams.set("page", "1"); // Reset to first page on new search
      router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    },
    [router, pathname]
  ); // Dependencies: router and pathname

  // Effect to handle debounced search navigation when searchTerm changes
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    const currentSearchQueryInUrl = searchParams.get(SEARCH_QUERY_PARAM_NAME);

    if (searchTerm.trim().length >= MIN_SEARCH_LENGTH) {
      // If search term is long enough, set a timeout to perform search
      debounceTimeoutRef.current = setTimeout(() => {
        performSearchNavigation(searchTerm);
      }, DEBOUNCE_DELAY);
    } else if (
      currentSearchQueryInUrl &&
      searchTerm.trim().length < MIN_SEARCH_LENGTH
    ) {
      // If search term becomes too short (or empty) and there was a search query in URL, clear it
      debounceTimeoutRef.current = setTimeout(() => {
        performSearchNavigation(""); // Empty string will remove 'q' param
      }, DEBOUNCE_DELAY);
    }

    // Cleanup function to clear timeout if component unmounts or searchTerm changes again
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm, searchParams, performSearchNavigation]); // Dependencies for the debounce effect

  // Handler for search input changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // Actual navigation is handled by the debounced useEffect
  };

  // Handler for explicit search form submission (e.g., pressing Enter)
  const handleSearchFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (debounceTimeoutRef.current) {
        // Clear any pending debounce
        clearTimeout(debounceTimeoutRef.current);
      }
      performSearchNavigation(searchTerm);
    },
    [performSearchNavigation, searchTerm]
  );

  // Handler for quick filter button clicks
  const handleQuickFilterClick = useCallback(
    (configItem: (typeof quickFilterConfig)[0]) => {
      if (debounceTimeoutRef.current) {
        // Clear any pending search debounce
        clearTimeout(debounceTimeoutRef.current);
      }

      const currentParams = new URLSearchParams(
        Array.from(searchParams.entries())
      );

      // When a quick filter is clicked, always clear the search term 'q'
      currentParams.delete(SEARCH_QUERY_PARAM_NAME);
      setSearchTerm(""); // Update UI state for search input

      if (configItem.id === "clear") {
        // "QUITAR FILTROS" action: clear quick filter, sidebar filters, and search
        currentParams.delete(QUICK_FILTER_PARAM_NAME);
        sidebarFilterQueryParamNames.forEach((paramName) =>
          currentParams.delete(paramName)
        );
        setActiveQuickFilterMode(null); // Update UI state
      } else {
        // For other quick filters (INEN, INTERIORES, EXTERIORES)
        const currentQuickFilterValue = currentParams.get(
          QUICK_FILTER_PARAM_NAME
        );
        if (currentQuickFilterValue === configItem.modeValue) {
          // If clicking the already active quick filter, deactivate it
          currentParams.delete(QUICK_FILTER_PARAM_NAME);
          setActiveQuickFilterMode(null);
        } else {
          // Activate the new quick filter
          currentParams.set(QUICK_FILTER_PARAM_NAME, configItem.modeValue!);
          setActiveQuickFilterMode(configItem.modeValue!);
        }
        // Sidebar filters are NOT cleared here, allowing them to coexist with quick filters.
      }

      currentParams.set("page", "1"); // Reset to first page
      router.push(`${pathname}?${currentParams.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname, sidebarFilterQueryParamNames]
  ); // Dependencies for quick filter click handler

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      {/* Search Input Form */}
      <div className="relative w-full md:max-w-xs">
        <form onSubmit={handleSearchFormSubmit} className="relative">
          <Input
            placeholder="Buscar producto..."
            className="rounded-full pr-10 border-zinc-300 focus:border-blue-500 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="Buscar producto"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 h-full px-3 flex items-center text-zinc-500 hover:text-blue-600"
            aria-label="Iniciar búsqueda"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Quick Filters and Mobile Filter Trigger */}
      <div className="flex gap-2 items-center overflow-x-auto flex-nowrap pb-2 md:pb-0">
        {/* Mobile Filter Sheet Trigger */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="bg-white text-zinc-700 rounded-full border-zinc-300 hover:bg-zinc-50 shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[280px] sm:w-[320px] p-0 overflow-y-auto"
            >
              <SheetHeader className="p-4 border-b sticky top-0 bg-white z-10">
                <SheetTitle className="text-lg font-semibold">
                  Filtros
                </SheetTitle>
              </SheetHeader>
              <div className="p-4">
                <SidebarFilters filterGroups={availableFilters} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Quick Filter Buttons */}
        {quickFilterConfig.map((qf) => {
          const isActive =
            qf.id !== "clear" && activeQuickFilterMode === qf.modeValue;
          return (
            <Button
              key={qf.id}
              variant={isActive ? "default" : "outline"}
              className={cn(
                "rounded-full px-3 h-9 text-xs whitespace-nowrap shrink-0",
                "md:h-10 md:text-sm md:px-4",
                isActive
                  ? "bg-zinc-900 text-white hover:bg-zinc-800"
                  : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50"
              )}
              onClick={() => handleQuickFilterClick(qf)}
            >
              {isActive && <span className="mr-1.5">✓</span>}
              {qf.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchAndTags;
