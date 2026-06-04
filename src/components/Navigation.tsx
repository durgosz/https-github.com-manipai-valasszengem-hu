'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Főoldal' },
  { href: '/rolam', label: 'Rólam' },
  { href: '/szolgaltatasok', label: 'Szolgáltatások' },
  { href: '/arazas', label: 'Árazás' },
  { href: '/blog', label: 'Blog' },
  { href: '/kapcsolat', label: 'Kapcsolat' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? 'rgba(10,10,10,0.92)'
            : 'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0))',
          backdropFilter: 'blur(4px)',
          borderBottom: scrolled ? '1px solid rgba(201,169,110,0.08)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-xl tracking-widest uppercase"
            style={{ color: '#C9A96E', letterSpacing: '0.2em' }}
          >
            válassz engem
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm tracking-wider transition-colors duration-300 relative group"
                style={{
                  color: pathname === link.href ? '#C9A96E' : '#9A9688',
                  fontWeight: 400,
                  letterSpacing: '0.08em',
                }}
              >
                {link.label}
                <span
                  className="absolute -bottom-1 left-0 h-px transition-all duration-300"
                  style={{
                    width: pathname === link.href ? '100%' : '0%',
                    backgroundColor: '#C9A96E',
                  }}
                />
              </Link>
            ))}
            <Link
              href="/kapcsolat"
              className="text-sm px-6 py-2.5 transition-all duration-300 tracking-wider"
              style={{
                border: '1px solid rgba(201,169,110,0.4)',
                color: '#C9A96E',
                letterSpacing: '0.08em',
                backgroundColor: 'rgba(201,169,110,0.04)',
              }}
            >
              Időpontot kérek
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 transition-colors"
            style={{ color: '#C9A96E' }}
            aria-label="Menü"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col pt-20"
          style={{ backgroundColor: 'rgba(10,10,10,0.98)' }}
        >
          <div className="flex flex-col gap-1 px-6 pt-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-serif text-3xl py-4 border-b transition-colors duration-200"
                style={{
                  color: pathname === link.href ? '#C9A96E' : '#9A9688',
                  borderColor: 'rgba(201,169,110,0.08)',
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/kapcsolat"
              className="mt-8 text-center py-4 text-sm tracking-widest transition-all duration-300"
              style={{
                border: '1px solid rgba(201,169,110,0.4)',
                color: '#C9A96E',
                letterSpacing: '0.12em',
              }}
            >
              IDŐPONTOT KÉREK
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
