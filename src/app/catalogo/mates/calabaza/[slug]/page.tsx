import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGallery from "@/components/ProductGallery";
import { getProductBySlug } from "@/data/catalog";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CalabazaProductoPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || product.category !== "mates" || product.subcategory !== "calabaza") notFound();

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          crumbs={[
            { label: "Catálogo", href: "/catalogo" },
            { label: "Mates", href: "/catalogo/mates" },
            { label: "Calabaza", href: "/catalogo/mates/calabaza" },
          ]}
        />
        <ProductGallery product={product} />
      </div>
    </div>
  );
}
