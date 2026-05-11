-- Andes Mates - Database Schema
-- Run this SQL in your Supabase SQL Editor

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  descripcion TEXT NOT NULL DEFAULT '',
  categoria TEXT NOT NULL DEFAULT '',
  precio DECIMAL(10, 2),
  mostrar_precio BOOLEAN NOT NULL DEFAULT true,
  disponible BOOLEAN NOT NULL DEFAULT true,
  destacado BOOLEAN NOT NULL DEFAULT false,
  imagen_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  category_id UUID,
  subcategory_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
CREATE INDEX IF NOT EXISTS idx_products_categoria ON products (categoria);
CREATE INDEX IF NOT EXISTS idx_products_destacado ON products (destacado) WHERE destacado = true;
CREATE INDEX IF NOT EXISTS idx_products_disponible ON products (disponible) WHERE disponible = true;
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category_id);

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SUBCATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS subcategories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

-- ============================================================
-- PRODUCT IMAGES (gallery)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images (product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_primary ON product_images (product_id, is_primary) WHERE is_primary = true;

-- ============================================================
-- SITE SETTINGS (key-value store for hero image, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ADMIN PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- FOREIGN KEYS (after tables exist)
-- ============================================================
-- Only add FK constraints if columns exist (for re-runs)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'category_id') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_products_category') THEN
      ALTER TABLE products ADD CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
    END IF;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'subcategory_id') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_products_subcategory') THEN
      ALTER TABLE products ADD CONSTRAINT fk_products_subcategory FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- ============================================================
-- AUTO-UPDATE updated_at FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS set_products_updated_at ON products;
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_categories_updated_at ON categories;
CREATE TRIGGER set_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_subcategories_updated_at ON subcategories;
CREATE TRIGGER set_subcategories_updated_at
  BEFORE UPDATE ON subcategories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin insert products" ON products;
CREATE POLICY "Admin insert products" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin update products" ON products;
CREATE POLICY "Admin update products" ON products FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin delete products" ON products;
CREATE POLICY "Admin delete products" ON products FOR DELETE USING (auth.role() = 'authenticated');

-- Categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read categories" ON categories;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin insert categories" ON categories;
CREATE POLICY "Admin insert categories" ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin update categories" ON categories;
CREATE POLICY "Admin update categories" ON categories FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin delete categories" ON categories;
CREATE POLICY "Admin delete categories" ON categories FOR DELETE USING (auth.role() = 'authenticated');

-- Subcategories
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read subcategories" ON subcategories;
CREATE POLICY "Public read subcategories" ON subcategories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin insert subcategories" ON subcategories;
CREATE POLICY "Admin insert subcategories" ON subcategories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin update subcategories" ON subcategories;
CREATE POLICY "Admin update subcategories" ON subcategories FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin delete subcategories" ON subcategories;
CREATE POLICY "Admin delete subcategories" ON subcategories FOR DELETE USING (auth.role() = 'authenticated');

-- Product images
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read product_images" ON product_images;
CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin insert product_images" ON product_images;
CREATE POLICY "Admin insert product_images" ON product_images FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin update product_images" ON product_images;
CREATE POLICY "Admin update product_images" ON product_images FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin delete product_images" ON product_images;
CREATE POLICY "Admin delete product_images" ON product_images FOR DELETE USING (auth.role() = 'authenticated');

-- Site settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read site_settings" ON site_settings;
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin insert site_settings" ON site_settings;
CREATE POLICY "Admin insert site_settings" ON site_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin update site_settings" ON site_settings;
CREATE POLICY "Admin update site_settings" ON site_settings FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admin delete site_settings" ON site_settings;
CREATE POLICY "Admin delete site_settings" ON site_settings FOR DELETE USING (auth.role() = 'authenticated');

-- Admin profiles
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own admin profile" ON public.admin_profiles;
CREATE POLICY "Users can read own admin profile"
  ON public.admin_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- ============================================================
-- STORAGE BUCKETS (run in Supabase Dashboard > Storage)
-- ============================================================
-- Create buckets:
--   "product-images"  -> public bucket for product photos
--   "category-images" -> public bucket for category images
--   "site-images"     -> public bucket for site images (hero, etc.)
--
-- For each bucket, add:
--
-- Public read:
--   CREATE POLICY "Public read BUCKET_NAME"
--     ON storage.objects
--     FOR SELECT
--     USING (bucket_id = 'BUCKET_NAME');
--
-- Authenticated upload:
--   CREATE POLICY "Admin upload BUCKET_NAME"
--     ON storage.objects
--     FOR INSERT
--     WITH CHECK (
--       bucket_id = 'BUCKET_NAME'
--       AND auth.role() = 'authenticated'
--     );
--
-- Authenticated delete:
--   CREATE POLICY "Admin delete BUCKET_NAME"
--     ON storage.objects
--     FOR DELETE
--     USING (
--       bucket_id = 'BUCKET_NAME'
--       AND auth.role() = 'authenticated'
--     );
