import Breadcrumbs from "@/components/Breadcrumbs";
import SectionTitle from "@/components/SectionTitle";
import ProductCard from "@/components/ProductCard";
import { getProductsBySubcategory } from "@/data/catalog";

export default function CalabazaPage() {
  const items = getProductsBySubcategory("mates", "calabaza");

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          crumbs={[
            { label: "Catálogo", href: "/catalogo" },
            { label: "Mates", href: "/catalogo/mates" },
          ]}
        />
        <SectionTitle title="Mates de calabaza" subtitle="Calabaza" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              href={`/catalogo/mates/calabaza/${product.slug}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
