import { defaultLocale } from '@/i18n';
import { redirect } from 'next/navigation';

export default function CourierDashboard() {
  redirect(`/${defaultLocale}/courier/dashboard`);
}