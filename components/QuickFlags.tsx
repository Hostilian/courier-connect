'use client';

import { locales, localeLabels, type Locale } from '@/i18n';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

// Show a compact set of prominent flags first, then a collapsible full list.
const featured: Locale[] = ['cs', 'en', 'tr', 'uk', 'vi'];

export default function QuickFlags() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function go(loc: Locale) {
    if (!pathname) return;
    const pathWithout = pathname.startsWith(`/${locale}`)
      ? pathname.slice(locale.length + 1) || ''
      : pathname;
    router.push(`/${loc}${pathWithout ? `/${pathWithout}` : ''}`);
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {featured.map((loc) => (
        <button
          key={loc}
          onClick={() => go(loc)}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm shadow-sm hover:shadow transition-all ${
            loc === locale ? 'bg-yellow-50 border-yellow-300' : 'bg-white border-gray-200'
          }`}
          aria-label={`Switch to ${localeLabels[loc].name}`}
        >
          <span className="text-xl" role="img" aria-label={localeLabels[loc].name}>
            {localeLabels[loc].flag}
          </span>
          <span className="hidden sm:inline font-medium">{localeLabels[loc].nativeName}</span>
        </button>
      ))}
    </div>
  );
}
