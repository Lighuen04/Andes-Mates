import Link from "next/link";
import Image from "next/image";
import ImagePlaceholder from "./ImagePlaceholder";
import type { CatalogCategory } from "@/data/catalog";

interface Props {
  category: CatalogCategory;
}

export default function CategoryCard({ category }: Props) {
  return (
    <Link
      href={`/catalogo/${category.slug}`}
      prefetch={true}
      className="group h-full flex flex-col bg-white rounded-(--radius-card) overflow-hidden shadow-(--shadow-card) hover:shadow-(--shadow-card-hover) hover:scale-[1.04] hover:-translate-y-1.5 transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
    >
      <div className="aspect-square overflow-hidden relative">
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
        ) : (
          <ImagePlaceholder
            className="w-full h-full"
            text={category.name}
          />
        )}
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-5 text-center">
        <h3 className="font-serif text-lg text-andes-black tracking-wide">
          {category.name}
        </h3>
        {category.description && (
          <p className="mt-1 text-xs text-andes-mountain tracking-wider leading-relaxed">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
}
