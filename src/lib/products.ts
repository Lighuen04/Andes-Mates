import { createClient } from "./supabase/server";
import type { Product, ProductFormData, Categoria } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getPublishedProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("disponible", true)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("destacado", true)
    .eq("disponible", true)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getProductsByCategoria(
  categoria: string
): Promise<Product[]> {
  if (categoria === "todas") return getPublishedProducts();

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("categoria", categoria)
    .eq("disponible", true)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  return data;
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  return data;
}

export async function createProduct(
  formData: ProductFormData
): Promise<Product | null> {
  const supabase = await createClient();

  const slug =
    formData.slug ??
    formData.nombre
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-");

  const { data } = await supabase
    .from("products")
    .insert({ ...formData, slug })
    .select()
    .single();

  return data;
}

export async function updateProduct(
  id: string,
  formData: Partial<ProductFormData>
): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .update(formData)
    .eq("id", id)
    .select()
    .single();

  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", id);
}
