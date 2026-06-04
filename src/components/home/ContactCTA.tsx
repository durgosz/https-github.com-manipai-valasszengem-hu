import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { Shield } from 'lucide-react'

export default function ContactCTA() {
  return (
    <section
      className="section-padding px-6 relative overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(201,169,110,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <AnimatedSection>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 mb-10 text-xs tracking-widest uppercase"
            style={{
              border: '1px solid rgba(201,169,110,0.15)',
              color: '#C9A96E',
              backgroundColor: 'rgba(201,169,110,0.04)',
              letterSpacing: '0.14em',
            }}
          >
            <Shield size={11} />
            Az első kapcsolatfelvétel díjmentes
          </div>

          <h2
            className="font-serif mb-6"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 300,
              lineHeight: 1.2,
              color: '#F0EDE5',
            }}
          >
            Készen állsz arra, hogy<br />
            <span className="text-gradient-gold font-normal italic">magadat válaszd?</span>
          </h2>

          <p
            className="mb-10 mx-auto leading-relaxed"
            style={{ color: '#9A9688', maxWidth: '480px', lineHeight: 1.8 }}
          >
            Az első kapcsolatfelvétel nem kötelez semmire. Arra szolgál, hogy
            megnézzük, tudunk-e együtt dolgozni. Biztonságos és kényelmes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/kapcsolat#naptar"
              className="inline-block px-10 py-4 text-sm tracking-wider transition-all duration-300"
              style={{
                backgroundColor: '#C9A96E',
                color: '#0a0a0a',
                fontWeight: 500,
                letterSpacing: '0.1em',
              }}
            >
              Időpontot kérek
            </Link>
            <Link
              href="/rolam"
              className="text-sm tracking-wider transition-colors duration-300"
              style={{ color: '#5A5850', letterSpacing: '0.08em' }}
            >
              Előbb jobban megismerlek →
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
