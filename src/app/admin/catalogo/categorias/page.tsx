"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Category, Subcategory } from "@/types/site";

export default function AdminCategoriasPage() {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSubcategoryForm, setShowSubcategoryForm] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  // Form state
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catActive, setCatActive] = useState(true);
  const [catFile, setCatFile] = useState<File | null>(null);
  const [catImageUrl, setCatImageUrl] = useState("");

  const [subName, setSubName] = useState("");
  const [subSlug, setSubSlug] = useState("");
  const [subDesc, setSubDesc] = useState("");
  const [subActive, setSubActive] = useState(true);
  const [subFile, setSubFile] = useState<File | null>(null);
  const [subImageUrl, setSubImageUrl] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");

  const loadCategories = useCallback(async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    setCategories(data ?? []);
    setLoading(false);
  }, []);

  const loadSubcategories = useCallback(async () => {
    const { data } = await supabase
      .from("subcategories")
      .select("*")
      .order("name");
    setSubcategories(data ?? []);
  }, []);

  useEffect(() => {
    loadCategories();
    loadSubcategories();
  }, []);

  const resetCategoryForm = () => {
    setCatName("");
    setCatSlug("");
    setCatDesc("");
    setCatActive(true);
    setCatFile(null);
    setCatImageUrl("");
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  const resetSubcategoryForm = () => {
    setSubName("");
    setSubSlug("");
    setSubDesc("");
    setSubActive(true);
    setSubFile(null);
    setSubImageUrl("");
    setEditingSubcategory(null);
    setShowSubcategoryForm(false);
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatDesc(cat.description ?? "");
    setCatActive(cat.is_active);
    setCatImageUrl(cat.image_url ?? "");
    setShowCategoryForm(true);
  };

  const handleEditSubcategory = (sub: Subcategory) => {
    setEditingSubcategory(sub);
    setSubName(sub.name);
    setSubSlug(sub.slug);
    setSubDesc(sub.description ?? "");
    setSubActive(sub.is_active);
    setSubImageUrl(sub.image_url ?? "");
    setSubCategoryId(sub.category_id);
    setShowSubcategoryForm(true);
  };

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-");

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = catSlug || slugify(catName);

    let imageUrl = catImageUrl;
    if (catFile) {
      const fileExt = catFile.name.split(".").pop();
      const fileName = `cat-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("category-images")
        .upload(fileName, catFile, { upsert: true });
      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("category-images")
          .getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }
    }

    const payload = {
      name: catName,
      slug,
      description: catDesc || null,
      image_url: imageUrl || null,
      is_active: catActive,
    };

    if (editingCategory) {
      await supabase.from("categories").update(payload).eq("id", editingCategory.id);
    } else {
      await supabase.from("categories").insert(payload);
    }

    resetCategoryForm();
    loadCategories();
  };

  const handleSaveSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = subSlug || slugify(subName);

    let imageUrl = subImageUrl;
    if (subFile) {
      const fileExt = subFile.name.split(".").pop();
      const fileName = `subcat-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("category-images")
        .upload(fileName, subFile, { upsert: true });
      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("category-images")
          .getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }
    }

    const payload = {
      category_id: subCategoryId || selectedCategoryId,
      name: subName,
      slug,
      description: subDesc || null,
      image_url: imageUrl || null,
      is_active: subActive,
    };

    if (editingSubcategory) {
      await supabase.from("subcategories").update(payload).eq("id", editingSubcategory.id);
    } else {
      await supabase.from("subcategories").insert(payload);
    }

    resetSubcategoryForm();
    loadSubcategories();
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("¿Eliminar esta categoría? También se eliminarán sus subcategorías.")) return;
    await supabase.from("categories").delete().eq("id", id);
    loadCategories();
    loadSubcategories();
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (!confirm("¿Eliminar esta subcategoría?")) return;
    await supabase.from("subcategories").delete().eq("id", id);
    loadSubcategories();
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-andes-mountain text-sm uppercase tracking-widest">Cargando...</p>
      </div>
    );
  }

  const subsByCategory = (catId: string) =>
    subcategories.filter((s) => s.category_id === catId);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light tracking-wider text-andes-black mb-2">
            Categorías
          </h1>
          <p className="text-andes-mountain text-xs uppercase tracking-widest">
            Administración de categorías y subcategorías
          </p>
        </div>
        <button
          onClick={() => setShowCategoryForm(true)}
          className="px-4 py-2 bg-andes-black text-andes-white text-[10px] uppercase tracking-widest font-medium hover:bg-andes-blue transition-colors"
        >
          Nueva categoría
        </button>
      </div>

      {/* Category Form */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-light tracking-wider text-andes-black mb-4">
              {editingCategory ? "Editar categoría" : "Nueva categoría"}
            </h2>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">Nombre *</label>
                <input type="text" value={catName} onChange={(e) => setCatName(e.target.value)} required
                  className="w-full px-4 py-3 border border-andes-snow bg-white text-andes-black text-sm focus:outline-none focus:border-andes-ice" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">Slug</label>
                <input type="text" value={catSlug} onChange={(e) => setCatSlug(e.target.value)}
                  className="w-full px-4 py-3 border border-andes-snow bg-white text-andes-black text-sm focus:outline-none focus:border-andes-ice" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">Descripción</label>
                <textarea rows={3} value={catDesc} onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full px-4 py-3 border border-andes-snow bg-white text-andes-black text-sm focus:outline-none focus:border-andes-ice resize-none" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">Imagen</label>
                <input type="file" accept="image/*" onChange={(e) => setCatFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-andes-mountain file:mr-4 file:py-2 file:px-4 file:border file:border-andes-snow file:text-[10px] file:uppercase file:tracking-widest file:bg-white file:text-andes-mountain hover:file:bg-andes-snow/50" />
                {(catImageUrl || editingCategory?.image_url) && (
                  <p className="mt-1 text-[10px] text-andes-mountain">Imagen actual guardada</p>
                )}
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={catActive} onChange={(e) => setCatActive(e.target.checked)}
                  className="w-4 h-4 accent-andes-black" />
                <span className="text-xs uppercase tracking-widest text-andes-mountain">Activa</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="px-6 py-3 bg-andes-black text-andes-white text-[10px] uppercase tracking-widest font-medium hover:bg-andes-blue transition-colors">
                  {editingCategory ? "Guardar cambios" : "Crear"}
                </button>
                <button type="button" onClick={resetCategoryForm}
                  className="px-6 py-3 border border-andes-snow text-andes-mountain text-[10px] uppercase tracking-widest hover:bg-andes-snow transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subcategory Form */}
      {showSubcategoryForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-light tracking-wider text-andes-black mb-4">
              {editingSubcategory ? "Editar subcategoría" : "Nueva subcategoría"}
            </h2>
            <form onSubmit={handleSaveSubcategory} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">Categoría *</label>
                <select value={subCategoryId || selectedCategoryId} onChange={(e) => setSubCategoryId(e.target.value)} required
                  className="w-full px-4 py-3 border border-andes-snow bg-white text-andes-black text-sm focus:outline-none focus:border-andes-ice">
                  <option value="">Seleccionar...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">Nombre *</label>
                <input type="text" value={subName} onChange={(e) => setSubName(e.target.value)} required
                  className="w-full px-4 py-3 border border-andes-snow bg-white text-andes-black text-sm focus:outline-none focus:border-andes-ice" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">Slug</label>
                <input type="text" value={subSlug} onChange={(e) => setSubSlug(e.target.value)}
                  className="w-full px-4 py-3 border border-andes-snow bg-white text-andes-black text-sm focus:outline-none focus:border-andes-ice" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">Descripción</label>
                <textarea rows={3} value={subDesc} onChange={(e) => setSubDesc(e.target.value)}
                  className="w-full px-4 py-3 border border-andes-snow bg-white text-andes-black text-sm focus:outline-none focus:border-andes-ice resize-none" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-andes-mountain mb-1">Imagen</label>
                <input type="file" accept="image/*" onChange={(e) => setSubFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-andes-mountain file:mr-4 file:py-2 file:px-4 file:border file:border-andes-snow file:text-[10px] file:uppercase file:tracking-widest file:bg-white file:text-andes-mountain hover:file:bg-andes-snow/50" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={subActive} onChange={(e) => setSubActive(e.target.checked)}
                  className="w-4 h-4 accent-andes-black" />
                <span className="text-xs uppercase tracking-widest text-andes-mountain">Activa</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="px-6 py-3 bg-andes-black text-andes-white text-[10px] uppercase tracking-widest font-medium hover:bg-andes-blue transition-colors">
                  {editingSubcategory ? "Guardar cambios" : "Crear"}
                </button>
                <button type="button" onClick={resetSubcategoryForm}
                  className="px-6 py-3 border border-andes-snow text-andes-mountain text-[10px] uppercase tracking-widest hover:bg-andes-snow transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories list */}
      <div className="space-y-6">
        {categories.length === 0 && (
          <div className="border border-andes-snow p-8 text-center text-andes-mountain text-sm">
            No hay categorías. Creá la primera.
          </div>
        )}
        {categories.map((cat) => (
          <div key={cat.id} className="border border-andes-snow overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-andes-snow/30">
              <div className="flex items-center gap-3">
                {cat.image_url && (
                  <img src={cat.image_url} alt="" className="w-10 h-10 object-cover" />
                )}
                <div>
                  <h3 className="text-sm font-medium text-andes-black">{cat.name}</h3>
                  <p className="text-[10px] text-andes-mountain uppercase tracking-widest">
                    /{cat.slug} {!cat.is_active && <span className="text-red-600 ml-2">(inactiva)</span>}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditCategory(cat)}
                  className="text-[10px] uppercase tracking-widest text-andes-ice hover:underline">
                  Editar
                </button>
                <button onClick={() => { setSelectedCategoryId(cat.id); setShowSubcategoryForm(true); }}
                  className="text-[10px] uppercase tracking-widest text-andes-black hover:underline">
                  + Sub
                </button>
                <button onClick={() => handleDeleteCategory(cat.id)}
                  className="text-[10px] uppercase tracking-widest text-red-600 hover:underline">
                  Eliminar
                </button>
              </div>
            </div>

            {/* Subcategories */}
            {subsByCategory(cat.id).length > 0 && (
              <div className="divide-y divide-andes-snow">
                {subsByCategory(cat.id).map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between p-3 px-8">
                    <div className="flex items-center gap-3">
                      {sub.image_url && (
                        <img src={sub.image_url} alt="" className="w-8 h-8 object-cover" />
                      )}
                      <div>
                        <span className="text-sm text-andes-black">{sub.name}</span>
                        <span className="text-[10px] text-andes-mountain ml-2 uppercase tracking-widest">
                          /{sub.slug}
                          {!sub.is_active && <span className="text-red-600 ml-2">(inactiva)</span>}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditSubcategory(sub)}
                        className="text-[10px] uppercase tracking-widest text-andes-ice hover:underline">
                        Editar
                      </button>
                      <button onClick={() => handleDeleteSubcategory(sub.id)}
                        className="text-[10px] uppercase tracking-widest text-red-600 hover:underline">
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
