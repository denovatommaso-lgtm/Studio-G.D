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

// ── Admin queries ────────────────────────────────────────────
export async function getOrders(status?: Order['status']): Promise<Order[]> {
  if (!supabase) return []
  let q = supabase.from('orders').select('*').order('created_at', { ascending: false })
  if (status) q = q.eq('status', status)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as Order[]
}

export async function updateOrderStatus(id: string, status: Order['status']) {
  if (!supabase) return
  const { error } = await supabase.from('orders').update({ status }).eq('id', id)
  if (error) throw error
}

export async function deleteOrder(id: string) {
  if (!supabase) return
  const { error } = await supabase.from('orders').delete().eq('id', id)
  if (error) throw error
}

// ── Public insert ────────────────────────────────────────────
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
