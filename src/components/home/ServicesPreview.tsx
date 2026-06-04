import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { MessageCircle, Network, Compass, Sparkles, Star, Heart } from 'lucide-react'

const services = [
  {
    icon: MessageCircle,
    title: 'Egyéni önismereti beszélgetés',
    description:
      'Személyes, reflektív tér, ahol az önismereted mélyebb rétegeibe tekinthetsz be. Saját tempódban, ítéletmentesen.',
  },
  {
    icon: Network,
    title: 'Kapcsolati minták feltérképezése',
    description:
      'Megvizsgáljuk, milyen ismétlődő mintázatok jelennek meg a kapcsolataidban, és hogyan formálják a döntéseidet.',
  },
  {
    icon: Compass,
    title: 'Elakadás és döntési helyzetek',
    description:
      'Ha úgy érzed, körbe-körbe jársz, vagy nem találod a kiutat – együtt nézünk rá, mi tart vissza.',
  },
  {
    icon: Sparkles,
    title: 'Belső erőforrások felismerése',
    description:
      'Megkeressük azokat az erőket, amelyek már benned vannak, csak talán nem látod őket még tisztán.',
  },
  {
    icon: Star,
    title: 'Önbizalom és önértékelés',
    description:
      'Hogy jobban megértsd, hogyan látod magadat – és miért látod esetleg másképpen, mint amilyen valójában vagy.',
  },
  {
    icon: Heart,
    title: 'Választottság és megfelelés témái',
    description:
      'Ki vagyok én, ha nem engem választanak? Az elutasítottság, a megfelelésvágy és a belső érték kérdései.',
  },
]

export default function ServicesPreview() {
  return (
    <section className="section-padding px-6" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <span
              className="text-xs tracking-widest uppercase block mb-4"
              style={{ color: '#C9A96E', letterSpacing: '0.15em' }}
            >
              Miben segíthetek
            </span>
            <h2
              className="font-serif mx-auto"
              style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                fontWeight: 400,
                color: '#F0EDE5',
                maxWidth: '500px',
                lineHeight: 1.25,
              }}
            >
              Témák, amelyekkel dolgozhatunk
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ border: '1px solid rgba(201,169,110,0.06)', backgroundColor: 'rgba(201,169,110,0.06)' }}>
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <AnimatedSection key={service.title} delay={i * 80}>
                <div
                  className="p-8 h-full flex flex-col gap-4 group transition-colors duration-300"
                  style={{ backgroundColor: '#0a0a0a' }}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center transition-all duration-300"
                    style={{
                      border: '1px solid rgba(201,169,110,0.2)',
                      backgroundColor: 'rgba(201,169,110,0.04)',
                    }}
                  >
                    <Icon size={18} style={{ color: '#C9A96E' }} />
                  </div>
                  <h3
                    className="font-serif text-lg"
                    style={{ fontWeight: 400, color: '#F0EDE5', lineHeight: 1.3 }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-sm flex-1 leading-relaxed" style={{ color: '#5A5850', lineHeight: 1.75 }}>
                    {service.description}
                  </p>
                </div>
              </AnimatedSection>
            )
          })}
        </div>

        <AnimatedSection delay={200}>
          <div className="text-center mt-12">
            <Link
              href="/szolgaltatasok"
              className="inline-block px-8 py-3.5 text-sm tracking-wider transition-all duration-300"
              style={{
                border: '1px solid rgba(201,169,110,0.3)',
                color: '#C9A96E',
                letterSpacing: '0.08em',
              }}
            >
              Összes szolgáltatás
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
