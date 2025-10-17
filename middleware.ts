import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
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
  // Handle internationalization first
  const response = intlMiddleware(request);
  
  // Additional custom logic if needed
  // For example, you can handle custom redirects here
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
