import { languages } from '@/lib/languages';
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Supported locales - all languages from our comprehensive list
export const locales = languages.map((l) => l.code) as readonly string[];
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = 'en';

// Locale labels and flags - dynamically generated from languages
export const localeLabels: Record<string, { name: string; flag: string; nativeName: string }> =
  Object.fromEntries(
    languages.map((l) => [l.code, { name: l.name, flag: l.flag, nativeName: l.nativeName }])
  );

// Deep merge two translation objects, filling missing keys from base with override precedence
function deepMerge<T extends Record<string, any>>(base: T, override: Partial<T>): T {
  const result: Record<string, any> = { ...base };
  for (const [key, value] of Object.entries(override || {})) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      typeof result[key] === 'object' &&
      result[key] !== null &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(result[key], value as Record<string, any>);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  // Always load English as the base/fallback
  const en = (await import('./messages/en.json')).default as Record<string, any>;

  try {
    if (locale === 'en') {
      return { locale, messages: en };
    }
    // Merge locale messages over English to ensure complete coverage
    const localeMessages = (await import(`./messages/${locale}.json`)).default as Record<string, any>;
    const messages = deepMerge(en, localeMessages);
    return { locale, messages };
  } catch (error) {
    // If translation file doesn't exist or fails to load, fall back to English
    return { locale, messages: en };
  }
});
