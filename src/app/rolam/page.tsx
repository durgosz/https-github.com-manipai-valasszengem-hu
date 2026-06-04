export const revalidate = 60

import type { Metadata } from 'next'
import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Link from 'next/link'
import { getPageSections, getSiteImages } from '@/lib/cms'

export const metadata: Metadata = {
  title: 'Rólam | Durgó Szulejmán – Önismereti és mentálhigiénés beszélgetések',
  description:
    'Durgó Szulejmán önismereti és mentálhigiénés szemléletű beszélgetéseket kínál. Nem terápia – hanem egy biztonságos tér, ahol nem kell egyedül hordoznod azt, ami fáj.',
  robots: { index: false, follow: true },
}

const DEFAULT_TOPICS = [
  'önismereti kérdések',
  'kapcsolati nehézségek',
  'veszteségek és elutasítások',
  'szégyen és önelfogadás',
  'visszatérő minták az életünkben',
  'identitás és életközepi változások',
  'érzelmekkel való kapcsolatunk',
]

const DEFAULT_BIO_MAIN = `Sokáig azt kerestem, hogy mi hiányzik.

Melyik felismerés, melyik módszer, melyik ember hozza majd el azt, amire vágyom.

Ma már úgy látom, hogy nem egy válasz hiányzott.

Hanem néhány egészen egyszerű dolog, amire valószínűleg mindannyian vágyunk valahol:

Vegyél észre. Válassz engem. Maradj velem.`

const DEFAULT_BIO_DETAIL = `Ezek a mondatok sokáig láthatatlanul ott voltak a döntéseim, a kapcsolataim és a kereséseim mögött.

Az elmúlt években sok időt töltöttem önismerettel. Terápiában, csoportokban, képzéseken és olyan beszélgetésekben, amelyek néha többet adtak, mint bármilyen könyv vagy elmélet.

Nem egy nagy felismerés változtatott meg. Hanem egy döntés – hogy megnézem, mi lett volna, ha maradok.

Érdekel, hogy egy ember hogyan érti a saját történetét. Mi foglalkoztatja. Mivel küzd. Mire vágyik. Mi az, ami újra és újra visszatér az életében, hiába próbálja már rég maga mögött hagyni.

A beszélgetések során együtt próbáljuk jobban megérteni azt, ami most fontos.`

const pageBg = [
  'radial-gradient(ellipse 70% 50% at 2% 4%, rgba(201,169,110,0.11) 0%, transparent 62%)',
  'radial-gradient(ellipse 38% 28% at 12% 18%, rgba(180,130,65,0.05) 0%, transparent 55%)',
  'radial-gradient(ellipse 65% 55% at 52% 48%, rgba(0,0,0,0.22) 0%, transparent 72%)',
  '#0a0a0a',
].join(', ')

const grainSvg =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E\")"

export default async function RolamPage() {
  const [sections, images] = await Promise.all([
    getPageSections('about'),
    getSiteImages(),
  ])

  const bioMain = sections.bio_main || DEFAULT_BIO_MAIN
  const bioDetail = sections.bio_detail || DEFAULT_BIO_DETAIL
  const topics = sections.topics
    ? sections.topics.split('\n').map((t) => t.trim()).filter(Boolean)
    : DEFAULT_TOPICS
  const aboutImage = images['about']

  const bioMainParagraphs = bioMain.split('\n\n').map((p) => p.trim()).filter(Boolean)
  const bioDetailParagraphs = bioDetail.split('\n\n').map((p) => p.trim()).filter(Boolean)
  const allParagraphs = [...bioMainParagraphs, ...bioDetailParagraphs]

  return (
    <div
      className="relative"
      style={{ background: pageBg, paddingTop: '5rem' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: grainSvg, backgroundRepeat: 'repeat', zIndex: 0 }}
      />

      {/* Hero szekció */}
      <section className="section-padding px-6 relative" style={{ zIndex: 1 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <AnimatedSection>
            <span
              className="text-xs tracking-widest uppercase block mb-6"
              style={{ color: 'var(--color-gold)', letterSpacing: '0.15em' }}
            >
              Rólam
            </span>
            <h1
              className="font-serif mb-4"
              style={{
                fontSize: 'clamp(48px, 4vw, 72px)',
                fontWeight: 300,
                lineHeight: 1.08,
                color: '#F0EDE5',
              }}
            >
              Durgó Szulejmán
            </h1>
            <p
              className="font-serif"
              style={{
                color: 'rgba(201,169,110,0.85)',
                fontSize: '20px',
                fontWeight: 300,
                fontStyle: 'italic',
                lineHeight: 1.5,
              }}
            >
              Egy emberi hang a saját utadon
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="px-6 pb-24 relative" style={{ zIndex: 1 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 lg:gap-24">

            {/* Profilkép vagy DS monogram */}
            <AnimatedSection className="order-1 lg:col-start-1 lg:row-start-1">
              <div className="flex justify-center lg:justify-start">
                {aboutImage ? (
                  <div
                    className="relative overflow-hidden"
                    style={{ width: '280px', height: '360px', border: '1px solid rgba(212,162,76,0.40)' }}
                  >
                    <Image
                      src={aboutImage}
                      alt="Durgó Szulejmán"
                      fill
                      className="object-cover"
                      sizes="280px"
                    />
                  </div>
                ) : (
                  <div
                    className="relative flex items-center justify-center"
                    style={{
                      width: '140px',
                      height: '140px',
                      background: 'rgba(0,0,0,0.55)',
                      border: '1px solid rgba(212,162,76,0.40)',
                    }}
                  >
                    <span
                      className="font-serif"
                      style={{
                        fontSize: '46px',
                        fontWeight: 300,
                        color: 'rgba(212,162,76,0.55)',
                        letterSpacing: '0.1em',
                        lineHeight: 1,
                      }}
                    >
                      DS
                    </span>
                    <div className="absolute top-0 left-0 w-5 h-5" style={{ borderTop: '1px solid rgba(212,162,76,0.35)', borderLeft: '1px solid rgba(212,162,76,0.35)' }} />
                    <div className="absolute bottom-0 right-0 w-5 h-5" style={{ borderBottom: '1px solid rgba(212,162,76,0.35)', borderRight: '1px solid rgba(212,162,76,0.35)' }} />
                  </div>
                )}
              </div>
            </AnimatedSection>

            {/* Bemutatkozó szöveg */}
            <AnimatedSection delay={150} className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2">
              <div style={{ maxWidth: '700px' }}>
                <div className="w-12 mb-6" style={{ height: '1px', backgroundColor: 'rgba(201,169,110,0.4)' }} />
                <div className="space-y-5 rolam-body">
                  {allParagraphs.map((p, i) => (
                    <p
                      key={i}
                      className={i === 4 ? 'font-serif' : undefined}
                      style={
                        i === 4
                          ? { color: '#F0EDE5', fontWeight: 300, fontStyle: 'italic' }
                          : i === 0 || i === 2
                          ? { color: '#F0EDE5', fontWeight: 300 }
                          : undefined
                      }
                    >
                      {p}
                    </p>
                  ))}
                </div>
                <div className="mt-7" style={{ borderLeft: '2px solid rgba(201,169,110,0.45)', paddingLeft: '1.5rem' }}>
                  <p className="font-serif rolam-body" style={{ color: 'var(--color-gold)', fontWeight: 300 }}>
                    Nem kell készülni. Nem kell normálisnak lenni. Nem kell mindent érteni magadról ahhoz,
                    hogy leülj valakivel.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Témák lista */}
            <div className="order-3 lg:col-start-1 lg:row-start-2">
              <h3
                className="text-xs tracking-widest uppercase mb-5"
                style={{ color: 'var(--color-gold)', letterSpacing: '0.15em' }}
              >
                Amiről szívesen beszélgetek
              </h3>
              <ul className="space-y-3">
                {topics.map((t, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3"
                    style={{ color: '#9A9688', fontSize: '16px', lineHeight: 1.9 }}
                  >
                    <span style={{ color: 'rgba(201,169,110,0.45)', marginTop: '0.25rem', flexShrink: 0 }}>—</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="order-4 lg:col-start-2 lg:row-start-3 pt-2 lg:pt-0">
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
                Időpontot kérek
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
