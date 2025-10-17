import { defaultLocale } from '@/i18n';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Forgot Password - Courier Connect',
  description: 'Reset your courier account password to regain access.',
  robots: 'noindex, follow', // Redirect page, no need to index
};

/**
 * Non-localized forgot password route
 * Redirects to the localized version using the default locale
 */
export default function ForgotPasswordPage() {
  // Redirect to localized forgot password page
  redirect(`/${defaultLocale}/courier/forgot-password`);
}
