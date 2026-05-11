import Link from "next/link";
import ImagePlaceholder from "./ImagePlaceholder";
import type { CatalogProduct } from "@/data/catalog";

interface Props {
  product: CatalogProduct;
  href: string;
}

export default function ProductCard({ product, href }: Props) {
  return (
    <Link
      href={href}
      className="group block bg-white border border-andes-snow overflow-hidden hover:border-andes-ice/40 hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-square overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <ImagePlaceholder
            className="w-full h-full"
            text={product.name}
          />
        )}
      </div>
      <div className="p-4 text-center">
        <h3 className="text-sm font-medium text-andes-black tracking-wide">
          {product.name}
        </h3>
        {!product.available && (
          <p className="mt-1 text-[10px] uppercase tracking-widest text-red-600">
            No disponible
          </p>
        )}
      </div>
    </Link>
  );
}
