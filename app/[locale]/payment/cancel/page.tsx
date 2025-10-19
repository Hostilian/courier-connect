import { getLanguageByCode } from '@/lib/languages';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

interface PaymentCancelPageProps {
  params: { locale: string };
}

export default async function PaymentCancelPage({ params: { locale } }: PaymentCancelPageProps) {
  const t = await getTranslations({ locale, namespace: 'payment' });
  const theme = getLanguageByCode(locale)?.culturalTheme;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center text-center gap-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: theme?.secondary || '#f97316' }}
          >
            <span className="text-4xl">⚠️</span>
          </div>
          <h1 className="text-3xl font-bold">{t('cancel.title')}</h1>
          <p className="text-gray-600">{t('cancel.description')}</p>
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-6">
            <Link
              href={`/${locale}/request`}
              className="flex-1 px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              {t('cancel.tryAgain')}
            </Link>
            <Link
              href={`/${locale}/track`}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-200 font-medium hover:bg-gray-50 transition"
            >
              {t('cancel.trackDelivery')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
