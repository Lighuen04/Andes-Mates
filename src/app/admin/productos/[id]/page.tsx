"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ProductForm from "@/components/ProductForm";
import type { Product } from "@/types/product";

export default function EditarProductoPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("id", params.id)
      .single()
      .then(({ data }) => {
        setProduct(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-andes-white">
        <p className="text-andes-mountain text-sm uppercase tracking-widest">
          Cargando...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-andes-white">
        <p className="text-andes-mountain text-sm uppercase tracking-widest">
          Producto no encontrado
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-andes-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-light tracking-wider text-andes-black mb-8">
          Editar: {product.name}
        </h1>
        <ProductForm product={product} />
      </div>
    </div>
  );
}
