import ProductGrid from "../nuestros-productos/components/ProductGrid";

export default function FavoritosPage() {
  return (
    <main className="w-full min-h-screen bg-white">
      {/* Título */}
      <div className="py-16 px-4 md:px-24 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1D1E8D]">
          Tu productos favoritos
        </h1>
      </div>

      {/* Grid de productos */}
      <section className="px-4 md:px-24 pb-24">
        <ProductGrid />
      </section>
    </main>
  );
}
