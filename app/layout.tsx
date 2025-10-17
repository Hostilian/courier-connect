// Root layout base shell; per-locale layout handles providers and chrome
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="description" content="Courier Connect — local couriers connecting people. Request pickups or become a courier. Fast, friendly service." />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className="bg-white text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
