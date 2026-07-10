export const revalidate = 60;

import SectionTitle from "@/components/SectionTitle";
import CategoryCard from "@/components/CategoryCard";
import { StaggerGrid, StaggerItem } from "@/components/StaggerContainer";
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
        <StaggerGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <StaggerItem key={cat.id}>
              <CategoryCard category={cat} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </div>
  );
}
