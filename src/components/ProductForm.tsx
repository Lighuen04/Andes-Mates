"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import type { Product, ProductFormData } from "@/types/product";
import type { Category, Subcategory, ProductImage } from "@/types/site";

interface Props {
  product?: Product | null;
}

const defaultForm: ProductFormData = {
  name: "",
  description: null,
  category_id: null,
  subcategory_id: null,
  price: null,
  show_price: true,
  stock: 0,
  available: true,
  primary_image_url: null,
  sort_order: 0,
  is_active: true,
};

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

  const [formData, setFormData] = useState<ProductFormData>(defaultForm);

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
        name: product.name,
        description: product.description,
        category_id: product.category_id,
        subcategory_id: product.subcategory_id,
        price: product.price,
        show_price: product.show_price,
        stock: product.stock,
        available: product.available,
        primary_image_url: product.primary_image_url,
        sort_order: product.sort_order,
        is_active: product.is_active,
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
    if (newFiles.length === 0) return formData.primary_image_url;

    const file = newFiles[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    console.log("Subiendo archivo:", fileName, file.name, file.type, file.size);

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      console.error("Error detallado al subir:", uploadError);
      setError(`Error al subir la imagen: ${uploadError.message}`);
      return null;
    }

    console.log("Archivo subido exitosamente");

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    console.log("URL pública generada:", urlData.publicUrl);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    if (!formData.name?.trim()) {
      setError("El nombre es obligatorio");
      setSaving(false);
      return;
    }

    if (!formData.category_id) {
      setError("Seleccioná una categoría antes de crear el producto");
      setSaving(false);
      return;
    }

    let primaryImageUrl = formData.primary_image_url;
    if (newFiles.length > 0) {
      setUploading(true);
      primaryImageUrl = await handleImageUpload();
      setUploading(false);
      if (primaryImageUrl === null) {
        setSaving(false);
        return;
      }
    }

    const productPayload = {
      category_id: formData.category_id,
      subcategory_id: formData.subcategory_id || null,
      name: formData.name.trim(),
      slug: slugify(formData.name),
      description: formData.description?.trim() || null,
      price: formData.price ? Number(formData.price) : null,
      show_price: Boolean(formData.show_price),
      stock: Number(formData.stock || 0),
      available: Boolean(formData.available),
      primary_image_url: primaryImageUrl || null,
      sort_order: Number(formData.sort_order || 0),
      is_active: Boolean(formData.is_active),
    };

    if (isEditing && product) {
      const { error: updateError } = await supabase
        .from("products")
        .update(productPayload)
        .eq("id", product.id);

      if (updateError) {
        console.error("Error al actualizar producto:", updateError);
        setError(`Error al actualizar el producto: ${updateError.message}`);
        setSaving(false);
        return;
      }

      // Upload additional media
      if (newFiles.length > 1) {
        setUploading(true);
        for (let i = 1; i < newFiles.length; i++) {
          const file = newFiles[i];
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const mediaType = file.type.startsWith("video/") ? "video" : "image";
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
              media_url: urlData.publicUrl,
              media_type: mediaType,
              is_primary: false,
            });
          }
        }
        setUploading(false);
      }
    } else {
      console.log("Producto a insertar:", productPayload);

      const { data: newProduct, error: insertError } = await supabase
        .from("products")
        .insert(productPayload)
        .select()
        .single();

      if (insertError) {
        console.error("Error al crear producto:", insertError);
        setError(`Error al crear producto: ${insertError.message}`);
        setSaving(false);
        return;
      }

      if (!newProduct) {
        setError("Error al crear producto: no se recibieron datos");
        setSaving(false);
        return;
      }

      // Upload additional media
      if (newFiles.length > 1) {
        setUploading(true);
        for (let i = 1; i < newFiles.length; i++) {
          const file = newFiles[i];
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const mediaType = file.type.startsWith("video/") ? "video" : "image";
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
              media_url: urlData.publicUrl,
              media_type: mediaType,
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
    } else if (name === "price" || name === "stock" || name === "sort_order") {
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
    const img = images.find((i) => i.id === imageId);
    if (!img) return;

    await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", product.id);
    await supabase
      .from("product_images")
      .update({ is_primary: true })
      .eq("id", imageId);

    const mediaUrl = img.media_url || img.image_url;
    if (mediaUrl) {
      await supabase
        .from("products")
        .update({ primary_image_url: mediaUrl })
        .eq("id", product.id);
    }

    loadImages(product.id);
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("¿Eliminar este archivo?")) return;
    const img = images.find((i) => i.id === imageId);
    if (img) {
      const url = img.media_url || img.image_url;
      await supabase.storage
        .from("product-images")
        .remove([url.split("/").pop()!]);
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
        <label htmlFor="name" className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">
          Nombre *
        </label>
        <input id="name" name="name" type="text" value={formData.name ?? ""}
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
        <label htmlFor="description" className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">
          Descripción
        </label>
        <textarea id="description" name="description" rows={4} value={formData.description ?? ""}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-andes-snow bg-white text-andes-black text-sm focus:outline-none focus:border-andes-ice resize-none" />
      </div>

      <div>
        <label htmlFor="price" className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">
          Precio (ARS)
        </label>
        <input id="price" name="price" type="number" step="0.01" value={formData.price ?? ""}
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
          <input type="checkbox" name="show_price" checked={formData.show_price}
            onChange={handleChange} className="w-4 h-4 accent-andes-black" />
          <span className="text-xs uppercase tracking-widest text-andes-mountain">Mostrar precio en la web</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="available" checked={formData.available}
            onChange={handleChange} className="w-4 h-4 accent-andes-black" />
          <span className="text-xs uppercase tracking-widest text-andes-mountain">Producto disponible</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="is_active" checked={formData.is_active}
            onChange={handleChange} className="w-4 h-4 accent-andes-black" />
          <span className="text-xs uppercase tracking-widest text-andes-mountain">Producto activo</span>
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
        {formData.primary_image_url && newFiles.length === 0 && (
          <p className="mt-2 text-[10px] text-andes-mountain">
            Imagen actual: {formData.primary_image_url.split("/").pop()}
          </p>
        )}
      </div>

      {/* Gallery */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">
          Fotos / videos adicionales (opcional)
        </label>
        <input type="file" accept="image/*,video/*" multiple
          onChange={(e) => handleAddGalleryFiles(e.target.files)}
          className="w-full text-sm text-andes-mountain file:mr-4 file:py-2 file:px-4 file:border file:border-andes-snow file:text-[10px] file:uppercase file:tracking-widest file:bg-white file:text-andes-mountain hover:file:bg-andes-snow/50" />
      </div>

      {/* Existing media gallery */}
      {images.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-widest text-andes-mountain mb-2">
            Medios guardados ({images.length})
          </p>
          <div className="flex flex-wrap gap-3">
            {images.map((img) => {
              const url = img.media_url || img.image_url;
              const isVideo = img.media_type === "video";
              return (
                <div key={img.id} className="relative group">
                  {isVideo ? (
                    <div className="w-20 h-20 bg-andes-black flex items-center justify-center text-andes-white text-xl border border-andes-snow">
                      ▶
                    </div>
                  ) : (
                    <img src={url} alt="" className="w-20 h-20 object-cover border border-andes-snow" />
                  )}
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
              );
            })}
          </div>
        </div>
      )}

      {newFiles.length > 1 && (
        <p className="text-[10px] text-andes-ice uppercase tracking-widest">
          {newFiles.length - 1} archivo(s) adicional(es) para subir
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
