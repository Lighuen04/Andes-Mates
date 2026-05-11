"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIAS } from "@/types/product";
import type { Product, ProductFormData } from "@/types/product";

interface Props {
  product?: Product | null;
}

export default function ProductForm({ product }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = !!product;

  const [formData, setFormData] = useState<ProductFormData>({
    nombre: "",
    descripcion: "",
    categoria: "calabaza",
    precio: null,
    mostrar_precio: true,
    disponible: true,
    destacado: false,
    imagen_url: null,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({
        nombre: product.nombre,
        descripcion: product.descripcion,
        categoria: product.categoria,
        precio: product.precio,
        mostrar_precio: product.mostrar_precio,
        disponible: product.disponible,
        destacado: product.destacado,
        imagen_url: product.imagen_url,
      });
    }
  }, [product]);

  const handleImageUpload = async (): Promise<string | null> => {
    if (!imageFile) return formData.imagen_url;

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, imageFile);

    if (uploadError) {
      setError("Error al subir la imagen");
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    if (!formData.nombre.trim()) {
      setError("El nombre es obligatorio");
      setSaving(false);
      return;
    }

    setUploading(true);
    const imagenUrl = await handleImageUpload();
    setUploading(false);

    if (imagenUrl === null && imageFile) {
      setSaving(false);
      return;
    }

    const payload: Partial<ProductFormData> = {
      ...formData,
      imagen_url: imagenUrl,
    };

    if (isEditing && product) {
      const { error: updateError } = await supabase
        .from("products")
        .update(payload)
        .eq("id", product.id);

      if (updateError) {
        setError("Error al actualizar el producto");
        setSaving(false);
        return;
      }
    } else {
      const slug = formData.nombre
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/-+/g, "-");

      const { error: insertError } = await supabase.from("products").insert({
        ...payload,
        slug,
      });

      if (insertError) {
        setError("Error al crear el producto");
        setSaving(false);
        return;
      }
    }

    router.push("/admin/productos");
    router.refresh();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "precio") {
      setFormData((prev) => ({
        ...prev,
        precio: value ? parseFloat(value) : null,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      {/* Nombre */}
      <div>
        <label
          htmlFor="nombre"
          className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1"
        >
          Nombre *
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-andes-snow bg-white text-andes-black text-sm focus:outline-none focus:border-andes-ice"
        />
      </div>

      {/* Categoría */}
      <div>
        <label
          htmlFor="categoria"
          className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1"
        >
          Categoría
        </label>
        <select
          id="categoria"
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-andes-snow bg-white text-andes-black text-sm focus:outline-none focus:border-andes-ice"
        >
          {CATEGORIAS.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Descripción */}
      <div>
        <label
          htmlFor="descripcion"
          className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1"
        >
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={4}
          value={formData.descripcion}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-andes-snow bg-white text-andes-black text-sm focus:outline-none focus:border-andes-ice resize-none"
        />
      </div>

      {/* Precio */}
      <div>
        <label
          htmlFor="precio"
          className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1"
        >
          Precio (ARS)
        </label>
        <input
          id="precio"
          name="precio"
          type="number"
          step="0.01"
          value={formData.precio ?? ""}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-andes-snow bg-white text-andes-black text-sm focus:outline-none focus:border-andes-ice"
        />
      </div>

      {/* Checkboxes */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="mostrar_precio"
            checked={formData.mostrar_precio}
            onChange={handleChange}
            className="w-4 h-4 accent-andes-black"
          />
          <span className="text-xs uppercase tracking-widest text-andes-mountain">
            Mostrar precio en la web
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="disponible"
            checked={formData.disponible}
            onChange={handleChange}
            className="w-4 h-4 accent-andes-black"
          />
          <span className="text-xs uppercase tracking-widest text-andes-mountain">
            Producto disponible
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="destacado"
            checked={formData.destacado}
            onChange={handleChange}
            className="w-4 h-4 accent-andes-black"
          />
          <span className="text-xs uppercase tracking-widest text-andes-mountain">
            Producto destacado (aparece en Home)
          </span>
        </label>
      </div>

      {/* Imagen */}
      <div>
        <label
          htmlFor="imagen"
          className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1"
        >
          Imagen del producto
        </label>
        <input
          id="imagen"
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full text-sm text-andes-mountain file:mr-4 file:py-2 file:px-4 file:border file:border-andes-snow file:text-[10px] file:uppercase file:tracking-widest file:bg-white file:text-andes-mountain hover:file:bg-andes-snow/50"
        />
        {formData.imagen_url && !imageFile && (
          <p className="mt-2 text-[10px] text-andes-mountain">
            Imagen actual: {formData.imagen_url.split("/").pop()}
          </p>
        )}
      </div>

      {error && (
        <p className="text-red-600 text-xs uppercase tracking-widest">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="px-6 py-3 bg-andes-black text-andes-white text-[10px] uppercase tracking-widest font-medium hover:bg-andes-blue transition-colors disabled:opacity-50"
        >
          {uploading
            ? "Subiendo imagen..."
            : saving
            ? "Guardando..."
            : isEditing
            ? "Guardar cambios"
            : "Crear producto"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/productos")}
          className="px-6 py-3 border border-andes-snow text-andes-mountain text-[10px] uppercase tracking-widest hover:bg-andes-snow transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
