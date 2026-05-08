import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/** Decode a JWT payload without verifying signature (Edge-runtime safe). */
function parseJwt(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/admin/login') return NextResponse.next()

  const token   = request.cookies.get('admin_token')?.value
  if (!token) return NextResponse.redirect(new URL('/admin/login', request.url))

  const payload = parseJwt(token)
  const now     = Math.floor(Date.now() / 1000)

  if (!payload || typeof payload.exp !== 'number' || payload.exp < now) {
    const res = NextResponse.redirect(new URL('/admin/login', request.url))
    res.cookies.delete('admin_token')
    return res
  }

  return NextResponse.next()
}

export const config = { matcher: '/admin/:path*' }
