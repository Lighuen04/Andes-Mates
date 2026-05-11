export type Categoria = "calabaza" | "madera" | "ceramica" | "kit" | "accesorio";

export interface Product {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  categoria: Categoria;
  precio: number | null;
  mostrar_precio: boolean;
  disponible: boolean;
  destacado: boolean;
  imagen_url: string | null;
  created_at: string;
  updated_at: string;
}

export type ProductFormData = Omit<
  Product,
  "id" | "slug" | "created_at" | "updated_at"
> & {
  slug?: string;
};

export const CATEGORIAS: { value: Categoria; label: string }[] = [
  { value: "calabaza", label: "Calabaza" },
  { value: "madera", label: "Madera" },
  { value: "ceramica", label: "Cerámica" },
  { value: "kit", label: "Kits" },
  { value: "accesorio", label: "Accesorios" },
];
