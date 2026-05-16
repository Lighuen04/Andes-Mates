"use client";

import Link from "next/link";
import ImagePlaceholder from "./ImagePlaceholder";
import AddToCartButton from "./AddToCartButton";
import type { CatalogProduct } from "@/data/catalog";
import { formatPrice } from "@/lib/format";

interface Props {
  product: CatalogProduct;
  href: string;
}

export default function ProductCard({ product, href }: Props) {
  return (
    <div className="group h-full flex flex-col bg-white rounded-(--radius-card) overflow-hidden shadow-(--shadow-card) hover:shadow-(--shadow-card-hover) hover:scale-[1.04] hover:-translate-y-1.5 transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]">
      <Link
        href={href}
        className="block aspect-square overflow-hidden relative"
      >
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
      </Link>
      <div className="flex-1 flex flex-col items-center justify-center p-5 text-center">
        <Link href={href}>
          <h3 className="font-serif text-base text-andes-black">
            {product.name}
          </h3>
        </Link>
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
        <div className="mt-3">
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
