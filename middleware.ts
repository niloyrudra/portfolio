import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const COOKIE_NAME = 'auth_token'

function getSecret(): Uint8Array {
  const s = process.env.JWT_SECRET ?? ''
  return new TextEncoder().encode(s.padEnd(32, '_portfolio_secret_pad_'))
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Always allow: login page, setup page, public API routes
  if (
    pathname === '/admin/login' ||
    pathname === '/admin/setup' ||
    pathname === '/api/auth/setup'
  ) {
    return NextResponse.next()
  }

  // Protect all other /admin routes
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get(COOKIE_NAME)?.value
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    try {
      await jwtVerify(token, getSecret())
      return NextResponse.next()
    } catch {
      const res = NextResponse.redirect(new URL('/admin/login', req.url))
      res.cookies.set(COOKIE_NAME, '', { maxAge: 0 })
      return res
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
