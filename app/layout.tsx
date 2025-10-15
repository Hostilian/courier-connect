// Root layout base shell; per-locale layout handles providers and chrome
import './globals.css';

export const metadata = {
  title: 'Courier Connect',
  description: 'Fast, local, friendly delivery service. Connect with couriers in your community.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: '#FCD34D',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Courier Connect',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-white text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
