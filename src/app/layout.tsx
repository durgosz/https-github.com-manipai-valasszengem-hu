import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import PublicShell from '@/components/PublicShell'
import { getDesignSettings } from '@/lib/cms'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://valasszengem.hu'),
  title: {
    template: '%s | válassz engem',
    default: 'válassz engem – Önismereti és mentálhigiénés beszélgetések',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  description:
    'Biztonságos és bizalmas tér az önismerethez. Reflektív önismereti beszélgetések, amelyek segítenek megérteni önmagunkat, kapcsolatainkat és belső mintáinkat.',
  keywords: [
    'önismeret',
    'mentálhigiéné',
    'önismereti beszélgetés',
    'önfejlesztés',
    'kapcsolati minták',
    'elakadás',
    'önbizalom',
    'önértékelés',
  ],
  authors: [{ name: 'válassz engem' }],
  openGraph: {
    type: 'website',
    locale: 'hu_HU',
    url: 'https://valasszengem.hu',
    siteName: 'válassz engem',
    title: 'válassz engem – Önismereti és mentálhigiénés beszélgetések',
    description:
      'Ki vagyok én, ha NEM ENGEM választanak? Biztonságos tér az önismerethez.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'válassz engem – önismereti és mentálhigiénés beszélgetések',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'válassz engem',
    description: 'Ki vagyok én, ha NEM ENGEM választanak?',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const design = await getDesignSettings()
  return (
    <html lang="hu" className={`${cormorant.variable} ${inter.variable}`}>
      <body
        className="bg-background text-text-primary font-sans antialiased"
        style={{ '--color-gold': design.primary_color } as React.CSSProperties}
      >
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  )
}
