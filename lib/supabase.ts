import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create the client if both env vars are present
let supabase: SupabaseClient | null = null
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
}

export { supabase }

// ── Types ────────────────────────────────────────────────────
export interface Order {
  id?: string
  product_name: string
  form_data: Record<string, string>
  lang: 'es' | 'en'
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  created_at?: string
}

export async function insertOrder(order: Omit<Order, 'id' | 'status' | 'created_at'>) {
  if (!supabase) {
    // Supabase not configured yet — skip silently
    console.warn('Supabase not configured. Order not saved to database.')
    return null
  }

  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single()

  if (error) throw error
  return data as Order
}
