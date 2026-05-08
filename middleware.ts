import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/admin/login') return NextResponse.next()

  const token  = request.cookies.get('admin_token')?.value
  const secret = process.env.ADMIN_TOKEN_SECRET ?? 'studio-gd-admin-2025'

  if (token !== secret) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: '/admin/:path*' }
