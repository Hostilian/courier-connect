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
  const { pathname, search } = request.nextUrl;

  // Handle root and ensure proper locale prefixing
  if (pathname === '/' || pathname === '') {
    return NextResponse.redirect(new URL(`/${defaultLocale}${search}`, request.url));
  }

  // Process request through internationalization middleware
  return intlMiddleware(request);

  // Allow API routes and Next.js internals to pass through
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.next();
  }

  // Handle all non-prefixed paths
  const hasLocalePrefix = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!hasLocalePrefix && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

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
