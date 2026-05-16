export const dynamic = "force-dynamic";
export const revalidate = 0;

import Breadcrumbs from "@/components/Breadcrumbs";
import SectionTitle from "@/components/SectionTitle";
import ProductGrid from "@/components/ProductGrid";
import { getCatalogProductsByCategory } from "@/lib/data";

export default async function MaterosPage() {
  const items = await getCatalogProductsByCategory("materos");

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="section-container">
        <Breadcrumbs crumbs={[{ label: "Catálogo", href: "/catalogo" }]} />
        <SectionTitle title="Materos" subtitle="Materos" />
        {items.length === 0 ? (
          <p className="text-center text-sm text-andes-mountain py-12">
            Todavía no hay productos cargados en esta categoría.
          </p>
        ) : (
          <ProductGrid
            products={items}
            baseUrl="/catalogo/materos"
          />
        )}
      </div>
    </div>
  );
}
