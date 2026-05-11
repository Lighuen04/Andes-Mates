export interface CatalogCategory {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  imageUrl?: string;
}

export interface CatalogProduct {
  id: string;
  nombre: string;
  slug: string;
  categoryId: string;
  subcategoria?: string;
  imageUrl?: string;
  disponible: boolean;
}

export const categories: CatalogCategory[] = [
  {
    id: "mates",
    nombre: "Mates",
    slug: "mates",
    descripcion: "Mates de calabaza y algarrobo",
  },
  {
    id: "bombillas",
    nombre: "Bombillas",
    slug: "bombillas",
    descripcion: "Bombillas de distintos materiales",
  },
  {
    id: "materos",
    nombre: "Materos",
    slug: "materos",
    descripcion: "Materos para acompañar el mate",
  },
  {
    id: "termos",
    nombre: "Termos",
    slug: "termos",
    descripcion: "Termos para mantener el agua caliente",
  },
  {
    id: "combos",
    nombre: "Combos",
    slug: "combos",
    descripcion: "Combos completos para matear",
  },
];

export const products: CatalogProduct[] = [
  // Mates
  { id: "m1", nombre: "Mate Calabaza 01", slug: "mate-calabaza-01", categoryId: "mates", subcategoria: "calabaza", disponible: true },
  { id: "m2", nombre: "Mate Calabaza 02", slug: "mate-calabaza-02", categoryId: "mates", subcategoria: "calabaza", disponible: true },
  { id: "m3", nombre: "Mate Calabaza 03", slug: "mate-calabaza-03", categoryId: "mates", subcategoria: "calabaza", disponible: true },
  { id: "m4", nombre: "Mate Calabaza 04", slug: "mate-calabaza-04", categoryId: "mates", subcategoria: "calabaza", disponible: false },
  { id: "m5", nombre: "Mate Algarrobo 01", slug: "mate-algarrobo-01", categoryId: "mates", subcategoria: "algarrobo", disponible: true },
  { id: "m6", nombre: "Mate Algarrobo 02", slug: "mate-algarrobo-02", categoryId: "mates", subcategoria: "algarrobo", disponible: true },
  { id: "m7", nombre: "Mate Algarrobo 03", slug: "mate-algarrobo-03", categoryId: "mates", subcategoria: "algarrobo", disponible: true },
  { id: "m8", nombre: "Mate Algarrobo 04", slug: "mate-algarrobo-04", categoryId: "mates", subcategoria: "algarrobo", disponible: true },
  // Bombillas
  { id: "b1", nombre: "Bombilla 01", slug: "bombilla-01", categoryId: "bombillas", disponible: true },
  // Materos
  { id: "ma1", nombre: "Matero 01", slug: "matero-01", categoryId: "materos", disponible: true },
  { id: "ma2", nombre: "Matero 02", slug: "matero-02", categoryId: "materos", disponible: true },
  // Termos
  { id: "t1", nombre: "Termo 01", slug: "termo-01", categoryId: "termos", disponible: true },
  // Combos
  { id: "c1", nombre: "Combo 01", slug: "combo-01", categoryId: "combos", disponible: true },
  { id: "c2", nombre: "Combo 02", slug: "combo-02", categoryId: "combos", disponible: true },
  { id: "c3", nombre: "Combo 03", slug: "combo-03", categoryId: "combos", disponible: false },
  { id: "c4", nombre: "Combo 04", slug: "combo-04", categoryId: "combos", disponible: true },
];

export function getProductsByCategory(categoryId: string): CatalogProduct[] {
  return products.filter((p) => p.categoryId === categoryId);
}

export function getProductsBySubcategory(
  categoryId: string,
  subcategoria: string
): CatalogProduct[] {
  return products.filter(
    (p) => p.categoryId === categoryId && p.subcategoria === subcategoria
  );
}

export function getCategory(slug: string): CatalogCategory | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProductBySlug(slug: string): CatalogProduct | undefined {
  return products.find((p) => p.slug === slug);
}

export function subcategoriasPorCategoria(
  categoryId: string
): { key: string; label: string }[] {
  const mapa: Record<string, { key: string; label: string }[]> = {
    mates: [
      { key: "calabaza", label: "Calabaza" },
      { key: "algarrobo", label: "Algarrobo" },
    ],
  };
  return mapa[categoryId] ?? [];
}
