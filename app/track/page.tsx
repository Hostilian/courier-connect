import { defaultLocale } from '@/i18n';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Track Delivery - Courier Connect',
  description: 'Track your delivery in real-time with live updates and courier location.',
  robots: 'noindex, follow', // Redirect page, no need to index
};

/**
 * Non-localized track delivery route
 * Redirects to the localized version using the default locale
 */
export default function TrackPage() {
  // Redirect to localized track page
  redirect(`/${defaultLocale}/track`);
}