'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales, localeLabels, type Locale } from '@/i18n';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function LanguageSelector() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    if (!pathname) return;
    
    // Remove current locale from pathname
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, '');
    
    // Navigate to new locale
    router.push(`/${newLocale}${pathnameWithoutLocale}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Current Language Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all min-w-[44px] min-h-[44px] border border-gray-200"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="text-2xl" role="img" aria-label={localeLabels[locale].name}>
          {localeLabels[locale].flag}
        </span>
        <span className="hidden sm:inline font-medium text-gray-700">
          {localeLabels[locale].nativeName}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${
                locale === loc ? 'bg-yellow-50 hover:bg-yellow-100' : ''
              }`}
              aria-label={`Switch to ${localeLabels[loc].name}`}
            >
              <span className="text-2xl" role="img" aria-label={localeLabels[loc].name}>
                {localeLabels[loc].flag}
              </span>
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">
                  {localeLabels[loc].nativeName}
                </span>
                <span className="text-sm text-gray-500">
                  {localeLabels[loc].name}
                </span>
              </div>
              {locale === loc && (
                <span className="ml-auto text-yellow-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
