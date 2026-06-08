import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Supabase hostname deriválása env-ből, hogy ne kelljen hardcode-olni
function getSupabaseHostname() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) return 'btchdlzzoiqoaheggnod.supabase.co'
  try {
    return new URL(url).hostname
  } catch {
    return 'btchdlzzoiqoaheggnod.supabase.co'
  }
}

/** @type {import('next').NextConfig} */

const cspReportOnly = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://app.cal.com https://www.googletagmanager.com https://connect.facebook.net",
  "frame-src https://app.cal.com https://cal.com",
  "connect-src 'self' https://app.cal.com https://www.google-analytics.com https://*.supabase.co wss://*.supabase.co",
  "img-src 'self' data: blob: https:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "media-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "report-uri /api/csp-report",
].join('; ')

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: getSupabaseHostname(),
        pathname: '/storage/v1/object/**',
      },
    ],
  },

  turbopack: {
    root: __dirname,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()',
          },
          { key: 'Content-Security-Policy-Report-Only', value: cspReportOnly },
        ],
      },
    ]
  },

  async redirects() {
    return [
      {
        source: '/blog/tanacssadas-vs-terapia',
        destination: '/blog/tanacsadas-vs-terapia',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
