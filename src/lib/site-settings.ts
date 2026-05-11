import { createClient } from "./supabase/server";
import type { SiteSetting } from "@/types/site";

export async function getSiteSetting(key: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .single();
  return data?.value ?? null;
}

export async function upsertSiteSetting(key: string, value: string): Promise<SiteSetting | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .upsert({ key, value }, { onConflict: "key" })
    .select()
    .single();
  return data;
}

export async function getAllSiteSettings(): Promise<SiteSetting[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .order("key");
  return data ?? [];
}
