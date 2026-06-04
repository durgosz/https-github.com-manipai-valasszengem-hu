import AnimatedSection from '@/components/ui/AnimatedSection'
import CalEmbed from '@/components/CalEmbed'
import { Shield, Video } from 'lucide-react'

const calLink = process.env.NEXT_PUBLIC_CAL_LINK ?? 'valasszengem/egyeztetes'

export default function CalSection() {
  return (
    <section
      className="section-padding px-6 relative overflow-hidden"
      style={{ backgroundColor: '#0d0d0d' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,169,110,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span
              className="text-xs tracking-widest uppercase block mb-4"
              style={{ color: '#C9A96E', letterSpacing: '0.15em' }}
            >
              Időpontfoglalás
            </span>
            <h2
              className="font-serif mb-4"
              style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                fontWeight: 300,
                color: '#F0EDE5',
                lineHeight: 1.2,
              }}
            >
              Foglalj időpontot közvetlenül
            </h2>
            <p
              className="mx-auto mb-8"
              style={{ color: '#9A9688', maxWidth: '440px', lineHeight: 1.8 }}
            >
              Az első egyeztetés díjmentes és kötelezettségmentes. Válassz egy
              neked megfelelő időpontot az alábbi naptárból.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 text-xs tracking-wider"
                style={{
                  border: '1px solid rgba(201,169,110,0.15)',
                  color: '#9A9688',
                  backgroundColor: 'rgba(201,169,110,0.03)',
                }}
              >
                <Shield size={11} style={{ color: '#C9A96E' }} />
                Biztonságos és bizalmas
              </div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 text-xs tracking-wider"
                style={{
                  border: '1px solid rgba(201,169,110,0.15)',
                  color: '#9A9688',
                  backgroundColor: 'rgba(201,169,110,0.03)',
                }}
              >
                <Video size={11} style={{ color: '#C9A96E' }} />
                Google Meet – automatikus link
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Cal.com embed */}
        <AnimatedSection delay={100}>
          <div
            style={{
              border: '1px solid rgba(201,169,110,0.1)',
              backgroundColor: '#111111',
              overflow: 'hidden',
            }}
          >
            <CalEmbed calLink={calLink} elementId="cal-home" height={540} />
          </div>
        </AnimatedSection>

        <AnimatedSection delay={150}>
          <p
            className="text-center mt-6 text-xs"
            style={{ color: '#5A5850', lineHeight: 1.7 }}
          >
            Ha nem találsz megfelelő időpontot, írj nekünk:{' '}
            <a
              href="mailto:hello@valasszengem.hu"
              className="transition-colors"
              style={{ color: '#C9A96E' }}
            >
              hello@valasszengem.hu
            </a>
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
