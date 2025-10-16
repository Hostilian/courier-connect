import { defaultLocale } from '@/i18n';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Reset Password - Courier Connect',
  description: 'Create a new password for your courier account.',
  robots: 'noindex, follow', // Redirect page, no need to index
};

/**
 * Non-localized reset password route
 * Redirects to the localized version using the default locale
 */
export default function ResetPasswordPage() {
  // Redirect to localized reset password page
  redirect(`/${defaultLocale}/courier/reset-password`);
}
