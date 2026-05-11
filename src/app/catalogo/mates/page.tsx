import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionTitle from "@/components/SectionTitle";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { getSubcategoriesByCategory } from "@/data/catalog";

export default function MatesPage() {
  const subs = getSubcategoriesByCategory("mates");

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs crumbs={[{ label: "Catálogo", href: "/catalogo" }]} />
        <SectionTitle title="Mates" subtitle="Elegí una variedad" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {subs.map((sub) => (
            <Link
              key={sub.key}
              href={`/catalogo/mates/${sub.slug}`}
              className="group block bg-white border border-andes-snow overflow-hidden hover:border-andes-ice/40 hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-square overflow-hidden">
                {sub.imageUrl ? (
                  <img
                    src={sub.imageUrl}
                    alt={sub.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <ImagePlaceholder className="w-full h-full" text={sub.name} />
                )}
              </div>
              <div className="p-4 text-center">
                <h3 className="text-sm font-medium text-andes-black tracking-wide uppercase">
                  {sub.name}
                </h3>
                {sub.description && (
                  <p className="mt-1 text-[10px] text-andes-mountain tracking-widest">
                    {sub.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
