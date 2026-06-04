'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

const faqs = [
  {
    q: 'Ez terápia?',
    a: 'Nem. Az önismereti és mentálhigiénés szemléletű beszélgetések nem pszichoterápiák, és nem helyettesítik az orvosi, pszichológiai vagy pszichoterápiás ellátást. Ha terápiás szintű segítségre van szükséged, szívesen segítek abban, hogy megtaláld a megfelelő szakembert.',
  },
  {
    q: 'Mennyibe kerül?',
    a: 'Az első egyeztetés díjmentes – arra szolgál, hogy megnézzük, tudunk-e együtt dolgozni. A részletes árakért látogass el az Árazás oldalra, vagy keress meg bátran.',
  },
  {
    q: 'Hogyan zajlik egy ülés?',
    a: 'Általában 50-60 percet töltünk együtt, online vagy személyesen. A találkozások nem előadások – inkább közös gondolkodás, reflektív párbeszéd. Nincs kötelező struktúra, inkább azt követjük, ami számodra a legfontosabb.',
  },
  {
    q: 'Online is elérhető?',
    a: 'Igen, teljes mértékben. Az online ülések ugyanolyan intenzitással és figyelemmel zajlanak, mint a személyes találkozók. A technikai részleteket egyeztetjük.',
  },
  {
    q: 'Miről lehet beszélni?',
    a: 'Bármiről, ami foglalkoztat – kapcsolatokról, elakadásokról, döntési helyzetekről, önértékelésről, identitásról, belső mintákról. Nincs olyan, ami "túl kicsi" vagy "túl nagy" téma.',
  },
  {
    q: 'Kell előzetes tapasztalat önismeretben?',
    a: 'Egyáltalán nem. Akár most kezded el az önismereti utadat, akár már régóta foglalkozol magaddal – mindenki a saját helyéről indul. Fontos, hogy legyen benned nyitottság és kíváncsiság.',
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section
      className="section-padding px-6"
      style={{ backgroundColor: '#0d0d0d' }}
    >
      <div className="max-w-3xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-14">
            <span
              className="text-xs tracking-widest uppercase block mb-4"
              style={{ color: '#C9A96E', letterSpacing: '0.15em' }}
            >
              Kérdések
            </span>
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                fontWeight: 400,
                color: '#F0EDE5',
              }}
            >
              Amit sokan kérdeznek
            </h2>
          </div>
        </AnimatedSection>

        <div className="space-y-0">
          {faqs.map((faq, i) => (
            <AnimatedSection key={i} delay={i * 60}>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between py-6 text-left gap-4 group"
                >
                  <span
                    className="font-serif text-lg transition-colors duration-200"
                    style={{
                      color: open === i ? '#C9A96E' : '#F0EDE5',
                      fontWeight: 400,
                      lineHeight: 1.3,
                    }}
                  >
                    {faq.q}
                  </span>
                  <span
                    className="shrink-0 w-8 h-8 flex items-center justify-center transition-all duration-200"
                    style={{
                      border: '1px solid rgba(201,169,110,0.2)',
                      color: '#C9A96E',
                      backgroundColor: open === i ? 'rgba(201,169,110,0.08)' : 'transparent',
                    }}
                  >
                    {open === i ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: open === i ? '300px' : '0px' }}
                >
                  <p
                    className="pb-6 leading-relaxed text-sm"
                    style={{ color: '#9A9688', lineHeight: 1.8 }}
                  >
                    {faq.a}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
