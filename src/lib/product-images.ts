import { createClient } from "./supabase/server";
import type { ProductImage } from "@/types/site";

export async function getProductImages(productId: string): Promise<ProductImage[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function getPrimaryProductImage(productId: string): Promise<ProductImage | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .eq("is_primary", true)
    .maybeSingle();
  return data;
}

export async function createProductImage(
  productId: string,
  imageUrl: string,
  isPrimary: boolean = false
): Promise<ProductImage | null> {
  const supabase = await createClient();
  if (isPrimary) {
    await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId);
  }
  const { data } = await supabase
    .from("product_images")
    .insert({ product_id: productId, image_url: imageUrl, is_primary: isPrimary })
    .select()
    .single();
  return data;
}

export async function setPrimaryImage(imageId: string, productId: string): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("product_images")
    .update({ is_primary: false })
    .eq("product_id", productId);
  await supabase
    .from("product_images")
    .update({ is_primary: true })
    .eq("id", imageId);
}

export async function deleteProductImage(imageId: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("product_images").delete().eq("id", imageId);
}
