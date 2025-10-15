'use client';

import Link from 'next/link';
import { countries } from '@/lib/countries';

export default function SimpleFooter() {
  return (
    <footer className="w-full bg-slate-50 border-t mt-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <div>
            <div className="font-semibold">Courier Connect</div>
            <div className="text-sm text-muted-foreground">Connect with local couriers — fast pickup, friendly service.</div>
            <div className="mt-2 text-xs">© {new Date().getFullYear()} Courier Connect</div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {countries.slice(0, 10).map(c => (
              <div key={c.code} title={c.name} className="text-lg opacity-90">{c.flag}</div>
            ))}
          </div>
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          <Link href="/privacy" className="mr-4">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
