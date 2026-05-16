export const dynamic = "force-dynamic";
export const revalidate = 0;

import Breadcrumbs from "@/components/Breadcrumbs";
import SectionTitle from "@/components/SectionTitle";
import ProductGrid from "@/components/ProductGrid";
import { getCatalogProductsBySubcategory } from "@/lib/data";

export default async function CalabazaPage() {
  const items = await getCatalogProductsBySubcategory("mates", "calabaza");

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="section-container">
        <Breadcrumbs
          crumbs={[
            { label: "Catálogo", href: "/catalogo" },
            { label: "Mates", href: "/catalogo/mates" },
          ]}
        />
        <SectionTitle title="Mates de calabaza" subtitle="Calabaza" />
        {items.length === 0 ? (
          <p className="text-center text-sm text-andes-mountain py-12">
            Todavía no hay productos cargados en esta categoría.
          </p>
        ) : (
          <ProductGrid
            products={items}
            baseUrl="/catalogo/mates/calabaza"
          />
        )}
      </div>
    </div>
  );
}
