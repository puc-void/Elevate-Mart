import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'e-commerce-bangla-super-secret-key-2026-production-ready'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('session_token')?.value;

  let session: { role?: string; id?: string } | null = null;

  if (token) {
    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      session = verified.payload as { role?: string; id?: string };
    } catch {
      session = null;
    }
  }

  // Protect Admin Routes (Requires role === 'admin')
  if (pathname.startsWith('/admin')) {
    if (!session || session.role !== 'admin') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'অ্যাডমিন প্যানেলে প্রবেশের অনুমতি নেই। অনুগ্রহ করে অ্যাডমিন অ্যাকাউন্টে লগইন করুন।');
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect User Customer Actions (Cart, Checkout, Orders, Profile) - Requires Authenticated Session
  if (
    pathname.startsWith('/cart') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/orders') ||
    pathname.startsWith('/profile')
  ) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'এই পেজটিতে প্রবেশ করতে প্রথমে লগইন করুন।');
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/orders/:path*', '/checkout/:path*', '/profile/:path*', '/cart/:path*']
};
