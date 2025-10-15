import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Supported locales
export const locales = ['en', 'cs', 'uk', 'vi', 'tr'] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = 'en';

// Locale labels and flags
export const localeLabels: Record<Locale, { name: string; flag: string; nativeName: string }> = {
  en: { name: 'English', flag: '🇬🇧', nativeName: 'English' },
  cs: { name: 'Czech', flag: '🇨🇿', nativeName: 'Čeština' },
  uk: { name: 'Ukrainian', flag: '🇺🇦', nativeName: 'Українська' },
  vi: { name: 'Vietnamese', flag: '🇻🇳', nativeName: 'Tiếng Việt' },
  tr: { name: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe' },
};

export default getRequestConfig(async ({ locale }: { locale: string }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
