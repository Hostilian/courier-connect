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
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="description" content="Courier Connect — local couriers connecting people. Request pickups or become a courier. Fast, friendly service." />
      </head>
      <body className="bg-white text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
