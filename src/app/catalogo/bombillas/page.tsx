export const dynamic = "force-dynamic";
export const revalidate = 0;

import Breadcrumbs from "@/components/Breadcrumbs";
import SectionTitle from "@/components/SectionTitle";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
import { getCatalogProductsByCategory } from "@/lib/data";

export default async function BombillasPage() {
  const items = await getCatalogProductsByCategory("bombillas");

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="section-container">
        <Breadcrumbs crumbs={[{ label: "Catálogo", href: "/catalogo" }]} />
        <SectionTitle title="Bombillas" subtitle="Bombillas" />
        <AnimatedSection>
          {items.length === 0 ? (
            <p className="text-center text-sm text-andes-mountain py-12">
              Todavía no hay productos cargados en esta categoría.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  href={`/catalogo/bombillas/${product.slug}`}
                />
              ))}
            </div>
          )}
        </AnimatedSection>
      </div>
    </div>
  );
}
