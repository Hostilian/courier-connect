import Providers from '@/components/Providers';
import SimpleFooter from '@/components/SimpleFooter';
import SimpleHeader from '@/components/SimpleHeader';
import WelcomeModal from '@/components/WelcomeModal';
import { locales } from '@/i18n';
import { getLanguageByCode } from '@/lib/languages';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import '../globals.css';

const inter = Inter({ subsets: ['latin', 'latin-ext', 'cyrillic', 'vietnamese'] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const titles = {
    en: 'Courier Connect - Fast & Reliable Delivery',
    cs: 'Courier Connect - Rychlá a Spolehlivá Doprava',
    uk: 'Courier Connect - Швидка та Надійна Доставка',
    vi: 'Courier Connect - Giao Hàng Nhanh & Tin Cậy',
    tr: 'Courier Connect - Hızlı ve Güvenilir Teslimat',
  };

  const descriptions = {
    en: 'Fast, secure delivery service with real-time tracking. No registration needed for customers!',
    cs: 'Rychlá a bezpečná doručovací služba s sledováním v reálném čase. Bez registrace pro zákazníky!',
    uk: 'Швидка та безпечна служба доставки з відстеженням у реальному часі. Без реєстрації для клієнтів!',
    vi: 'Dịch vụ giao hàng nhanh, an toàn với theo dõi thời gian thực. Không cần đăng ký cho khách hàng!',
    tr: 'Gerçek zamanlı takip ile hızlı, güvenli teslimat hizmeti. Müşteriler için kayıt gerekmez!',
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    keywords: 'delivery, courier, tracking, fast shipping, local delivery',
    authors: [{ name: 'Courier Connect Team' }],
    manifest: '/manifest.json',
  };
}

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: '#FBBF24',
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Get messages for the locale
  const messages = await getMessages();
  const isRtl = !!getLanguageByCode(locale)?.rtl;

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'} className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-gray-50 min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <WelcomeModal />
            <SimpleHeader />
            <main className="flex-1 w-full">{children}</main>
            <SimpleFooter />
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
