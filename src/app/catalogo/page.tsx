import SectionTitle from "@/components/SectionTitle";
import CategoryCard from "@/components/CategoryCard";
import { getCatalogCategories } from "@/lib/data";

export default async function CatalogoPage() {
  const categories = await getCatalogCategories();

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Catálogo"
          subtitle="Mates, bombillas, materos, termos y combos"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </div>
  );
}
