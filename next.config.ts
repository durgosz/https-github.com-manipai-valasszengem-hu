import type { NextConfig } from 'next'

const cspReportOnly = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://app.cal.com https://www.googletagmanager.com https://connect.facebook.net",
  "frame-src https://app.cal.com https://cal.com",
  "connect-src 'self' https://app.cal.com https://www.google-analytics.com",
  "img-src 'self' data: https:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "report-uri /api/csp-report",
].join('; ')

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy-Report-Only',
            value: cspReportOnly,
          },
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
