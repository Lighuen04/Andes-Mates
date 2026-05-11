import SectionTitle from "@/components/SectionTitle";
import ProductCard from "@/components/ProductCard";
import { getProductsByCategory } from "@/data/catalog";

export default function CombosPage() {
  const items = getProductsByCategory("combos");

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Combos" subtitle="Combos" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
