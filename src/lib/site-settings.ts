import { createClient } from "./supabase/server";
import type { SiteSetting } from "@/types/site";

export async function getHeroBackground(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("hero_background_url")
    .eq("id", "main")
    .single();
  return data?.hero_background_url || null;
}

export async function getAllSiteSettings(): Promise<SiteSetting[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .order("id");
  return data ?? [];
}
