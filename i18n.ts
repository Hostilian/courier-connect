import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { languages, getLanguageByCode } from '@/lib/languages';

// Supported locales - all languages from our comprehensive list
export const locales = languages.map(l => l.code) as readonly string[];
export type Locale = typeof locales[number];

// Default locale
export const defaultLocale: Locale = 'en';

// Locale labels and flags - dynamically generated from languages
export const localeLabels: Record<string, { name: string; flag: string; nativeName: string }> = 
  Object.fromEntries(
    languages.map(l => [l.code, { name: l.name, flag: l.flag, nativeName: l.nativeName }])
  );

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  try {
    return {
      locale,
      messages: (await import(`./messages/${locale}.json`)).default,
    };
  } catch (error) {
    // If translation file doesn't exist, fall back to English
    return {
      locale,
      messages: (await import(`./messages/en.json`)).default,
    };
  }
});
