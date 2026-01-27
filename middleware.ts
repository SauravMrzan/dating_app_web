import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token');
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard') && !authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Prevent access to login/signup if already logged in
  if ((pathname === '/login' || pathname === '/signup') && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Run middleware only on these routes
export const config = {
  matcher: ['/home/:path*', '/login', '/signup'],
};
