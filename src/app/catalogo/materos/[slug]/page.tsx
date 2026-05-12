export const dynamic = "force-dynamic";
export const revalidate = 0;

import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGallery from "@/components/ProductGallery";
import { getCatalogProductBySlug } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function MateroProductoPage({ params }: Props) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          crumbs={[
            { label: "Catálogo", href: "/catalogo" },
            { label: "Materos", href: "/catalogo/materos" },
          ]}
        />
        <ProductGallery product={product} />
      </div>
    </div>
  );
}
