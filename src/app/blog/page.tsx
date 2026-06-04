import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Blog / Gondolatok',
  description:
    'Gondolatok az önismeretről, kapcsolatokról, elakadásokról és az önmagunk felé fordulás útjáról.',
}

const FALLBACK_POSTS = [
  {
    slug: 'tul-keson-erkezik-a-kapcsolodas',
    date: '2026. június 4.',
    title: 'Túl későn érkezik a kapcsolódás',
    excerpt:
      'Van egy érzés, amit nehéz szavakba önteni. Elmondod, amit gondolsz – és semmi nem történik. Aztán valaki más mondja ugyanezt, és mindenki kapcsolódik. Ilyenkor nem az fáj, hogy nem értetek egyet. Az fáj, hogy túl későn érkezik a kapcsolódás.',
    readTime: '3 perc',
    category: 'Kapcsolatok',
    coverImage: '/blog-cover.png',
  },
  {
    slug: 'nem-valasztottak',
    date: '2025. május 12.',
    title: 'Mi történik bennünk, amikor nem minket választanak?',
    excerpt:
      'Az elutasítottság nem csupán pillanatnyi fájdalom. Belső mintákat aktivál, amelyek sokszor egész életünket meghatározzák. Mit tehetünk ezekkel a mintákkal?',
    readTime: '5 perc',
    category: 'Önismeret',
    coverImage: '/blog-cover.png',
  },
  {
    slug: 'onmagunk-fele',
    date: '2025. április 28.',
    title: 'Hogyan lehet elkezdeni önmagunk felé fordulni?',
    excerpt:
      'Az önismeret nem egy projekt, amit el kell végezni. Inkább egy kapcsolat – önmagunkkal. De hogyan kezdjük el ezt a kapcsolatot ápolni, különösen akkor, ha nem vagyunk hozzászokva?',
    readTime: '6 perc',
    category: 'Önfejlesztés',
    coverImage: '/blog-cover.png',
  },
  {
    slug: 'tanacsadas-vs-terapia',
    date: '2025. március 15.',
    title: 'Mi a különbség tanácsadás, terápia és önismereti beszélgetés között?',
    excerpt:
      'Sokan nem tudják pontosan, mire van szükségük. Ez a cikk segít eligazodni a különböző segítő formák között, hogy megtaláld a számodra legmegfelelőbbet.',
    readTime: '7 perc',
    category: 'Tájékoztató',
    coverImage: '/blog-cover.png',
  },
  {
    slug: 'mit-kell-mondani',
    date: '2025. február 20.',
    title: 'Miért nehéz kimondani, mire van szükségünk?',
    excerpt:
      'A szükségletek kimondása nem gyengeség – de sokunknak mégis annak érzi. Honnan ered ez az érzés, és hogyan lehet lassan oldani?',
    readTime: '5 perc',
    category: 'Kapcsolatok',
    coverImage: '/blog-cover.png',
  },
]

interface DisplayPost {
  slug: string
  date: string
  title: string
  excerpt: string
  readTime: string
  category: string
  coverImage: string
}

async function getPosts(): Promise<DisplayPost[]> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return FALLBACK_POSTS

    const res = await fetch(
      `${url}/rest/v1/posts?published=eq.true&select=slug,title,excerpt,category,read_time,created_at,cover_image&order=created_at.desc`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) return FALLBACK_POSTS

    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) return FALLBACK_POSTS

    return data.map(
      (p: {
        slug: string
        title: string
        excerpt: string
        category: string
        read_time: string
        created_at: string
        cover_image?: string
      }) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt ?? '',
        category: p.category ?? 'Önismeret',
        readTime: p.read_time ?? '5 perc',
        date: new Date(p.created_at).toLocaleDateString('hu-HU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        coverImage: p.cover_image || '/blog-cover.png',
      })
    )
  } catch {
    return FALLBACK_POSTS
  }
}

export default async function BlogPage() {
  const posts = await getPosts()

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
              style={{ color: '#C9A96E', letterSpacing: '0.15em' }}
            >
              Gondolatok
            </span>
            <h1
              className="font-serif mb-6"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                fontWeight: 300,
                lineHeight: 1.15,
                color: '#F0EDE5',
              }}
            >
              Blog
            </h1>
            <p className="mx-auto" style={{ color: '#9A9688', maxWidth: '440px', lineHeight: 1.8 }}>
              Reflexiók, gondolatok és írások az önismeretről, kapcsolatokról
              és az önmagunk felé fordulás útjáról.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Posts */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {posts.map((post, i) => (
              <AnimatedSection key={post.slug} delay={i * 80}>
                <Link href={`/blog/${post.slug}`} className="block group" style={{ outline: 'none' }}>
                  <article
                    className="transition-all duration-300"
                    style={{ backgroundColor: '#0a0a0a', border: 0, outline: 'none', boxShadow: 'none' }}
                  >
                    <div
                      className="relative w-full overflow-hidden"
                      style={{ aspectRatio: '16 / 9', backgroundColor: '#0a0a0a' }}
                    >
                      <Image
                        src={post.coverImage}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 896px) 100vw, 896px"
                        style={{ display: 'block' }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background: 'linear-gradient(to bottom, transparent 35%, rgba(10,10,10,0.75) 70%, rgba(10,10,10,0.95) 100%)',
                        }}
                      />
                      <div className="absolute inset-0 flex items-end justify-end" style={{ padding: '1.25rem' }}>
                        <h2
                          className="font-serif transition-colors duration-200"
                          style={{
                            fontSize: 'clamp(1.05rem, 2.5vw, 1.35rem)',
                            fontWeight: 400,
                            color: '#F0EDE5',
                            lineHeight: 1.3,
                            textAlign: 'right',
                            maxWidth: '60%',
                          }}
                        >
                          {post.title}
                        </h2>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-3">
                        <span
                          className="text-xs px-3 py-1"
                          style={{
                            border: '1px solid rgba(201,169,110,0.15)',
                            color: '#C9A96E',
                            backgroundColor: 'rgba(201,169,110,0.04)',
                          }}
                        >
                          {post.category}
                        </span>
                        <span className="text-xs" style={{ color: '#5A5850' }}>
                          {post.date} · {post.readTime}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed mb-4" style={{ color: '#9A9688', lineHeight: 1.8 }}>
                        {post.excerpt}
                      </p>
                      <span
                        className="text-xs tracking-wider"
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
    </div>
  )
}
