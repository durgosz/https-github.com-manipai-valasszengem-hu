import Link from 'next/link'
import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'

const posts = [
  {
    slug: 'nem-valasztottak',
    date: '2025. május',
    title: 'Mi történik bennünk, amikor nem minket választanak?',
    excerpt:
      'Az elutasítottság nem csupán pillanatnyi fájdalom. Belső mintákat aktivál, amelyek sokszor egész életünket meghatározzák. De mit tehetünk velük?',
    readTime: '5 perc',
  },
  {
    slug: 'onmagunk-fele',
    date: '2025. április',
    title: 'Hogyan lehet elkezdeni önmagunk felé fordulni?',
    excerpt:
      'Az önismeret nem egy projekt, amit el kell végezni. Inkább egy kapcsolat – önmagunkkal. De hogyan kezdjük el ezt a kapcsolatot ápolni?',
    readTime: '6 perc',
  },
  {
    slug: 'tanacssadas-vs-terapia',
    date: '2025. március',
    title: 'Mi a különbség tanácsadás, terápia és önismereti beszélgetés között?',
    excerpt:
      'Sokan nem tudják pontosan, mire van szükségük. Ez a cikk segít eligazodni a különböző segítő formák között.',
    readTime: '7 perc',
  },
]

export default function BlogPreview() {
  return (
    <section className="section-padding px-6" style={{ backgroundColor: '#0d0d0d' }}>
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14">
            <div>
              <span
                className="text-xs tracking-widest uppercase block mb-4"
                style={{ color: '#C9A96E', letterSpacing: '0.15em' }}
              >
                Gondolatok
              </span>
              <h2
                className="font-serif"
                style={{
                  fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                  fontWeight: 400,
                  color: '#F0EDE5',
                }}
              >
                Blog és reflexiók
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-sm tracking-wider transition-colors shrink-0"
              style={{ color: '#C9A96E', letterSpacing: '0.08em' }}
            >
              Összes bejegyzés →
            </Link>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <AnimatedSection key={post.slug} delay={i * 100}>
              <Link href={`/blog/${post.slug}`} className="block group h-full">
                <article
                  className="h-full flex flex-col transition-all duration-300 overflow-hidden"
                  style={{
                    backgroundColor: '#0f0f0f',
                  }}
                >
                  {/* Image area */}
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src="/blog-cover.png"
                      alt=""
                      fill
                      className="object-cover"
                      style={{ border: 'none', outline: 'none' }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(to bottom, rgba(15,15,15,0.6) 0%, transparent 22%, transparent 45%, rgba(15,15,15,0.92) 78%, rgba(15,15,15,1) 100%)',
                      }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(to right, rgba(15,15,15,1) 0%, rgba(15,15,15,0.6) 6%, transparent 18%, transparent 82%, rgba(15,15,15,0.6) 94%, rgba(15,15,15,1) 100%)',
                      }}
                    />
                    <div className="absolute inset-0 flex items-end px-5 pb-4">
                      <span className="text-xs" style={{ color: 'rgba(240,237,229,0.4)' }}>
                        {post.date} · {post.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col gap-3 flex-1">
                    <h3
                      className="font-serif leading-snug transition-colors duration-200 group-hover:text-gold"
                      style={{ color: '#F0EDE5', fontWeight: 400, fontSize: '1.1rem', lineHeight: 1.35 }}
                    >
                      {post.title}
                    </h3>
                    <p className="text-sm leading-relaxed flex-1" style={{ color: '#5A5850', lineHeight: 1.75 }}>
                      {post.excerpt}
                    </p>
                    <span
                      className="text-xs tracking-wider transition-colors duration-200 mt-2"
                      style={{ color: 'rgba(201,169,110,0.6)', letterSpacing: '0.08em' }}
                    >
                      Olvasás →
                    </span>
                  </div>
                </article>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
