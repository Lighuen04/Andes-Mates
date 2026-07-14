-- Pedidos table for admin order management
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  producto TEXT NOT NULL,
  costo DECIMAL(10, 2) NOT NULL DEFAULT 0,
  precio_venta DECIMAL(10, 2) NOT NULL DEFAULT 0,
  cantidad INTEGER NOT NULL DEFAULT 1,
  tipo TEXT NOT NULL CHECK (tipo IN ('encargo', 'stock')),
  notas TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_pedidos_tipo ON pedidos (tipo);
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON pedidos (created_at DESC);

-- Auto-update updated_at
CREATE TRIGGER set_pedidos_updated_at
  BEFORE UPDATE ON pedidos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Enable RLS
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Authenticated users (admins) can read
CREATE POLICY "Admin read pedidos"
  ON pedidos
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Authenticated users (admins) can insert
CREATE POLICY "Admin insert pedidos"
  ON pedidos
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users (admins) can update
CREATE POLICY "Admin update pedidos"
  ON pedidos
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users (admins) can delete
CREATE POLICY "Admin delete pedidos"
  ON pedidos
  FOR DELETE
  USING (auth.role() = 'authenticated');
