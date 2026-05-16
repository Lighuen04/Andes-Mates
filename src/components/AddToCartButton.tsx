"use client";

import { useCart } from "@/context/CartContext";
import type { CatalogProduct } from "@/data/catalog";

interface Props {
  product: CatalogProduct;
  className?: string;
}

export default function AddToCartButton({
  product,
  className = "",
}: Props) {
  const { addItem } = useCart();

  const isAvailable = product.available && product.stock > 0;

  if (!isAvailable) {
    return (
      <span
        className={`inline-block px-4 py-2 text-xs uppercase tracking-widest text-andes-mountain/50 bg-andes-snow/50 rounded-(--radius-button) cursor-not-allowed ${className}`}
      >
        No disponible
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        addItem({
          id: product.id,
          name: product.name,
          slug: product.slug,
          category: product.category,
          subcategory: product.subcategory ?? null,
          price: product.price,
          imageUrl: product.primary_image_url ?? product.imageUrl,
        });
      }}
      className={`inline-block px-4 py-2 text-xs uppercase tracking-widest font-medium text-andes-white bg-andes-ice hover:bg-andes-blue rounded-(--radius-button) transition-all duration-(--transition-standard) cursor-pointer ${className}`}
    >
      Agregar al carrito
    </button>
  );
}
