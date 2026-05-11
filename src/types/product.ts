export interface Product {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  categoria: string;
  category_id: string | null;
  subcategory_id: string | null;
  precio: number | null;
  mostrar_precio: boolean;
  disponible: boolean;
  destacado: boolean;
  imagen_url: string | null;
  stock: number;
  created_at: string;
  updated_at: string;
}

export type ProductFormData = Omit<
  Product,
  "id" | "slug" | "created_at" | "updated_at"
> & {
  slug?: string;
};
