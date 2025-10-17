import { defaultLocale } from '@/i18n';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Courier Register - Courier Connect',
  description: 'Register as a courier and start earning with flexible delivery opportunities.',
  robots: 'noindex, follow', // Redirect page, no need to index
};

/**
 * Non-localized courier register route
 * Redirects to the localized version using the default locale
 */
export default function CourierRegisterPage() {
  // Redirect to localized courier register page
  redirect(`/${defaultLocale}/courier/register`);
}
