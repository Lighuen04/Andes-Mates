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
      className="group block bg-white border border-andes-snow overflow-hidden hover:border-andes-ice/40 hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-square overflow-hidden">
        {category.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <ImagePlaceholder
            className="w-full h-full"
            text={category.name}
          />
        )}
      </div>
      <div className="p-4 text-center">
        <h3 className="text-sm font-medium text-andes-black tracking-wide uppercase">
          {category.name}
        </h3>
        {category.description && (
          <p className="mt-1 text-[10px] text-andes-mountain tracking-widest">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
}
