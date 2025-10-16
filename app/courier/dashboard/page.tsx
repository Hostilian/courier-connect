import { defaultLocale } from '@/i18n';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Courier Dashboard - Courier Connect',
  description: 'Access your courier dashboard to view available deliveries and manage your account.',
  robots: 'noindex, follow', // Redirect page, no need to index
};

/**
 * Non-localized courier dashboard route
 * Redirects to the localized version using the default locale
 */
export default function CourierDashboard() {
  // Redirect to localized courier dashboard page
  redirect(`/${defaultLocale}/courier/dashboard`);
}