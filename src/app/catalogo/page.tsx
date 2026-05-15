export const dynamic = "force-dynamic";
export const revalidate = 0;

import SectionTitle from "@/components/SectionTitle";
import CategoryCard from "@/components/CategoryCard";
import AnimatedSection from "@/components/AnimatedSection";
import { getCatalogCategories } from "@/lib/data";

export default async function CatalogoPage() {
  const categories = await getCatalogCategories();

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="section-container">
        <SectionTitle
          title="Catálogo"
          subtitle="Mates, bombillas, materos, termos y combos"
        />
        <AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
