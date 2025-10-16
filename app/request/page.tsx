import { defaultLocale } from '@/i18n';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Request Delivery - Courier Connect',
  description: 'Request a same-day delivery with trusted local couriers. Fast, secure, and affordable.',
  robots: 'noindex, follow', // Redirect page, no need to index
};

/**
 * Non-localized request delivery route
 * Redirects to the localized version using the default locale
 */
export default function RequestPage() {
  // Redirect to localized request page
  redirect(`/${defaultLocale}/request`);
}