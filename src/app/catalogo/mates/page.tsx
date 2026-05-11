import SectionTitle from "@/components/SectionTitle";
import ProductCard from "@/components/ProductCard";
import {
  getProductsBySubcategory,
  subcategoriasPorCategoria,
} from "@/data/catalog";

export default function MatesPage() {
  const subcategorias = subcategoriasPorCategoria("mates");

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Mates" subtitle="Calabaza y algarrobo" />

        {subcategorias.map((sub) => {
          const items = getProductsBySubcategory("mates", sub.key);
          return (
            <div key={sub.key} className="mb-16 last:mb-0">
              <h3 className="text-xl font-light tracking-wider text-andes-black mb-8 text-center">
                {sub.label}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
