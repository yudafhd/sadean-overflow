import './globals.css'
import React from 'react'
import { SplashGate } from '@/folderly/components/SplashGate'

export const metadata = {
  title: 'Sadean Overflow',
  description: 'Kalkulator modal, harga jual, dan laba produk berbasis resep',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="text-gray-900 antialiased">
        <SplashGate>
          <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">{children}</div>
        </SplashGate>
      </body>
    </html>
  )
}
