import AnimatedSection from '@/components/ui/AnimatedSection'

const testimonials = [
  {
    quote:
      'Először életemben éreztem, hogy valaki tényleg ott van velem, nem csak válaszokat keres. Ez az ülés sokat változtatott azon, ahogyan magamra nézek.',
    name: 'K. M.',
    role: 'Visszatérő vendég',
  },
  {
    quote:
      'Nem gondoltam, hogy ilyen gyorsan meg tudjuk fogni azt, ami évek óta foglalkoztat. A biztonságos légkör tette lehetővé, hogy valóban nyílt legyek.',
    name: 'Sz. A.',
    role: 'Online konzultáció',
  },
  {
    quote:
      'Az első találkozó után azt éreztem, hogy valami megmozdult bennem. Nem drámaian – inkább csendesen, de valósan.',
    name: 'B. R.',
    role: 'Személyes ülés',
  },
]

export default function Testimonials() {
  return (
    <section className="section-padding px-6" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-14">
            <span
              className="text-xs tracking-widest uppercase block mb-4"
              style={{ color: '#C9A96E', letterSpacing: '0.15em' }}
            >
              Visszajelzések
            </span>
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                fontWeight: 400,
                color: '#F0EDE5',
              }}
            >
              Amit mások mondanak
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <AnimatedSection key={i} delay={i * 100}>
              <div
                className="p-8 flex flex-col gap-6 h-full"
                style={{
                  border: '1px solid rgba(201,169,110,0.08)',
                  backgroundColor: '#111111',
                }}
              >
                {/* Quote mark */}
                <span
                  className="font-serif text-5xl leading-none"
                  style={{ color: 'rgba(201,169,110,0.15)', fontWeight: 300 }}
                >
                  &quot;
                </span>
                <p
                  className="font-serif flex-1 leading-relaxed"
                  style={{
                    color: '#9A9688',
                    fontStyle: 'italic',
                    lineHeight: 1.7,
                    fontSize: '1.05rem',
                  }}
                >
                  {t.quote}
                </p>
                <div style={{ borderTop: '1px solid rgba(201,169,110,0.08)', paddingTop: '1.25rem' }}>
                  <p className="text-sm font-medium" style={{ color: '#C9A96E' }}>
                    {t.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#5A5850' }}>
                    {t.role}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={200}>
          <p
            className="text-center mt-8 text-xs"
            style={{ color: '#3A3A32', letterSpacing: '0.05em' }}
          >
            * Az idézetek anonimizáltak és hozzájárulással kerülnek közzétételre.
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
