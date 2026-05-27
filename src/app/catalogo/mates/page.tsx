export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionTitle from "@/components/SectionTitle";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { StaggerGrid, StaggerItem } from "@/components/StaggerContainer";
import { getCatalogSubcategories } from "@/lib/data";

export default async function MatesPage() {
  const subs = await getCatalogSubcategories("mates");

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="section-container">
        <Breadcrumbs crumbs={[{ label: "Catálogo", href: "/catalogo" }]} />
        <SectionTitle title="Mates" subtitle="Elegí una variedad" />
        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
          {subs.map((sub) => (
            <StaggerItem key={sub.key}>
              <Link
                href={`/catalogo/mates/${sub.slug}`}
                className="group h-full flex flex-col bg-white rounded-(--radius-card) overflow-hidden shadow-(--shadow-card) hover:shadow-(--shadow-card-hover) hover:scale-[1.04] hover:-translate-y-1.5 transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              >
                <div className="aspect-square overflow-hidden">
                  {sub.imageUrl ? (
                    <img
                      src={sub.imageUrl}
                      alt={sub.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    />
                  ) : (
                    <ImagePlaceholder className="w-full h-full" text={sub.name} />
                  )}
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-5 text-center">
                  <h3 className="font-serif text-lg text-andes-black">
                    {sub.name}
                  </h3>
                  {sub.description && (
                    <p className="mt-1 text-xs text-andes-mountain tracking-wider leading-relaxed">
                      {sub.description}
                    </p>
                  )}
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </div>
  );
}
