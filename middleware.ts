import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, locales } from './i18n';

// Create the internationalization middleware
const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Always use locale prefix
  localePrefix: 'always',
});

// Wrap the middleware to handle custom redirects and 404s
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API routes and Next.js internals to pass straight through
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.next();
  }

  // Redirect bare root requests to the default locale homepage
  if (pathname === '/' || pathname === '') {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}`;
    return NextResponse.redirect(url);
  }

  // Ensure that any non-prefixed path gets the default locale prefix
  const hasLocalePrefix = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!hasLocalePrefix) {
    const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${normalizedPathname}`;
    return NextResponse.redirect(url);
  }

  // Delegate to next-intl's middleware for locale handling
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
