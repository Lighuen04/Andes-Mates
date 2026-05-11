import { createClient } from "./supabase/server";
import type { Category, Subcategory, CategoryFormData, SubcategoryFormData } from "@/types/site";

// ── Categories ──

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  return data ?? [];
}

export async function getActiveCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("name");
  return data ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export async function createCategory(formData: CategoryFormData): Promise<Category | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .insert(formData)
    .select()
    .single();
  return data;
}

export async function updateCategory(id: string, formData: Partial<CategoryFormData>): Promise<Category | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .update(formData)
    .eq("id", id)
    .select()
    .single();
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
}

// ── Subcategories ──

export async function getSubcategories(categoryId?: string): Promise<Subcategory[]> {
  const supabase = await createClient();
  let query = supabase.from("subcategories").select("*").order("name");
  if (categoryId) query = query.eq("category_id", categoryId);
  const { data } = await query;
  return data ?? [];
}

export async function getActiveSubcategories(categoryId?: string): Promise<Subcategory[]> {
  const supabase = await createClient();
  let query = supabase
    .from("subcategories")
    .select("*")
    .eq("is_active", true)
    .order("name");
  if (categoryId) query = query.eq("category_id", categoryId);
  const { data } = await query;
  return data ?? [];
}

export async function getSubcategoryBySlug(categorySlug: string, subSlug: string): Promise<Subcategory | null> {
  const supabase = await createClient();
  const cat = await getCategoryBySlug(categorySlug);
  if (!cat) return null;
  const { data } = await supabase
    .from("subcategories")
    .select("*")
    .eq("category_id", cat.id)
    .eq("slug", subSlug)
    .single();
  return data;
}

export async function getSubcategoryById(id: string): Promise<Subcategory | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("subcategories")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export async function createSubcategory(formData: SubcategoryFormData): Promise<Subcategory | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("subcategories")
    .insert(formData)
    .select()
    .single();
  return data;
}

export async function updateSubcategory(id: string, formData: Partial<SubcategoryFormData>): Promise<Subcategory | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("subcategories")
    .update(formData)
    .eq("id", id)
    .select()
    .single();
  return data;
}

export async function deleteSubcategory(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("subcategories").delete().eq("id", id);
}
