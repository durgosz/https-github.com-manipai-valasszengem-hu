import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function AboutPreview({ text }: { text?: string }) {
  return (
    <section
      className="section-padding px-6"
      style={{ backgroundColor: '#0d0d0d' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image placeholder */}
          <AnimatedSection>
            <div
              className="relative aspect-[3/4] max-w-sm mx-auto lg:mx-0"
              style={{
                backgroundColor: '#141414',
              }}
            >
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                style={{ color: '#2a2a2a' }}
              >
                <svg width="60" height="80" viewBox="0 0 60 80" fill="none">
                  <circle cx="30" cy="22" r="16" stroke="#2a2a2a" strokeWidth="0.8" />
                  <path d="M10 75 Q15 55 30 52 Q45 55 50 75" stroke="#2a2a2a" strokeWidth="0.8" fill="none" />
                </svg>
                <span className="text-xs tracking-widest" style={{ letterSpacing: '0.12em', color: '#2a2a2a' }}>
                  PROFILFOTÓ
                </span>
              </div>
              {/* Gold corner accent */}
              <div
                className="absolute top-0 left-0 w-8 h-8"
                style={{
                  borderTop: '1px solid rgba(201,169,110,0.4)',
                  borderLeft: '1px solid rgba(201,169,110,0.4)',
                }}
              />
              <div
                className="absolute bottom-0 right-0 w-8 h-8"
                style={{
                  borderBottom: '1px solid rgba(201,169,110,0.4)',
                  borderRight: '1px solid rgba(201,169,110,0.4)',
                }}
              />
            </div>
          </AnimatedSection>

          {/* Text */}
          <AnimatedSection delay={150}>
            <div>
              <span
                className="text-xs tracking-widest uppercase block mb-6"
                style={{ color: '#C9A96E', letterSpacing: '0.15em' }}
              >
                Rólam
              </span>
              <h2
                className="font-serif mb-6"
                style={{
                  fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                  fontWeight: 400,
                  lineHeight: 1.25,
                  color: '#F0EDE5',
                }}
              >
                Egy biztonságos tér,<br />ahol te lehetsz a fókusz
              </h2>
              <div
                className="w-12 mb-8"
                style={{ height: '1px', backgroundColor: 'rgba(201,169,110,0.4)' }}
              />
              {text ? (
                <p className="leading-relaxed mb-8" style={{ color: '#9A9688', lineHeight: 1.8 }}>
                  {text}
                </p>
              ) : (
                <>
                  <p className="leading-relaxed mb-4" style={{ color: '#9A9688', lineHeight: 1.8 }}>
                    Önismereti és mentálhigiénés szemléletű munkámban arra törekszem,
                    hogy biztonságos, ítéletmentes teret teremtsek. Olyan helyet, ahol
                    valóban felmerülhetnek az igazi kérdések.
                  </p>
                  <p className="leading-relaxed mb-8" style={{ color: '#9A9688', lineHeight: 1.8 }}>
                    Nem tanácsokat adok, hanem kísérlek. Nem megoldom a problémáidat,
                    hanem segítek, hogy te találd meg a saját válaszaidat.
                  </p>
                </>
              )}
              <Link
                href="/rolam"
                className="inline-flex items-center gap-2 text-sm tracking-wider transition-colors duration-300"
                style={{ color: '#C9A96E', letterSpacing: '0.08em' }}
              >
                Megismerem jobban
                <span style={{ color: 'rgba(201,169,110,0.5)' }}>→</span>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
