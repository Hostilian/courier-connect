"use client";
import { defaultLocale } from '@/i18n';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/${defaultLocale}`);
  }, [router]);

  // Fallback UI in case redirect fails
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 via-orange-300 to-red-400">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Redirecting to your language homepage...</h1>
        <p className="text-lg text-white/80">If you are not redirected, <a href={`/${defaultLocale}`} className="underline">click here</a>.</p>
      </div>
    </main>
  );
}
