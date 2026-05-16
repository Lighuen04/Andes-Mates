"use client";

import { StaggerGrid, StaggerItem } from "./StaggerContainer";
import ProductCard from "./ProductCard";
import type { CatalogProduct } from "@/data/catalog";

interface Props {
  products: CatalogProduct[];
  baseUrl: string;
}

export default function ProductGrid({ products, baseUrl }: Props) {
  const count = products.length;
  const shouldCenter = count > 0 && count < 5;

  if (count === 0) return null;

  return (
    <StaggerGrid
      className={
        shouldCenter
          ? "flex flex-wrap justify-center gap-6"
          : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto"
      }
    >
      {products.map((product) => (
        <StaggerItem key={product.id}>
          {shouldCenter ? (
            <div className="w-full sm:max-w-[280px]">
              <ProductCard
                product={product}
                href={`${baseUrl}/${product.slug}`}
              />
            </div>
          ) : (
            <ProductCard
              product={product}
              href={`${baseUrl}/${product.slug}`}
            />
          )}
        </StaggerItem>
      ))}
    </StaggerGrid>
  );
}
