-- Andes Mates - Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  descripcion TEXT NOT NULL DEFAULT '',
  categoria TEXT NOT NULL CHECK (categoria IN ('calabaza', 'algarrobo', 'bombilla', 'bombillón', 'combo', 'termo', 'accesorio')),
  precio DECIMAL(10, 2),
  mostrar_precio BOOLEAN NOT NULL DEFAULT true,
  disponible BOOLEAN NOT NULL DEFAULT true,
  destacado BOOLEAN NOT NULL DEFAULT false,
  imagen_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
CREATE INDEX IF NOT EXISTS idx_products_categoria ON products (categoria);
CREATE INDEX IF NOT EXISTS idx_products_destacado ON products (destacado) WHERE destacado = true;
CREATE INDEX IF NOT EXISTS idx_products_disponible ON products (disponible) WHERE disponible = true;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can read products)
CREATE POLICY "Public read products"
  ON products
  FOR SELECT
  USING (true);

-- Authenticated users (admins) can insert
CREATE POLICY "Admin insert products"
  ON products
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users (admins) can update
CREATE POLICY "Admin update products"
  ON products
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users (admins) can delete
CREATE POLICY "Admin delete products"
  ON products
  FOR DELETE
  USING (auth.role() = 'authenticated');

------------------------------------------------------------
-- Storage bucket setup (run in Supabase Dashboard > Storage)
-- 1. Create a bucket named "product-images"
-- 2. Set it to public
-- 3. Add this policy for public read:
--
-- CREATE POLICY "Public read product-images"
--   ON storage.objects
--   FOR SELECT
--   USING (bucket_id = 'product-images');
--
-- 4. Add this policy for authenticated upload:
--
-- CREATE POLICY "Admin upload product-images"
--   ON storage.objects
--   FOR INSERT
--   WITH CHECK (
--     bucket_id = 'product-images'
--     AND auth.role() = 'authenticated'
--   );
