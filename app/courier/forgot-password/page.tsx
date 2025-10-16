import { defaultLocale } from '@/i18n';
import { redirect } from 'next/navigation';

export default function ForgotPasswordPage() {
  redirect(`/${defaultLocale}/courier/forgot-password`);
}
