import { defaultLocale } from '@/i18n';
import { languages } from '@/lib/languages';
import { Home, Package, Search } from 'lucide-react';
import Link from 'next/link';

export default function RootNotFound() {
  // Get all language flags for display
  const languageOptions = languages.map(lang => ({
    code: lang.code,
    flag: lang.flag,
    name: lang.name,
    nativeName: lang.nativeName
  }));

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-300 to-red-400 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-yellow-400/20 mb-8 animate-pulse">
                <Package className="w-16 h-16 text-yellow-600" />
              </div>

              <h1 className="text-8xl sm:text-9xl font-black text-yellow-600 mb-6">
                404
              </h1>

              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Page Not Found
              </h2>

              <p className="text-xl text-gray-700 mb-3">
                Oops! This package seems to have been delivered to the wrong address.
              </p>

              <p className="text-gray-600 mb-10">
                The page you're looking for doesn't exist or has been moved.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`/${defaultLocale}`}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-yellow-500 rounded-xl hover:bg-yellow-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Home className="mr-2 w-5 h-5" />
                  Go to Homepage
                </Link>
                
                <Link
                  href={`/${defaultLocale}/track`}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Search className="mr-2 w-5 h-5" />
                  Track a Package
                </Link>
              </div>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-4xl">
                {languageOptions.map(lang => (
                  <Link 
                    key={lang.code}
                    aria-label={lang.name}
                    href={`/${lang.code}`}
                    className="hover:scale-110 transition-transform"
                  >
                    {lang.flag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
