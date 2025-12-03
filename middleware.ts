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
  const lastActivityCookie = req.cookies.get('lastActivity')?.value;
  let isInactive = false;
  if (lastActivityCookie) {
    const ts = parseInt(lastActivityCookie, 10);
    if (!Number.isNaN(ts)) {
      const INACTIVITY_MS = 10 * 60 * 1000; // 10 minutes
      isInactive = Date.now() - ts > INACTIVITY_MS;
    }
  }

  if (!token || isInactive) {
    const redirectUrl = new URL('/?timeout=1', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/register', '/api/auth/register'],
};
