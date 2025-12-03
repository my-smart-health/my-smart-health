import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  const protectedPrefixes = ['/dashboard', '/api/auth/register', '/register'];

  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  if (!isProtected) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If no token, redirect to login (not timeout page)
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Only check inactivity if we have a valid token
  // Check cookie first (set by SessionChecker on activity)
  const lastActivityCookie = req.cookies.get('lastActivity')?.value;
  let isInactive = false;

  if (lastActivityCookie) {
    const ts = parseInt(lastActivityCookie, 10);
    if (!Number.isNaN(ts)) {
      const INACTIVITY_MS = 10 * 60 * 1000; // 10 minutes
      const elapsed = Date.now() - ts;
      isInactive = elapsed > INACTIVITY_MS;
    }
  } else if ((token as any).lastActivity) {
    const ts = parseInt(String((token as any).lastActivity), 10);
    if (!Number.isNaN(ts)) {
      const INACTIVITY_MS = 10 * 60 * 1000;
      const elapsed = Date.now() - ts;
      isInactive = elapsed > INACTIVITY_MS;
    }
  }

  if (isInactive) {
    const redirectUrl = new URL('/?timeout=1', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/register', '/api/auth/register'],
};
