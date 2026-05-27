import { createClient } from "./supabase/server";
import type { Category, Subcategory } from "@/types/site";
import type { Product } from "@/types/product";
import {
  categories as fallbackCategories,
  subcategories as fallbackSubcategories,
  products as fallbackProducts,
  type CatalogCategory,
  type CatalogProduct,
  type CatalogSubcategory,
} from "@/data/catalog";

function mapDbCategoryToCatalog(dbCat: Category): CatalogCategory {
  return {
    id: dbCat.slug,
    name: dbCat.name,
    slug: dbCat.slug,
    description: dbCat.description ?? undefined,
    imageUrl: dbCat.image_url ?? undefined,
  };
}

function mapDbProductToCatalog(
  dbProd: Product,
  catSlug: string,
  subSlug?: string,
  gallery?: string[]
): CatalogProduct {
  return {
    id: dbProd.id,
    name: dbProd.name,
    slug: dbProd.slug,
    category: catSlug as CatalogProduct["category"],
    subcategory: subSlug as CatalogProduct["subcategory"],
    description: dbProd.description ?? undefined,
    imageUrl: dbProd.primary_image_url ?? undefined,
    primary_image_url: dbProd.primary_image_url ?? undefined,
    galleryImages: gallery?.filter((url) => url !== dbProd.primary_image_url) ?? [],
    available: dbProd.available,
    stock: dbProd.stock,
    price: dbProd.price,
    show_price: dbProd.show_price,
  };
}

export async function getCatalogCategories(): Promise<CatalogCategory[]> {
  const supabase = await createClient();
  const { data: dbCats } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("name");
  if (dbCats && dbCats.length > 0) {
    return dbCats.map(mapDbCategoryToCatalog);
  }
  return fallbackCategories;
}

export async function getCatalogCategory(slug: string): Promise<CatalogCategory | undefined> {
  const all = await getCatalogCategories();
  return all.find((c) => c.slug === slug);
}

export async function getCatalogSubcategories(categorySlug: string): Promise<CatalogSubcategory[]> {
  const supabase = await createClient();

  const { data: cat } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .eq("is_active", true)
    .single();

  if (!cat) {
    return fallbackSubcategories.filter((s) => s.categoryId === categorySlug);
  }

  const { data: dbSubs } = await supabase
    .from("subcategories")
    .select("*")
    .eq("category_id", cat.id)
    .eq("is_active", true)
    .order("name");

  if (dbSubs && dbSubs.length > 0) {
    return dbSubs.map((s: any) => ({
      key: s.slug,
      name: s.name,
      slug: s.slug,
      categoryId: categorySlug,
      imageUrl: s.image_url ?? undefined,
      description: s.description ?? undefined,
    }));
  }

  return fallbackSubcategories.filter((s) => s.categoryId === categorySlug);
}

async function getProductGallery(productId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("product_images")
    .select("image_url, is_primary")
    .eq("product_id", productId)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: true });
  if (data && data.length > 0) {
    return data.map((img) => img.image_url);
  }
  return [];
}

export async function getCatalogProductsByCategory(categorySlug: string): Promise<CatalogProduct[]> {
  const supabase = await createClient();

  const { data: cat } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .eq("is_active", true)
    .single();

  if (!cat) {
    return fallbackProducts.filter((p) => p.category === categorySlug);
  }

  const { data: dbProds } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", cat.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (dbProds && dbProds.length > 0) {
    const ids = dbProds.map((p) => p.id);
    const { data: allImages } = await supabase
      .from("product_images")
      .select("product_id, image_url, is_primary")
      .in("product_id", ids)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: true });

    const galleryMap = new Map<string, string[]>();
    if (allImages) {
      for (const img of allImages) {
        const list = galleryMap.get(img.product_id);
        if (list) {
          list.push(img.image_url);
        } else {
          galleryMap.set(img.product_id, [img.image_url]);
        }
      }
    }

    return dbProds.map((p) =>
      mapDbProductToCatalog(p as unknown as Product, categorySlug, undefined, galleryMap.get(p.id) ?? [])
    );
  }

  return fallbackProducts.filter((p) => p.category === categorySlug);
}

export async function getCatalogProductsBySubcategory(
  categorySlug: string,
  subcategorySlug: string
): Promise<CatalogProduct[]> {
  const supabase = await createClient();

  const { data: cat } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .eq("is_active", true)
    .single();

  if (!cat) {
    return [];
  }

  const { data: sub } = await supabase
    .from("subcategories")
    .select("id")
    .eq("category_id", cat.id)
    .eq("slug", subcategorySlug)
    .single();

  if (!sub) {
    return fallbackProducts.filter(
      (p) => p.category === categorySlug && p.subcategory === subcategorySlug
    );
  }

  const { data: dbProds } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", cat.id)
    .eq("subcategory_id", sub.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (dbProds && dbProds.length > 0) {
    const ids = dbProds.map((p) => p.id);
    const { data: allImages } = await supabase
      .from("product_images")
      .select("product_id, image_url, is_primary")
      .in("product_id", ids)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: true });

    const galleryMap = new Map<string, string[]>();
    if (allImages) {
      for (const img of allImages) {
        const list = galleryMap.get(img.product_id);
        if (list) {
          list.push(img.image_url);
        } else {
          galleryMap.set(img.product_id, [img.image_url]);
        }
      }
    }

    return dbProds.map((p) =>
      mapDbProductToCatalog(p as unknown as Product, categorySlug, subcategorySlug, galleryMap.get(p.id) ?? [])
    );
  }

  return fallbackProducts.filter(
    (p) => p.category === categorySlug && p.subcategory === subcategorySlug
  );
}

export async function getCatalogProductBySlug(slug: string): Promise<CatalogProduct | null> {
  const supabase = await createClient();
  const { data: dbProd } = await supabase
    .from("products")
    .select("*, categories!inner(slug)")
    .eq("slug", slug)
    .single();

  if (dbProd) {
    const gallery = await getProductGallery(dbProd.id);
    return mapDbProductToCatalog(
      dbProd as unknown as Product,
      (dbProd as any).categories?.slug ?? "mates",
      undefined,
      gallery
    );
  }

  const fallback = fallbackProducts.find((p) => p.slug === slug);
  return fallback ?? null;
}
