export const revalidate = 60

import type { Metadata } from 'next'
import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { Check, Shield } from 'lucide-react'
import { getPageSections } from '@/lib/cms'

export const metadata: Metadata = {
  title: 'Árazás',
  description:
    'Az első egyeztetés díjmentes. Önismereti és mentálhigiénés szemléletű beszélgetések elérhető és rugalmas feltételekkel.',
}

const CARD_DEFAULTS = [
  {
    title: 'Ismerkedő egyeztetés',
    price: 'Díjmentes',
    duration: '20-30 perc',
    description:
      'Az első kapcsolatfelvétel nem kötelez semmire. Megnézzük, tudunk-e együtt dolgozni, és megbeszéljük, miben segíthetek.',
    features: ['Online, videokonferencián', 'Kötöttség nélkül', 'Kérdésekre válaszolok', 'Kötelezettségmentes'],
    cta: 'Időpontot kérek',
    ctaLink: '/kapcsolat#naptar',
    highlighted: false,
    priceKey: null,
  },
  {
    title: 'Egyéni önismereti ülés',
    price: 'Érdeklődj',
    duration: '60 perc',
    description:
      'Egyszeri vagy folyamatos önismereti munka, saját tempódban. Az ár az egyeztetés alapján kerül meghatározásra.',
    features: ['Online vagy személyesen', 'Rugalmas időpontfoglalás', 'Teljes titoktartás', 'Nincs minimum ülésszám'],
    cta: 'Árat kérdezem',
    ctaLink: '/kapcsolat',
    highlighted: true,
    priceKey: 'price_60',
  },
  {
    title: 'Online konzultáció',
    price: 'Egyeztetés alapján',
    duration: '90 perc',
    description:
      'Videóhívás formájában, bárhonnan elérhető. Ugyanolyan intenzitással és figyelemmel, mint a személyes találkozók.',
    features: ['Zoom / Google Meet', 'Kényelmes otthoni környezet', 'Rugalmas időzónák', 'Technikailag segítek'],
    cta: 'Részleteket kérdezem',
    ctaLink: '/kapcsolat',
    highlighted: false,
    priceKey: 'price_90',
  },
]

export default async function ArazasPage() {
  const sections = await getPageSections('pricing')

  const intro = sections.intro || 'Az első egyeztetés minden esetben díjmentes. Az árakról nyíltan, egyeztetés alapján beszélünk.'
  const trustText = sections.trust_text || 'Az első kapcsolatfelvétel nem kötelez semmire. Arra szolgál, hogy megnézzük, tudunk-e együtt dolgozni. Az árakról nyíltan, kényelmetlenség nélkül lehet kérdezni. Ha a feltételek nem felelnek meg, szívesen segítek más lehetőséget találni.'
  const ctaText = sections.pricing_cta

  const options = CARD_DEFAULTS.map((card) => ({
    ...card,
    price: (card.priceKey && sections[card.priceKey]) || card.price,
    cta: (card.highlighted && ctaText) ? ctaText : card.cta,
  }))

  return (
    <div style={{ backgroundColor: '#0a0a0a', paddingTop: '5rem' }}>
      {/* Hero */}
      <section className="section-padding px-6 relative overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full pointer-events-none"
          style={{
            height: '400px',
            background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(201,169,110,0.07) 0%, transparent 70%)',
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <span
              className="text-xs tracking-widest uppercase block mb-6"
              style={{ color: 'var(--color-gold)', letterSpacing: '0.15em' }}
            >
              Feltételek
            </span>
            <h1
              className="font-serif mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 300, lineHeight: 1.15, color: '#F0EDE5' }}
            >
              Árazás
            </h1>
            <p className="mx-auto" style={{ color: '#9A9688', maxWidth: '480px', lineHeight: 1.8 }}>
              {intro}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {options.map((opt, i) => (
              <AnimatedSection key={opt.title} delay={i * 100}>
                <div
                  className="p-8 h-full flex flex-col relative"
                  style={{
                    border: opt.highlighted
                      ? '1px solid rgba(201,169,110,0.35)'
                      : '1px solid rgba(201,169,110,0.08)',
                    backgroundColor: opt.highlighted ? '#141414' : '#111111',
                  }}
                >
                  {opt.highlighted && (
                    <div
                      className="absolute top-0 left-0 right-0 py-1.5 text-center text-xs tracking-widest uppercase"
                      style={{
                        backgroundColor: 'rgba(201,169,110,0.12)',
                        color: 'var(--color-gold)',
                        borderBottom: '1px solid rgba(201,169,110,0.2)',
                        letterSpacing: '0.14em',
                      }}
                    >
                      Leggyakoribb
                    </div>
                  )}

                  <div className={opt.highlighted ? 'pt-6' : ''}>
                    <h2 className="font-serif text-xl mb-2" style={{ fontWeight: 400, color: '#F0EDE5' }}>
                      {opt.title}
                    </h2>
                    <p className="text-xs mb-6" style={{ color: '#5A5850' }}>{opt.duration}</p>

                    <div className="mb-6 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span className="font-serif text-3xl" style={{ color: 'var(--color-gold)', fontWeight: 400 }}>
                        {opt.price}
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed mb-6" style={{ color: '#9A9688', lineHeight: 1.8 }}>
                      {opt.description}
                    </p>

                    <ul className="space-y-3 mb-8 flex-1">
                      {opt.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2.5 text-sm" style={{ color: '#5A5850' }}>
                          <Check size={13} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={opt.ctaLink}
                      className="block text-center py-3.5 text-sm tracking-wider transition-all duration-300"
                      style={opt.highlighted ? {
                        backgroundColor: 'var(--color-gold)',
                        color: '#0a0a0a',
                        fontWeight: 500,
                        letterSpacing: '0.08em',
                      } : {
                        border: '1px solid rgba(201,169,110,0.3)',
                        color: 'var(--color-gold)',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {opt.cta}
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Trust note */}
          <AnimatedSection delay={300}>
            <div
              className="mt-12 p-6 flex items-start gap-4"
              style={{ border: '1px solid rgba(201,169,110,0.08)', backgroundColor: 'rgba(201,169,110,0.02)' }}
            >
              <Shield size={18} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '2px' }} />
              <p className="text-sm leading-relaxed" style={{ color: '#9A9688', lineHeight: 1.8 }}>
                <strong style={{ color: '#F0EDE5', fontWeight: 500 }}>Az első kapcsolatfelvétel nem kötelez semmire.</strong>{' '}
                {trustText}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
