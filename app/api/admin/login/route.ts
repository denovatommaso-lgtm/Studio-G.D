import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { password } = await req.json()
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'studiogd2025'
  const tokenSecret   = process.env.ADMIN_TOKEN_SECRET ?? 'studio-gd-admin-2025'

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set('admin_token', tokenSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return response
}
