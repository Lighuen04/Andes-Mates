"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/product";
import { CATEGORIAS } from "@/types/product";
import { formatPrecio } from "@/lib/utils";

export default function AdminProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts(data ?? []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await supabase.from("products").delete().eq("id", id);
    loadProducts();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const toggleDestacado = async (product: Product) => {
    await supabase
      .from("products")
      .update({ destacado: !product.destacado })
      .eq("id", product.id);
    loadProducts();
  };

  const toggleDisponible = async (product: Product) => {
    await supabase
      .from("products")
      .update({ disponible: !product.disponible })
      .eq("id", product.id);
    loadProducts();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-andes-white">
        <p className="text-andes-mountain text-sm uppercase tracking-widest">
          Cargando...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-andes-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-light tracking-wider text-andes-black">
              Productos
            </h1>
            <p className="text-xs uppercase tracking-widest text-andes-mountain mt-1">
              {products.length} producto(s)
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/productos/nuevo"
              className="px-4 py-2 bg-andes-black text-andes-white text-[10px] uppercase tracking-widest font-medium hover:bg-andes-blue transition-colors"
            >
              Nuevo producto
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-andes-snow text-andes-mountain text-[10px] uppercase tracking-widest hover:bg-andes-snow transition-colors"
            >
              Salir
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-andes-snow">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-andes-snow/50">
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-andes-mountain font-medium">
                  Imagen
                </th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-andes-mountain font-medium">
                  Nombre
                </th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-andes-mountain font-medium">
                  Categoría
                </th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-andes-mountain font-medium">
                  Precio
                </th>
                <th className="text-center px-4 py-3 text-[10px] uppercase tracking-widest text-andes-mountain font-medium">
                  Disponible
                </th>
                <th className="text-center px-4 py-3 text-[10px] uppercase tracking-widest text-andes-mountain font-medium">
                  Destacado
                </th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-andes-mountain font-medium">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-andes-snow hover:bg-andes-snow/20 transition-colors"
                >
                  <td className="px-4 py-3">
                    {product.imagen_url ? (
                      <img
                        src={product.imagen_url}
                        alt=""
                        className="w-10 h-10 object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-andes-snow/50" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-andes-black font-medium">
                    {product.nombre}
                  </td>
                  <td className="px-4 py-3 text-andes-mountain text-[10px] uppercase tracking-widest">
                    {CATEGORIAS.find((c) => c.value === product.categoria)
                      ?.label || product.categoria}
                  </td>
                  <td className="px-4 py-3 text-andes-mountain">
                    {product.mostrar_precio
                      ? formatPrecio(product.precio)
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleDisponible(product)}
                      className={`text-[10px] uppercase tracking-widest px-3 py-1 border ${
                        product.disponible
                          ? "text-green-700 border-green-700"
                          : "text-red-600 border-red-600"
                      }`}
                    >
                      {product.disponible ? "Sí" : "No"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleDestacado(product)}
                      className={`text-[10px] uppercase tracking-widest px-3 py-1 border ${
                        product.destacado
                          ? "text-andes-ice border-andes-ice"
                          : "text-andes-mountain border-andes-snow"
                      }`}
                    >
                      {product.destacado ? "Sí" : "No"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <Link
                        href={`/admin/productos/${product.id}`}
                        className="text-[10px] uppercase tracking-widest text-andes-ice hover:underline"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-[10px] uppercase tracking-widest text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-andes-mountain text-sm"
                  >
                    No hay productos.{" "}
                    <Link
                      href="/admin/productos/nuevo"
                      className="text-andes-ice underline"
                    >
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
