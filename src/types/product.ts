export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  price: number | null;
  show_price: boolean;
  stock: number;
  available: boolean;
  primary_image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ProductFormData = Omit<
  Product,
  "id" | "slug" | "created_at" | "updated_at"
> & {
  slug?: string;
};
