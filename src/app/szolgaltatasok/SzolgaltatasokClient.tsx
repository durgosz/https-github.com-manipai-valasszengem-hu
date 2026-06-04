'use client'

import { useState } from 'react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { MessageCircle, Compass, RefreshCw } from 'lucide-react'
import CalModal from '@/components/CalModal'
import type { PageSections } from '@/lib/cms'

const SERVICE_DEFAULTS = [
  {
    icon: MessageCircle,
    title: 'Ismerkedő beszélgetés',
    tag: '30 perc · ingyenes',
    description: 'Kötelezettségmentes első találkozó. Megnézzük, tudunk-e együtt dolgozni.',
    calLink: 'sz-d-imdmn0/30min',
  },
  {
    icon: Compass,
    title: 'Önismereti ülés',
    tag: '60 perc',
    description:
      'Egyéni önismereti beszélgetés, ahol saját tempódban, biztonságos térben foglalkozhatsz azzal, ami benned zajlik.',
    calLink: 'sz-d-imdmn0/onismereti-ules',
  },
  {
    icon: RefreshCw,
    title: 'Utánkövetés',
    tag: '45 perc',
    description: 'Visszatérő klienseknek. Folytatjuk ahol abbahagytuk.',
    calLink: 'sz-d-imdmn0/utankovetes',
  },
]

interface ActiveModal {
  calLink: string
  title: string
}

export default function SzolgaltatasokClient({ sections }: { sections: PageSections }) {
  const [modal, setModal] = useState<ActiveModal | null>(null)

  const services = SERVICE_DEFAULTS.map((svc, i) => {
    const n = i + 1
    const name = sections[`s${n}_name`] || svc.title
    const duration = sections[`s${n}_duration`] || ''
    const price = sections[`s${n}_price`] || ''
    const desc = sections[`s${n}_desc`] || svc.description
    const tag = duration
      ? price
        ? `${duration} · ${price}`
        : duration
      : svc.tag
    return { ...svc, title: name, tag, description: desc }
  })

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
              Miben segíthetek
            </span>
            <h1
              className="font-serif mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 300, lineHeight: 1.15, color: '#F0EDE5' }}
            >
              Szolgáltatások
            </h1>
            <p className="mx-auto" style={{ color: '#9A9688', maxWidth: '520px', lineHeight: 1.8 }}>
              Minden, amit kínálok, önismereti és mentálhigiénés szemléletű – nem terápia, nem tanácsadás,
              hanem egy reflektív, kísérő jellegű tér.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Services */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, i) => {
              const Icon = service.icon
              return (
                <AnimatedSection key={service.title} delay={i * 80}>
                  <div
                    className="p-8 h-full flex flex-col"
                    style={{ border: '1px solid rgba(201,169,110,0.08)', backgroundColor: '#111111' }}
                  >
                    <div
                      className="w-11 h-11 flex items-center justify-center mb-5"
                      style={{ border: '1px solid rgba(201,169,110,0.2)', backgroundColor: 'rgba(201,169,110,0.04)' }}
                    >
                      <Icon size={18} style={{ color: 'var(--color-gold)' }} />
                    </div>
                    <span
                      className="text-xs tracking-wider uppercase mb-3 block"
                      style={{ color: 'var(--color-gold)', letterSpacing: '0.1em', opacity: 0.8 }}
                    >
                      {service.tag}
                    </span>
                    <h2 className="font-serif text-xl mb-4" style={{ fontWeight: 400, color: '#F0EDE5', lineHeight: 1.3 }}>
                      {service.title}
                    </h2>
                    <p className="text-sm leading-relaxed mb-8 flex-1" style={{ color: '#9A9688', lineHeight: 1.85 }}>
                      {service.description}
                    </p>
                    <button
                      onClick={() => setModal({ calLink: service.calLink, title: service.title })}
                      className="w-full text-center py-3 text-xs tracking-wider transition-all duration-200 cursor-pointer"
                      style={{
                        border: '1px solid rgba(201,169,110,0.35)',
                        color: 'var(--color-gold)',
                        backgroundColor: 'rgba(201,169,110,0.04)',
                        letterSpacing: '0.1em',
                      }}
                    >
                      Időpontot kérek
                    </button>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>

          <AnimatedSection delay={200}>
            <div
              className="mt-12 p-6 text-sm leading-relaxed"
              style={{
                border: '1px solid rgba(201,169,110,0.08)',
                backgroundColor: 'rgba(201,169,110,0.02)',
                color: '#5A5850',
              }}
            >
              <strong style={{ color: '#9A9688' }}>Fontos megjegyzés: </strong>
              Az önismereti és mentálhigiénés szemléletű beszélgetések nem pszichoterápiák,
              és nem helyettesítik az orvosi, pszichológiai vagy pszichoterápiás ellátást.
              Ha pszichoterápiás szintű segítségre van szükséged, szívesen segítek megtalálni
              a megfelelő szakembert.
            </div>
          </AnimatedSection>
        </div>
      </section>

      {modal && (
        <CalModal
          calLink={modal.calLink}
          title={modal.title}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
