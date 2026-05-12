"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/product";
import { formatPrecio } from "@/lib/utils";

export default function AdminProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const loadData = async () => {
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("id, name").eq("is_active", true),
    ]);
    setProducts(productsRes.data ?? []);
    setCategories(categoriesRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await supabase.from("products").delete().eq("id", id);
    loadData();
  };

  const toggleIsActive = async (product: Product) => {
    await supabase
      .from("products")
      .update({ is_active: !product.is_active })
      .eq("id", product.id);
    loadData();
  };

  const toggleAvailable = async (product: Product) => {
    await supabase
      .from("products")
      .update({ available: !product.available })
      .eq("id", product.id);
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-andes-white">
        <p className="text-andes-mountain text-sm uppercase tracking-widest">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-andes-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-light tracking-wider text-andes-black">Productos</h1>
            <p className="text-xs uppercase tracking-widest text-andes-mountain mt-1">
              {products.length} producto(s)
            </p>
          </div>
          <Link
            href="/admin/productos/nuevo"
            className="px-4 py-2 bg-andes-black text-andes-white text-[10px] uppercase tracking-widest font-medium hover:bg-andes-blue transition-colors"
          >
            Nuevo producto
          </Link>
        </div>

        <div className="overflow-x-auto border border-andes-snow">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-andes-snow/50">
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-andes-mountain font-medium">Imagen</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-andes-mountain font-medium">Nombre</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-andes-mountain font-medium">Categoría</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-andes-mountain font-medium">Precio</th>
                <th className="text-center px-4 py-3 text-[10px] uppercase tracking-widest text-andes-mountain font-medium">Stock</th>
                <th className="text-center px-4 py-3 text-[10px] uppercase tracking-widest text-andes-mountain font-medium">Disponible</th>
                <th className="text-center px-4 py-3 text-[10px] uppercase tracking-widest text-andes-mountain font-medium">Activo</th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-andes-mountain font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-andes-snow hover:bg-andes-snow/20 transition-colors">
                  <td className="px-4 py-3">
                    {product.primary_image_url ? (
                      <img src={product.primary_image_url} alt="" className="w-10 h-10 object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-andes-snow/50" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-andes-black font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-andes-mountain text-[10px] uppercase tracking-widest">
                    {categoryMap.get(product.category_id ?? "") || "—"}
                  </td>
                  <td className="px-4 py-3 text-andes-mountain">
                    {product.show_price ? formatPrecio(product.price) : "-"}
                  </td>
                  <td className="px-4 py-3 text-center text-andes-mountain">{product.stock}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleAvailable(product)}
                      className={`text-[10px] uppercase tracking-widest px-3 py-1 border ${product.available ? "text-green-700 border-green-700" : "text-red-600 border-red-600"}`}>
                      {product.available ? "Sí" : "No"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleIsActive(product)}
                      className={`text-[10px] uppercase tracking-widest px-3 py-1 border ${product.is_active ? "text-andes-ice border-andes-ice" : "text-andes-mountain border-andes-snow"}`}>
                      {product.is_active ? "Sí" : "No"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/admin/productos/${product.id}`}
                        className="text-[10px] uppercase tracking-widest text-andes-ice hover:underline">
                        Editar
                      </Link>
                      <button onClick={() => handleDelete(product.id)}
                        className="text-[10px] uppercase tracking-widest text-red-600 hover:underline">
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-andes-mountain text-sm">
                    No hay productos.{" "}
                    <Link href="/admin/productos/nuevo" className="text-andes-ice underline">
                      Crear el primero
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
