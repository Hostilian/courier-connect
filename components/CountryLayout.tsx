import { getLocaleTheme } from '@/lib/languages';

interface CountryLayoutProps {
  locale: string;
  children: React.ReactNode;
}

export default function CountryLayout({ locale, children }: CountryLayoutProps) {
  const theme = getLocaleTheme(locale);
  return (
    <div style={{ background: theme.gradient }} className="min-h-screen">
      {/* Add country/language-specific header, imagery, etc. */}
      {children}
    </div>
  );
}
