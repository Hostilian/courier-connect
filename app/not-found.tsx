import { Home, Package } from 'lucide-react';
import Link from 'next/link';
import { defaultLocale } from '@/i18n';

export default function RootNotFound() {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-300 to-red-400 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-yellow-400/20 mb-8">
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

              <Link
                href={`/${defaultLocale}`}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-yellow-500 rounded-xl hover:bg-yellow-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <Home className="mr-2 w-5 h-5" />
                Go to Homepage
              </Link>

              <div className="mt-12 flex items-center justify-center space-x-3 text-4xl">
                <Link aria-label="English" href="/en" className="hover:scale-110 transition-transform">🇬🇧</Link>
                <Link aria-label="Čeština" href="/cs" className="hover:scale-110 transition-transform">🇨🇿</Link>
                <Link aria-label="Українська" href="/uk" className="hover:scale-110 transition-transform">🇺🇦</Link>
                <Link aria-label="Tiếng Việt" href="/vi" className="hover:scale-110 transition-transform">🇻🇳</Link>
                <Link aria-label="Türkçe" href="/tr" className="hover:scale-110 transition-transform">🇹🇷</Link>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
