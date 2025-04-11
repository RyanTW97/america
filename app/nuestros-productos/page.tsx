import HeaderBanner from "./components/HeaderBanner";
import { filters } from "@/utils/filters";
import SidebarFilters from "./components/SidebarFilters";
import SearchAndTags from "./components/SearchAndTags";
import ProductGrid from "./components/ProductGrid";
import ProductCarousel from "@/components/ProductCarousel";

export default function Page() {
  return (
    <main>
      <HeaderBanner />
      <div className="flex flex-col md:flex-row gap-6 px-6 py-8">
        {/* Sidebar solo en desktop */}
        <div className="hidden lg:block w-[270px] shrink-0">
          <SidebarFilters filters={filters} />
        </div>

        {/* Contenido */}
        <div className="flex-1">
          <SearchAndTags />
          <ProductGrid />
        </div>
      </div>
      <ProductCarousel />
    </main>
  );
}
