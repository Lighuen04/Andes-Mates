export const revalidate = 60;

import Breadcrumbs from "@/components/Breadcrumbs";
import SectionTitle from "@/components/SectionTitle";
import ProductGrid from "@/components/ProductGrid";
import { getCatalogProductsByCategory } from "@/lib/data";

export default async function TermosPage() {
  const items = await getCatalogProductsByCategory("termos");

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="section-container">
        <Breadcrumbs crumbs={[{ label: "Catálogo", href: "/catalogo" }]} />
        <SectionTitle title="Termos" subtitle="Termos" />
        {items.length === 0 ? (
          <p className="text-center text-sm text-andes-mountain py-12">
            Todavía no hay productos cargados en esta categoría.
          </p>
        ) : (
          <ProductGrid
            products={items}
            baseUrl="/catalogo/termos"
          />
        )}
      </div>
    </div>
  );
}
