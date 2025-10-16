import { defaultLocale } from '@/i18n';
import { redirect } from 'next/navigation';

export default function CourierLoginPage() {
  redirect(`/${defaultLocale}/courier/login`);
}