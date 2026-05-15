import Link from "next/link";
import ImagePlaceholder from "./ImagePlaceholder";
import type { CatalogCategory } from "@/data/catalog";

interface Props {
  category: CatalogCategory;
}

export default function CategoryCard({ category }: Props) {
  return (
    <Link
      href={`/catalogo/${category.slug}`}
      className="group block bg-white rounded-(--radius-card) overflow-hidden shadow-(--shadow-card) hover:shadow-(--shadow-card-hover) hover:-translate-y-1 transition-all duration-(--transition-standard)"
    >
      <div className="aspect-square overflow-hidden">
        {category.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-(--transition-slow)"
          />
        ) : (
          <ImagePlaceholder
            className="w-full h-full"
            text={category.name}
          />
        )}
      </div>
      <div className="p-5 text-center">
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
