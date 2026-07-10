export const revalidate = 60;

import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGallery from "@/components/ProductGallery";
import { getCatalogProductBySlug } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BombillaProductoPage({ params }: Props) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="section-container">
        <Breadcrumbs
          crumbs={[
            { label: "Catálogo", href: "/catalogo" },
            { label: "Bombillas", href: "/catalogo/bombillas" },
          ]}
        />
        <ProductGallery product={product} />
      </div>
    </div>
  );
}
