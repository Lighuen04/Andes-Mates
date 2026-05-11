import { createClient } from "./supabase/server";
import type { Category, Subcategory, ProductImage } from "@/types/site";
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

function mapDbSubcategoryToCatalog(dbSub: Subcategory, catSlug: string): CatalogSubcategory {
  return {
    key: dbSub.slug,
    name: dbSub.name,
    slug: dbSub.slug,
    categoryId: catSlug,
    imageUrl: dbSub.image_url ?? undefined,
    description: dbSub.description ?? undefined,
  };
}

function mapDbProductToCatalog(dbProd: Product, catSlug: string, subSlug?: string): CatalogProduct {
  return {
    id: dbProd.id,
    name: dbProd.nombre,
    slug: dbProd.slug,
    category: catSlug as CatalogProduct["category"],
    subcategory: subSlug as CatalogProduct["subcategory"],
    description: dbProd.descripcion || undefined,
    imageUrl: dbProd.imagen_url ?? undefined,
    galleryImages: [],
    available: dbProd.disponible,
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
  const cat = await getCatalogCategory(categorySlug);
  if (!cat) return [];
  const catId = cat.id;

  const { data: dbSubs } = await supabase
    .from("subcategories")
    .select("*, categories!inner(slug)")
    .eq("category_id", catId)
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
  const cat = await getCatalogCategory(categorySlug);
  if (!cat) return [];
  const catId = cat.id;

  const { data: dbProds } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", catId)
    .eq("disponible", true)
    .order("created_at", { ascending: false });

  if (dbProds && dbProds.length > 0) {
    const results: CatalogProduct[] = [];
    for (const p of dbProds) {
      const gallery = await getProductGallery(p.id);
      results.push({
        id: p.id,
        name: p.nombre,
        slug: p.slug,
        category: categorySlug as CatalogProduct["category"],
        description: p.descripcion || undefined,
        imageUrl: gallery[0] ?? p.imagen_url ?? undefined,
        galleryImages: gallery,
        available: p.disponible,
      });
    }
    return results;
  }

  return fallbackProducts.filter((p) => p.category === categorySlug);
}

export async function getCatalogProductsBySubcategory(
  categorySlug: string,
  subcategorySlug: string
): Promise<CatalogProduct[]> {
  const supabase = await createClient();
  const cat = await getCatalogCategory(categorySlug);
  if (!cat) return [];

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
    .eq("subcategory_id", sub.id)
    .eq("disponible", true)
    .order("created_at", { ascending: false });

  if (dbProds && dbProds.length > 0) {
    const results: CatalogProduct[] = [];
    for (const p of dbProds) {
      const gallery = await getProductGallery(p.id);
      results.push({
        id: p.id,
        name: p.nombre,
        slug: p.slug,
        category: categorySlug as CatalogProduct["category"],
        subcategory: subcategorySlug as CatalogProduct["subcategory"],
        description: p.descripcion || undefined,
        imageUrl: gallery[0] ?? p.imagen_url ?? undefined,
        galleryImages: gallery,
        available: p.disponible,
      });
    }
    return results;
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
    return {
      id: dbProd.id,
      name: dbProd.nombre,
      slug: dbProd.slug,
      category: (dbProd.categories?.slug ?? "mates") as CatalogProduct["category"],
      description: dbProd.descripcion || undefined,
      imageUrl: gallery[0] ?? dbProd.imagen_url ?? undefined,
      galleryImages: gallery,
      available: dbProd.disponible,
    };
  }

  const fallback = fallbackProducts.find((p) => p.slug === slug);
  return fallback ?? null;
}
