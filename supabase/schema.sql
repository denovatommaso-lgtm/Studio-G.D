-- ─────────────────────────────────────────────────────────────
-- Studio G.D. — Supabase Schema
-- Run this in your Supabase project → SQL Editor
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

-- Anyone can INSERT (public form submissions)
CREATE POLICY "public_insert" ON orders
  FOR INSERT WITH CHECK (true);

-- Only authenticated users (Mariana & Lor) can read and update
CREATE POLICY "auth_select" ON orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "auth_update" ON orders
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Index for faster queries by status and date
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
