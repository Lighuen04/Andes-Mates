import SectionTitle from "@/components/SectionTitle";
import ProductCard from "@/components/ProductCard";
import { getProductsByCategory } from "@/data/catalog";

export default function TermosPage() {
  const items = getProductsByCategory("termos");

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Termos" subtitle="Termos" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-sm mx-auto">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
