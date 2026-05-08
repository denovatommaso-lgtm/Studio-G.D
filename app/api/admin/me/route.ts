import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value

  if (!token) return NextResponse.json({ email: null }, { status: 401 })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return NextResponse.json({ email: null }, { status: 503 })

  const supabase = createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data } = await supabase.auth.getUser()
  return NextResponse.json({ email: data.user?.email ?? null })
}
