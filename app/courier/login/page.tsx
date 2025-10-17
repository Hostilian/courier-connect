import { defaultLocale } from '@/i18n';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Courier Login - Courier Connect',
  description: 'Log in to your courier account to manage deliveries and track earnings.',
  robots: 'noindex, follow', // Redirect page, no need to index
};

/**
 * Non-localized courier login route
 * Redirects to the localized version using the default locale
 */
export default function CourierLoginPage() {
  // Redirect to localized courier login page
  redirect(`/${defaultLocale}/courier/login`);
}