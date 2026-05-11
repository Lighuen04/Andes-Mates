"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Product, ProductFormData } from "@/types/product";
import type { Category, Subcategory, ProductImage } from "@/types/site";

interface Props {
  product?: Product | null;
}

export default function ProductForm({ product }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = !!product;

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<ProductFormData>({
    nombre: "",
    descripcion: "",
    categoria: "",
    category_id: null,
    subcategory_id: null,
    precio: null,
    mostrar_precio: true,
    disponible: true,
    destacado: false,
    imagen_url: null,
    stock: 0,
  });

  useEffect(() => {
    supabase.from("categories").select("*").order("name").then(({ data }) => {
      setCategories(data ?? []);
    });
  }, []);

  useEffect(() => {
    if (formData.category_id) {
      supabase
        .from("subcategories")
        .select("*")
        .eq("category_id", formData.category_id)
        .order("name")
        .then(({ data }) => {
          setSubcategories(data ?? []);
        });
    } else {
      setSubcategories([]);
    }
  }, [formData.category_id]);

  useEffect(() => {
    if (product) {
      setFormData({
        nombre: product.nombre,
        descripcion: product.descripcion,
        categoria: product.categoria,
        category_id: product.category_id,
        subcategory_id: product.subcategory_id,
        precio: product.precio,
        mostrar_precio: product.mostrar_precio,
        disponible: product.disponible,
        destacado: product.destacado,
        imagen_url: product.imagen_url,
        stock: product.stock,
      });
      loadImages(product.id);
    }
  }, [product]);

  const loadImages = useCallback(async (productId: string) => {
    const { data } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: true });
    setImages(data ?? []);
  }, []);

  const handleImageUpload = async (): Promise<string | null> => {
    if (newFiles.length === 0) return formData.imagen_url;

    const file = newFiles[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

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

    let imagenUrl = formData.imagen_url;
    if (newFiles.length > 0) {
      setUploading(true);
      imagenUrl = await handleImageUpload();
      setUploading(false);
      if (imagenUrl === null) {
        setSaving(false);
        return;
      }
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

      // Upload additional images
      if (newFiles.length > 1) {
        setUploading(true);
        for (let i = 1; i < newFiles.length; i++) {
          const file = newFiles[i];
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const { error: upErr } = await supabase.storage
            .from("product-images")
            .upload(fileName, file);
          if (!upErr) {
            const { data: urlData } = supabase.storage
              .from("product-images")
              .getPublicUrl(fileName);
            await supabase.from("product_images").insert({
              product_id: product.id,
              image_url: urlData.publicUrl,
              is_primary: false,
            });
          }
        }
        setUploading(false);
      }
    } else {
      const slug = formData.nombre
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/-+/g, "-");

      const { data: newProduct, error: insertError } = await supabase
        .from("products")
        .insert({ ...payload, slug })
        .select()
        .single();

      if (insertError || !newProduct) {
        setError("Error al crear el producto");
        setSaving(false);
        return;
      }

      // Upload additional images
      if (newFiles.length > 1) {
        setUploading(true);
        for (let i = 1; i < newFiles.length; i++) {
          const file = newFiles[i];
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const { error: upErr } = await supabase.storage
            .from("product-images")
            .upload(fileName, file);
          if (!upErr) {
            const { data: urlData } = supabase.storage
              .from("product-images")
              .getPublicUrl(fileName);
            await supabase.from("product_images").insert({
              product_id: newProduct.id,
              image_url: urlData.publicUrl,
              is_primary: false,
            });
          }
        }
        setUploading(false);
      }
    }

    router.push("/admin/productos");
    router.refresh();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "precio" || name === "stock") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseFloat(value) : null,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    if (!product) return;
    await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", product.id);
    await supabase
      .from("product_images")
      .update({ is_primary: true })
      .eq("id", imageId);
    loadImages(product.id);
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("¿Eliminar esta imagen?")) return;
    const img = images.find((i) => i.id === imageId);
    if (img) {
      await supabase.storage
        .from("product-images")
        .remove([img.image_url.split("/").pop()!]);
    }
    await supabase.from("product_images").delete().eq("id", imageId);
    if (product) loadImages(product.id);
  };

  const handleAddGalleryFiles = (files: FileList | null) => {
    if (!files) return;
    setNewFiles((prev) => [...prev, ...Array.from(files)]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div>
        <label htmlFor="nombre" className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">
          Nombre *
        </label>
        <input id="nombre" name="nombre" type="text" value={formData.nombre}
          onChange={handleChange} required
          className="w-full px-4 py-3 border border-andes-snow bg-white text-andes-black text-sm focus:outline-none focus:border-andes-ice" />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category_id" className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">
          Categoría
        </label>
        <select id="category_id" name="category_id" value={formData.category_id ?? ""}
          onChange={(e) => {
            const val = e.target.value || null;
            setFormData((prev) => ({ ...prev, category_id: val, subcategory_id: null }));
          }}
          className="w-full px-4 py-3 border border-andes-snow bg-white text-andes-black text-sm focus:outline-none focus:border-andes-ice">
          <option value="">Sin categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Subcategory */}
      {subcategories.length > 0 && (
        <div>
          <label htmlFor="subcategory_id" className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">
            Subcategoría
          </label>
          <select id="subcategory_id" name="subcategory_id" value={formData.subcategory_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, subcategory_id: e.target.value || null }))}
            className="w-full px-4 py-3 border border-andes-snow bg-white text-andes-black text-sm focus:outline-none focus:border-andes-ice">
            <option value="">Sin subcategoría</option>
            {subcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="descripcion" className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">
          Descripción
        </label>
        <textarea id="descripcion" name="descripcion" rows={4} value={formData.descripcion}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-andes-snow bg-white text-andes-black text-sm focus:outline-none focus:border-andes-ice resize-none" />
      </div>

      <div>
        <label htmlFor="precio" className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">
          Precio (ARS)
        </label>
        <input id="precio" name="precio" type="number" step="0.01" value={formData.precio ?? ""}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-andes-snow bg-white text-andes-black text-sm focus:outline-none focus:border-andes-ice" />
      </div>

      <div>
        <label htmlFor="stock" className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">
          Stock
        </label>
        <input id="stock" name="stock" type="number" step="1" value={formData.stock}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-andes-snow bg-white text-andes-black text-sm focus:outline-none focus:border-andes-ice" />
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="mostrar_precio" checked={formData.mostrar_precio}
            onChange={handleChange} className="w-4 h-4 accent-andes-black" />
          <span className="text-xs uppercase tracking-widest text-andes-mountain">Mostrar precio en la web</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="disponible" checked={formData.disponible}
            onChange={handleChange} className="w-4 h-4 accent-andes-black" />
          <span className="text-xs uppercase tracking-widest text-andes-mountain">Producto disponible</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="destacado" checked={formData.destacado}
            onChange={handleChange} className="w-4 h-4 accent-andes-black" />
          <span className="text-xs uppercase tracking-widest text-andes-mountain">Producto destacado (aparece en Home)</span>
        </label>
      </div>

      {/* Main image */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">
          Imagen principal
        </label>
        <input type="file" accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setNewFiles((prev) => [e.target.files![0], ...prev]);
            }
          }}
          className="w-full text-sm text-andes-mountain file:mr-4 file:py-2 file:px-4 file:border file:border-andes-snow file:text-[10px] file:uppercase file:tracking-widest file:bg-white file:text-andes-mountain hover:file:bg-andes-snow/50" />
        {formData.imagen_url && newFiles.length === 0 && (
          <p className="mt-2 text-[10px] text-andes-mountain">
            Imagen actual: {formData.imagen_url.split("/").pop()}
          </p>
        )}
      </div>

      {/* Gallery */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">
          Galería de fotos (adicionales)
        </label>
        <input type="file" accept="image/*" multiple
          onChange={(e) => handleAddGalleryFiles(e.target.files)}
          className="w-full text-sm text-andes-mountain file:mr-4 file:py-2 file:px-4 file:border file:border-andes-snow file:text-[10px] file:uppercase file:tracking-widest file:bg-white file:text-andes-mountain hover:file:bg-andes-snow/50" />
      </div>

      {/* Existing images gallery */}
      {images.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-widest text-andes-mountain mb-2">
            Fotos guardadas ({images.length})
          </p>
          <div className="flex flex-wrap gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative group">
                <img src={img.image_url} alt="" className="w-20 h-20 object-cover border border-andes-snow" />
                {img.is_primary && (
                  <span className="absolute top-0 left-0 bg-andes-black text-andes-white text-[8px] px-1 uppercase tracking-widest">
                    Principal
                  </span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  {!img.is_primary && (
                    <button type="button" onClick={() => handleSetPrimary(img.id)}
                      className="text-[8px] text-white bg-andes-ice px-1 py-0.5 uppercase tracking-widest">
                      Principal
                    </button>
                  )}
                  <button type="button" onClick={() => handleDeleteImage(img.id)}
                    className="text-[8px] text-white bg-red-600 px-1 py-0.5 uppercase tracking-widest">
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {newFiles.length > 1 && (
        <p className="text-[10px] text-andes-ice uppercase tracking-widest">
          {newFiles.length - 1} foto(s) adicional(es) para subir
        </p>
      )}

      {error && (
        <p className="text-red-600 text-xs uppercase tracking-widest">{error}</p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={saving || uploading}
          className="px-6 py-3 bg-andes-black text-andes-white text-[10px] uppercase tracking-widest font-medium hover:bg-andes-blue transition-colors disabled:opacity-50">
          {uploading ? "Subiendo imágenes..." : saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear producto"}
        </button>
        <button type="button" onClick={() => router.push("/admin/productos")}
          className="px-6 py-3 border border-andes-snow text-andes-mountain text-[10px] uppercase tracking-widest hover:bg-andes-snow transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}
