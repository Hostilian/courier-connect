import { defaultLocale } from '@/i18n';
import { redirect } from 'next/navigation';

export default function ResetPasswordPage() {
  redirect(`/${defaultLocale}/courier/reset-password`);
}
