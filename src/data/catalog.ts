export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  category: "mates" | "bombillas" | "materos" | "termos" | "combos";
  subcategory?: "calabaza" | "algarrobo";
  description?: string;
  imageUrl?: string;
  galleryImages: string[];
  available: boolean;
  stock: number;
  price: number | null;
  show_price: boolean;
}

export interface CatalogSubcategory {
  key: string;
  name: string;
  slug: string;
  categoryId: string;
  imageUrl?: string;
  description?: string;
}

export const categories: CatalogCategory[] = [
  {
    id: "mates",
    name: "Mates",
    slug: "mates",
    description: "Mates de calabaza y algarrobo",
  },
  {
    id: "bombillas",
    name: "Bombillas",
    slug: "bombillas",
    description: "Bombillas de distintos materiales",
  },
  {
    id: "materos",
    name: "Materos",
    slug: "materos",
    description: "Materos para acompañar el mate",
  },
  {
    id: "termos",
    name: "Termos",
    slug: "termos",
    description: "Termos para mantener el agua caliente",
  },
  {
    id: "combos",
    name: "Combos",
    slug: "combos",
    description: "Combos completos para matear",
  },
];

export const subcategories: CatalogSubcategory[] = [
  {
    key: "calabaza",
    name: "Mates de calabaza",
    slug: "calabaza",
    categoryId: "mates",
    description: "Mates tradicionales de calabaza",
  },
  {
    key: "algarrobo",
    name: "Mates de algarrobo",
    slug: "algarrobo",
    categoryId: "mates",
    description: "Mates tallados en madera de algarrobo",
  },
];

export const products: CatalogProduct[] = [
  // Mates de calabaza
  { id: "mc1", name: "Mate Calabaza 01", slug: "mate-calabaza-01", category: "mates", subcategory: "calabaza", galleryImages: [], available: true, stock: 5, price: null, show_price: false },
  { id: "mc2", name: "Mate Calabaza 02", slug: "mate-calabaza-02", category: "mates", subcategory: "calabaza", galleryImages: [], available: true, stock: 3, price: null, show_price: false },
  { id: "mc3", name: "Mate Calabaza 03", slug: "mate-calabaza-03", category: "mates", subcategory: "calabaza", galleryImages: [], available: true, stock: 0, price: null, show_price: false },
  { id: "mc4", name: "Mate Calabaza 04", slug: "mate-calabaza-04", category: "mates", subcategory: "calabaza", galleryImages: [], available: false, stock: 0, price: null, show_price: false },
  // Mates de algarrobo
  { id: "ma1", name: "Mate Algarrobo 01", slug: "mate-algarrobo-01", category: "mates", subcategory: "algarrobo", galleryImages: [], available: true, stock: 2, price: null, show_price: false },
  { id: "ma2", name: "Mate Algarrobo 02", slug: "mate-algarrobo-02", category: "mates", subcategory: "algarrobo", galleryImages: [], available: true, stock: 4, price: null, show_price: false },
  { id: "ma3", name: "Mate Algarrobo 03", slug: "mate-algarrobo-03", category: "mates", subcategory: "algarrobo", galleryImages: [], available: true, stock: 1, price: null, show_price: false },
  { id: "ma4", name: "Mate Algarrobo 04", slug: "mate-algarrobo-04", category: "mates", subcategory: "algarrobo", galleryImages: [], available: true, stock: 0, price: null, show_price: false },
  // Bombillas
  { id: "b1", name: "Bombilla 01", slug: "bombilla-01", category: "bombillas", galleryImages: [], available: true, stock: 10, price: null, show_price: false },
  // Materos
  { id: "mt1", name: "Matero 01", slug: "matero-01", category: "materos", galleryImages: [], available: true, stock: 2, price: null, show_price: false },
  { id: "mt2", name: "Matero 02", slug: "matero-02", category: "materos", galleryImages: [], available: true, stock: 0, price: null, show_price: false },
  // Termos
  { id: "t1", name: "Termo 01", slug: "termo-01", category: "termos", galleryImages: [], available: true, stock: 5, price: null, show_price: false },
  // Combos
  { id: "c1", name: "Combo 01", slug: "combo-01", category: "combos", galleryImages: [], available: true, stock: 3, price: null, show_price: false },
  { id: "c2", name: "Combo 02", slug: "combo-02", category: "combos", galleryImages: [], available: true, stock: 2, price: null, show_price: false },
  { id: "c3", name: "Combo 03", slug: "combo-03", category: "combos", galleryImages: [], available: false, stock: 0, price: null, show_price: false },
  { id: "c4", name: "Combo 04", slug: "combo-04", category: "combos", galleryImages: [], available: true, stock: 1, price: null, show_price: false },
];

export function getSubcategoriesByCategory(categoryId: string): CatalogSubcategory[] {
  return subcategories.filter((s) => s.categoryId === categoryId);
}

export function getProductsByCategory(categoryId: string): CatalogProduct[] {
  return products.filter((p) => p.category === categoryId);
}

export function getProductsBySubcategory(categoryId: string, subcategoryKey: string): CatalogProduct[] {
  return products.filter((p) => p.category === categoryId && p.subcategory === subcategoryKey);
}

export function getCategory(slug: string): CatalogCategory | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getSubcategory(slug: string): CatalogSubcategory | undefined {
  return subcategories.find((s) => s.slug === slug);
}

export function getProductBySlug(slug: string): CatalogProduct | undefined {
  return products.find((p) => p.slug === slug);
}
