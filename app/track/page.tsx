import { defaultLocale } from '@/i18n';
import { redirect } from 'next/navigation';

export default function TrackPage() {
  redirect(`/${defaultLocale}/track`);
}