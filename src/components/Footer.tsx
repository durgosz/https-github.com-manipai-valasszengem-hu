import Link from 'next/link'
import { Heart } from 'lucide-react'
import CookieSettingsButton from '@/components/CookieSettingsButton'

const footerLinks = {
  oldalak: [
    { href: '/rolam', label: 'Rólam' },
    { href: '/szolgaltatasok', label: 'Szolgáltatások' },
    { href: '/arazas', label: 'Árazás' },
    { href: '/blog', label: 'Blog / Gondolatok' },
    { href: '/kapcsolat', label: 'Kapcsolat' },
  ],
  jogi: [
    { href: '/adatkezeles', label: 'Adatkezelési tájékoztató' },
    { href: '/cookie', label: 'Cookie tájékoztató' },
  ],
}

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#080808',
        borderTop: '1px solid rgba(201,169,110,0.08)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="font-serif text-xl tracking-widest uppercase block mb-4"
              style={{ color: '#C9A96E', letterSpacing: '0.2em' }}>
              válassz engem
            </Link>
            <p className="text-sm leading-relaxed mb-3" style={{ color: '#5A5850' }}>
              Biztonságos és bizalmas tér<br />az önismerethez és belső megértéshez.
            </p>
            <a
              href="mailto:hello@valasszengem.hu"
              className="text-sm mb-5 block transition-colors"
              style={{ color: '#C9A96E' }}
            >
              hello@valasszengem.hu
            </a>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 transition-colors duration-300"
                style={{ color: '#5A5850' }}
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 transition-colors duration-300"
                style={{ color: '#5A5850' }}
                aria-label="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs tracking-widest uppercase mb-6" style={{ color: '#C9A96E', letterSpacing: '0.15em' }}>
              Oldalak
            </h3>
            <ul className="space-y-3">
              {footerLinks.oldalak.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-gold"
                    style={{ color: '#5A5850' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs tracking-widest uppercase mb-6" style={{ color: '#C9A96E', letterSpacing: '0.15em' }}>
              Jogi információk
            </h3>
            <ul className="space-y-3 mb-8">
              {footerLinks.jogi.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: '#5A5850' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookieSettingsButton />
              </li>
            </ul>
            <div
              className="text-xs leading-relaxed p-4"
              style={{
                color: '#3A3A32',
                border: '1px solid rgba(201,169,110,0.06)',
                backgroundColor: 'rgba(201,169,110,0.02)',
              }}
            >
              A tartalomban szereplő önismereti és mentálhigiénés szemléletű
              beszélgetések nem helyettesítik az orvosi, pszichológiai vagy
              pszichoterápiás ellátást.
            </div>
          </div>
        </div>

        <div
          className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <p className="text-xs" style={{ color: '#3A3A32' }}>
            © {new Date().getFullYear()} válassz engem. Minden jog fenntartva.
          </p>
          <p className="text-xs flex items-center gap-1.5" style={{ color: '#3A3A32' }}>
            Nem kell egyedül hordoznod mindent. <Heart size={10} style={{ color: '#C9A96E' }} />
          </p>
        </div>
      </div>
    </footer>
  )
}
