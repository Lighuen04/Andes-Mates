import Link from "next/link";
import ImagePlaceholder from "./ImagePlaceholder";
import type { CatalogProduct } from "@/data/catalog";

interface Props {
  product: CatalogProduct;
  href: string;
}

function formatPrice(price: number | null): string {
  if (price === null) return "";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductCard({ product, href }: Props) {
  return (
    <Link
      href={href}
      className="group h-full flex flex-col bg-white rounded-(--radius-card) overflow-hidden shadow-(--shadow-card) hover:shadow-(--shadow-card-hover) hover:scale-[1.04] hover:-translate-y-1.5 transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
    >
      <div className="aspect-square overflow-hidden relative">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
        ) : (
          <ImagePlaceholder
            className="w-full h-full"
            text={product.name}
          />
        )}
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-5 text-center">
        <h3 className="font-serif text-base text-andes-black">
          {product.name}
        </h3>
        {product.show_price && product.price !== null && (
          <p className="mt-1.5 text-sm font-medium text-andes-ice">
            {formatPrice(product.price)}
          </p>
        )}
        {product.stock === 0 && (
          <p className="mt-1.5 text-[10px] uppercase tracking-[0.15em] text-andes-mountain/60">
            Sin stock
          </p>
        )}
        {!product.available && (
          <p className="mt-1.5 text-[10px] uppercase tracking-[0.15em] text-red-500/70">
            No disponible
          </p>
        )}
      </div>
    </Link>
  );
}
