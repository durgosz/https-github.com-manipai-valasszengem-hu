'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Shield, ChevronDown } from 'lucide-react'

interface HeroProps {
  title?: string
  subtitle?: string
  ctaText?: string
  bgImage?: string
  overlayOpacity?: number
}

export default function Hero({
  title,
  subtitle,
  ctaText,
  bgImage,
  overlayOpacity,
}: HeroProps) {
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const el = parallaxRef.current
      if (!el) return
      el.style.transform = `translateY(${window.scrollY * 0.35}px)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const overlayAlpha = (overlayOpacity ?? 45) / 100
  const resolvedCta = ctaText || 'Időpontot kérek'

  return (
    <section
      className="relative flex flex-col overflow-hidden
                 min-h-[100svh] md:min-h-screen
                 justify-start md:justify-center
                 items-center
                 pt-[120px] pb-16 px-6
                 md:pt-0 md:pb-0 md:px-0"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Parallax háttér */}
      <div ref={parallaxRef} className="absolute inset-0 pointer-events-none">
        <Image
          src={bgImage || '/hero-bg.png'}
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-[30%_center] md:object-[24%_center]"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(10,10,10,${overlayAlpha})` }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full"
          style={{
            height: '70%',
            background: 'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(201,169,110,0.10) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Díszítő SVG figurák */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <svg viewBox="0 0 800 500" className="w-full max-w-4xl opacity-20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.8">
            <circle cx="220" cy="160" r="32" stroke="#C9A96E" strokeWidth="0.8" strokeOpacity="0.7" />
            <line x1="220" y1="192" x2="220" y2="310" stroke="#C9A96E" strokeWidth="0.8" strokeOpacity="0.5" />
            <path d="M220 230 Q180 215 165 240" stroke="#C9A96E" strokeWidth="0.8" strokeOpacity="0.5" strokeLinecap="round" />
            <path d="M220 310 Q200 360 185 400" stroke="#C9A96E" strokeWidth="0.8" strokeOpacity="0.4" strokeLinecap="round" />
            <path d="M220 310 Q240 360 255 400" stroke="#C9A96E" strokeWidth="0.8" strokeOpacity="0.4" strokeLinecap="round" />
          </g>
          <g opacity="0.8">
            <circle cx="580" cy="160" r="32" stroke="#C9A96E" strokeWidth="0.8" strokeOpacity="0.7" />
            <line x1="580" y1="192" x2="580" y2="310" stroke="#C9A96E" strokeWidth="0.8" strokeOpacity="0.5" />
            <path d="M580 230 Q620 215 635 240" stroke="#C9A96E" strokeWidth="0.8" strokeOpacity="0.5" strokeLinecap="round" />
            <path d="M580 310 Q560 360 545 400" stroke="#C9A96E" strokeWidth="0.8" strokeOpacity="0.4" strokeLinecap="round" />
            <path d="M580 310 Q600 360 615 400" stroke="#C9A96E" strokeWidth="0.8" strokeOpacity="0.4" strokeLinecap="round" />
          </g>
          <path d="M252 220 Q400 150 548 220" stroke="#C9A96E" strokeWidth="0.5" strokeOpacity="0.25" fill="none" strokeDasharray="4 8" />
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#C9A96E" stopOpacity="0" />
          </radialGradient>
          <ellipse cx="400" cy="240" rx="140" ry="100" fill="url(#centerGlow)" />
        </svg>
      </div>

      {/* Tartalom */}
      <div className="relative z-10 text-center w-full max-w-[960px] mx-auto">
        {/* Bizalmi badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 mb-10 text-xs tracking-widest uppercase"
          style={{
            border: '1px solid rgba(201,169,110,0.2)',
            color: 'var(--color-gold)',
            backgroundColor: 'rgba(201,169,110,0.04)',
            letterSpacing: '0.14em',
          }}
        >
          <Shield size={12} />
          Biztonságos és bizalmas
        </div>

        {/* Főcím */}
        {title ? (
          <h1
            className="font-serif mb-6 hero-h1"
            style={{ fontWeight: 300, letterSpacing: '-0.01em', color: '#F0EDE5' }}
          >
            {title}
          </h1>
        ) : (
          <h1
            className="font-serif mb-6 hero-h1"
            style={{ fontWeight: 300, letterSpacing: '-0.01em', color: '#F0EDE5' }}
          >
            Ki vagyok én,<br />
            ha{' '}
            <span className="text-gradient-gold font-semibold italic">NEM ENGEM</span>
            <br className="md:hidden" />
            <span className="hidden md:inline"> </span>
            választanak?
          </h1>
        )}

        {/* Alcím */}
        <p
          className="font-serif mb-10 mx-auto hero-subtitle"
          style={{ fontWeight: 300, maxWidth: '600px', fontStyle: 'italic' }}
        >
          {subtitle || 'Nem kell egyedül hordoznod mindent.'}
        </p>

        {/* CTA gombok */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <Link
            href="/kapcsolat#naptar"
            className="flex items-center justify-center tracking-wider transition-all duration-300 w-full sm:w-auto"
            style={{
              backgroundColor: 'var(--color-gold)',
              color: '#0a0a0a',
              fontWeight: 600,
              letterSpacing: '0.06em',
              fontSize: '16px',
              height: '56px',
              padding: '0 32px',
              maxWidth: '320px',
              minWidth: '220px',
            }}
          >
            {resolvedCta}
          </Link>
          <Link
            href="/szolgaltatasok"
            className="flex items-center justify-center tracking-wider transition-all duration-300 w-full sm:w-auto"
            style={{
              border: '1px solid rgba(201,169,110,0.35)',
              color: 'var(--color-gold)',
              letterSpacing: '0.06em',
              fontSize: '16px',
              height: '56px',
              padding: '0 32px',
              maxWidth: '320px',
              minWidth: '220px',
              backgroundColor: 'rgba(201,169,110,0.04)',
            }}
          >
            Megnézem, miben segíthet
          </Link>
        </div>

        {/* Elválasztó vonal */}
        <div
          className="mx-auto mt-16 hidden md:block"
          style={{
            width: '1px',
            height: '60px',
            background: 'linear-gradient(to bottom, transparent, rgba(201,169,110,0.3), transparent)',
          }}
        />
      </div>

      {/* Scroll jelző */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <ChevronDown size={20} style={{ color: 'rgba(201,169,110,0.4)', animation: 'var(--animate-glow-pulse)' }} />
      </div>
    </section>
  )
}
