import Providers from '@/components/Providers'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Courier Connect - Fast Local Delivery Service',
  description: 'Connect with local couriers for fast, reliable delivery of packages, gifts, and marketplace items. No registration required for customers.',
  keywords: 'courier, delivery, local delivery, package delivery, marketplace pickup',
  authors: [{ name: 'Courier Connect Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3B82F6',
  manifest: '/manifest.json',
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