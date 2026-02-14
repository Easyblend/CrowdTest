import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export default async function proxy(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const isAuthPage = req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup';

  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  // If visiting login/signup AND already logged in → redirect to dashboard
  if (token && isAuthPage) {
    try {
     const { payload } = await jwtVerify(token, secret);

      if(payload.role =='ADMIN'){
        return NextResponse.redirect(new URL('/admin', req.url));
      }else{
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    } catch (_) {
      // token invalid → allow login/signup
    }
  }

  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (_) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (req.nextUrl.pathname.startsWith('/admin')) {
  if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      if (payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.next();
    } catch (_) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/dashboard', '/login', '/signup', '/admin/:path*', '/admin'],
};
