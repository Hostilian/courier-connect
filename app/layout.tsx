import { redirect } from 'next/navigation';import Providers from '@/components/Providers'

import { defaultLocale } from '@/i18n';import type { Metadata } from 'next'

import { Inter } from 'next/font/google'

// Root layout - redirects to default localeimport { Toaster } from 'react-hot-toast'

export default function RootLayout({import './globals.css'

  children,

}: {const inter = Inter({ subsets: ['latin'] })

  children: React.ReactNode;

}) {import type { Metadata } from 'next'

  // This will never render because middleware handles the redirectimport './globals.css'

  return children;

}export const metadata: Metadata = {

  title: 'Courier Connect',
  description: 'Fast and reliable delivery service',
}

// This is just a wrapper - the actual layout is in [locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-gray-50 min-h-screen`}>
        <Providers>
          {children}
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
      </body>
    </html>
  )
}