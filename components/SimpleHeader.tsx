'use client';

import LanguageSelector from '@/components/LanguageSelector';
import LocationSelector from '@/components/LocationSelector';
import Link from 'next/link';

export default function SimpleHeader() {
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center font-bold text-lg">CC</div>
          <div>
            <div className="font-semibold text-lg">Courier Connect</div>
            <div className="text-xs text-muted-foreground">Fast. Local. Friendly.</div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <LocationSelector />
          <LanguageSelector />
          <Link href="/request" className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm">Request</Link>
          <Link href="/courier/register" className="px-3 py-2 border rounded-md text-sm">Become a courier</Link>
        </div>
      </div>
    </header>
  );
}
