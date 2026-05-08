-- ─────────────────────────────────────────────────────────────
-- Studio G.D. — Supabase Schema
-- Run this once in: Supabase Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS orders (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name text        NOT NULL,
  form_data    jsonb       NOT NULL DEFAULT '{}',
  lang         text        NOT NULL DEFAULT 'es' CHECK (lang IN ('es', 'en')),
  status       text        NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Public can INSERT (form submissions from the website)
CREATE POLICY "public_insert" ON orders
  FOR INSERT WITH CHECK (true);

-- Anon key can SELECT, UPDATE, DELETE
-- (The admin panel has its own password-based auth layer via middleware)
CREATE POLICY "anon_select" ON orders
  FOR SELECT USING (true);

CREATE POLICY "anon_update" ON orders
  FOR UPDATE USING (true);

CREATE POLICY "anon_delete" ON orders
  FOR DELETE USING (true);

-- Indexes for faster admin queries
CREATE INDEX IF NOT EXISTS idx_orders_status     ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
