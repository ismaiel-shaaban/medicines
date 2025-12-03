import { NextResponse } from 'next/server';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const pathnameHasLocale = pathname.startsWith('/en') || pathname.startsWith('/ar');

  if (!pathnameHasLocale) {
    const locale = 'en';
    // Redirect to login page by default
    return NextResponse.redirect(
      new URL(`/${locale}/login`, request.url)
    );
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

