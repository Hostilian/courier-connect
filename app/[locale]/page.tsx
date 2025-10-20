
import { locales } from '@/i18n';
import HomePage from '@/components/HomePage';

// Ensure static generation for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function Page() {
  return <HomePage />;
}
