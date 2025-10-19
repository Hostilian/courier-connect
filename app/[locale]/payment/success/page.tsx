import { getLanguageByCode } from '@/lib/languages';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

interface PaymentSuccessPageProps {
  params: { locale: string };
  searchParams: { session_id?: string };
}

export default async function PaymentSuccessPage({ params: { locale }, searchParams }: PaymentSuccessPageProps) {
  const t = await getTranslations({ locale, namespace: 'payment' });
  const theme = getLanguageByCode(locale)?.culturalTheme;
  const sessionId = searchParams?.session_id;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center text-center gap-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: theme?.primary || '#22c55e' }}
          >
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-3xl font-bold">{t('success.title')}</h1>
          <p className="text-gray-600">{t('success.description')}</p>
          {sessionId && (
            <div className="bg-gray-100 rounded-lg px-4 py-3 font-mono text-sm text-gray-600">
              {t('success.sessionLabel')}: {sessionId}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-6">
            <Link
              href={`/${locale}/track`}
              className="flex-1 px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              {t('success.trackDelivery')}
            </Link>
            <Link
              href={`/${locale}/request`}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-200 font-medium hover:bg-gray-50 transition"
            >
              {t('success.newDelivery')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
