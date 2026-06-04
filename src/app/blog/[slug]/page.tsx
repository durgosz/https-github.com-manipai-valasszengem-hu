import type { Metadata } from 'next'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

// --- Hardcoded fallback posts ---
const HARDCODED_POSTS: Record<string, {
  title: string
  date: string
  readTime: string
  category: string
  content: React.ReactNode[]
}> = {
  'nem-valasztottak': {
    title: 'Mi történik bennünk, amikor nem minket választanak?',
    date: '2025. május 12.',
    readTime: '5 perc',
    category: 'Önismeret',
    content: [
      'Az elutasítottság érzése – amikor nem minket választanak párnak, munkára, barátságra, vagy bármire, amire vágytunk – nem csupán pillanatnyi fájdalom. Belső mechanizmusokat indít el, amelyek sokszor egész életünket meghatározzák.',
      'Amikor nem minket választanak, az agy elsősorban veszélyként értelmezi ezt az eseményt. Aktiválódik a fenyegetésérzés, és a belső hang – sokszor automatikusan – azonnal keresi a magyarázatot: „Nem voltam elég jó." „Valami hiányzik belőlem." „Soha nem lesz másképp."',
      'Ezek a mondatok nem igazak. De attól, hogy tudjuk ezt, még nem szűnnek meg hatni ránk.',
      'A kérdés nem az, hogy hogyan kerüljük el az elutasítottság érzését – az elkerülhetetlen. A kérdés az: mit kezdünk ezekkel az érzésekkel, amikor megjelennek? Hagyunk-e teret arra, hogy valóban megértsük, mit váltottak ki bennünk?',
      'Az önismeret egyik legfontosabb munkája éppen ez: hogy ne az automatikus magyarázatainkat higgyük el, hanem tegyük fel a kérdést: mi ez az érzés valójában? Kire emlékeztet? Milyen régebbi helyzeteket idéz fel?',
      'Ha ezt a kérdést meg merjük nézni – nem a fájdalom tagadásával, hanem a kíváncsiság szellemével – akkor az elutasítottság nem csupán seb lesz, hanem egy kapu. Egy lehetőség arra, hogy mélyebben megismerjük magunkat.',
    ],
  },
  'onmagunk-fele': {
    title: 'Hogyan lehet elkezdeni önmagunk felé fordulni?',
    date: '2025. április 28.',
    readTime: '6 perc',
    category: 'Önfejlesztés',
    content: [
      'Az önismeret szó sokakban valami nagy, nehéz feladatot idéz fel. Mintha egy hegycsúcs tetején állnánk, és kellene felmásznunk, mielőtt „készen" vagyunk.',
      'De az önismeret valójában nem egy projekt. Inkább egy kapcsolat – önmagunkkal. Ahogy minden kapcsolat, ez is apró, folyamatos gesztusokból épül fel.',
      'Az önmagunk felé fordulás kezdete lehet valami nagyon egyszerű: szándékosan megkérdezni magunktól, hogyan vagyunk valójában. Nem a szokásos „jól" válasszal, hanem kicsit hosszabb lélegzettel. Mi van most bennem? Mit érzek? Mi foglalkoztat?',
      'Ez a kérdés első ránézésre aprónak tűnik. De a valóságban egy radikális gesztus: azt állítja, hogy a belső életünk számít. Hogy érdemes figyelni rá.',
      'Az önismeret nem arról szól, hogy minden problémát megoldjunk, minden félelmünket leküzdjük. Inkább arról, hogy egyre pontosabban tudjuk: ki vagyok, mit akarok, mi van bennem most?',
      'Ha valaha is azt érzed, hogy elveszted a fonalat önmagaddal kapcsolatban – ez természetes. Nem azért, mert valami hibás benned, hanem azért, mert a világ zajában könnyen elfelejtjük, hogy lassítsunk és figyeljünk.',
    ],
  },
  'tanacsadas-vs-terapia': {
    title: 'Mi a különbség tanácsadás, terápia és önismereti beszélgetés között?',
    date: '2025. március 15.',
    readTime: '7 perc',
    category: 'Tájékoztató',
    content: [
      'Ha valaha is eltűnődtél azon, hogy „pszichológushoz kellene mennem, terapeutához, vagy inkább coachhoz?" – nem vagy egyedül. Ez a kérdés sokakban felmerül, és nem könnyű eligazodni.',
      'A pszichoterápia egy klinikai folyamat, amelyet engedéllyel rendelkező pszichoterapeuta vezet. Mélyebb pszichológiai problémákat, traumákat, mentális zavarokat kezel – és szigorú szakmai-etikai keretek között zajlik.',
      'A tanácsadás (coaching) általában konkrét célokra fókuszál: hogyan hozzak jobb döntéseket, hogyan fejlesszem magamat egy adott területen? Inkább jövőorientált és megoldásfókuszú.',
      'Az önismereti beszélgetés – amit én is kínálok – más természetű. Nem diagnózis, nem terápia, nem célkitűző folyamat. Inkább egy reflektív tér, ahol az ember saját belső működésére lesz kíváncsi. Nem „mit kellene tennem?" – hanem „mi zajlik bennem?"',
      'A három forma nem versenyez egymással. Sokszor kiegészítik egymást. Van, akinek először egy önismereti beszélgetés kell, mielőtt eldönti, hogy terápiás segítséget szeretne. Van, aki mellett mindkettő egyszerre zajlik.',
      'Ha bizonytalan vagy, hogy neked mi a legjobb, az első egyeztetésen szívesen segítek eligazodni. Ha azt látom, hogy terápiára lenne szükséged, nem fogom ezt titkolni – és segítek megtalálni a megfelelő szakembert.',
    ],
  },
  'mit-kell-mondani': {
    title: 'Miért nehéz kimondani, mire van szükségünk?',
    date: '2025. február 20.',
    readTime: '5 perc',
    category: 'Kapcsolatok',
    content: [
      'Sok embernek komoly belső erőfeszítésébe kerül kimondani: „Erre van szükségem." Ez nem gyengeség – de sokunknak mégis annak érzi.',
      'Honnan ered ez? A legtöbb esetben régi tapasztalatokból. Ha gyerekkorunkban megtanultuk, hogy a szükségleteink terhek másoknak, hogy azok kimondása konfliktust szül, vagy hogy úgysem kapjuk meg – ezek az üzenetek beépülnek a belső rendszerünkbe.',
      'Felnőtt korban ez úgy jelenik meg, hogy inkább elvárjuk, hogy mások kitalálják. Vagy elviseljük csendben. Vagy annyira körülírjuk a kérésünket, hogy elvész maga a lényeg.',
      'A szükségletek kimondása nem azt jelenti, hogy mindig megkapjuk, amit szeretnénk. De azt jelenti, hogy komolyan vesszük, ami bennünk van. Hogy mi is érdemes vagyunk arra, hogy halljanak minket.',
      'Ez az út apró lépésekből áll. Nem kell azonnal mindent kimondani, mindenkinek. Először elég, ha magunkban elismerjük: van, amire szükségem van. Ez is előrelépés.',
    ],
  },
  'tul-keson-erkezik-a-kapcsolodas': {
    title: 'Túl későn érkezik a kapcsolódás',
    date: '2026. június 4.',
    readTime: '3 perc',
    category: 'Kapcsolatok',
    content: [
      'Van egy érzés, amit nehéz szavakba önteni.',
      'Mondasz valamit. Elmondod, amit gondolsz, amit érzel, amit látsz. És semmi nem történik. Aztán két körrel később valaki más mondja ugyanezt – és mindenki bólint, mindenki kapcsolódik.',
      <>Ilyenkor nem az fáj, hogy nem értetek egyet velem. Az fáj, hogy <em>„túl későn érkezik a kapcsolódás."</em></>,
      'Sokszor töprengtem ezen. Hogy miért van ez így. Hogy talán túl korán hozom be a dolgokat. Hogy talán másképp kellene mondani. Hogy talán én látok valamit, amit mások még nem látnak – vagy talán én vagyok a hülye gyerek, aki nem tudja, mikor kell szólni.',
      'De aztán rájöttem, hogy ez nem erről szól. Ez arról szól, hogy szeretnék látható lenni. Nem úgy, hogy sajnáljanak. Hanem úgy, hogy amikor megszólalok, ott legyen valaki, aki kapcsolódik. Aki hallja. Aki marad.',
      <span key="highlight" style={{ fontSize: '1.4rem', color: '#C9A96E', fontWeight: 400, display: 'block', lineHeight: 1.7 }}>Vegyél észre. Válassz engem. Maradj velem.</span>,
      'Ez a három mondat nem gyerekes vágy. Ez az alapszükséglet, ami ott van mindannyiunkban – csak különböző mélységben van eltemetve. Nálam mélyen van.',
      'És amikor újra és újra azt tapasztalom, hogy a kapcsolódás késik – valami csendesen feladja. Egy belső hang azt mondja: úgysem fogják megérteni. Úgysem fogják hallani.',
      'Ez a hang hazudik. De néha nagyon meggyőző.',
    ],
  },
}

// --- Supabase post lookup ---
async function getSupabasePost(slug: string) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return null

    const res = await fetch(
      `${url}/rest/v1/posts?slug=eq.${encodeURIComponent(slug)}&published=eq.true&select=*&limit=1`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: 'no-store',
      }
    )

    if (!res.ok) return null
    const data = await res.json()
    return Array.isArray(data) && data.length > 0 ? data[0] : null
  } catch {
    return null
  }
}

// --- Page ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabasePost = await getSupabasePost(slug)

  if (supabasePost) {
    return {
      title: supabasePost.title,
      description: supabasePost.excerpt || supabasePost.content?.slice(0, 160),
      alternates: { canonical: `https://valasszengem.hu/blog/${slug}` },
    }
  }

  const post = HARDCODED_POSTS[slug]
  if (!post) return {}
  return {
    title: post.title,
    description: post.content[0] as string,
    alternates: { canonical: `https://valasszengem.hu/blog/${slug}` },
  }
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Try Supabase first
  const supabasePost = await getSupabasePost(slug)

  if (supabasePost) {
    const paragraphs = (supabasePost.content as string)
      .split(/\n\n+/)
      .map((p: string) => p.trim())
      .filter(Boolean)

    return (
      <BlogPostLayout
        title={supabasePost.title}
        date={new Date(supabasePost.created_at).toLocaleDateString('hu-HU', {
          year: 'numeric', month: 'long', day: 'numeric',
        })}
        readTime={supabasePost.read_time ?? '5 perc'}
        category={supabasePost.category ?? 'Önismeret'}
        coverImage={supabasePost.cover_image || '/blog-cover.png'}
        slug={slug}
      >
        {paragraphs.map((p: string, i: number) => (
          <p
            key={i}
            className="leading-relaxed"
            style={{ color: i === 0 ? '#D0CCC0' : '#9A9688', lineHeight: 1.9, fontSize: '1.05rem' }}
          >
            {p}
          </p>
        ))}
      </BlogPostLayout>
    )
  }

  // Fall back to hardcoded
  const post = HARDCODED_POSTS[slug]
  if (!post) notFound()

  return (
    <BlogPostLayout
      title={post.title}
      date={post.date}
      readTime={post.readTime}
      category={post.category}
      coverImage="/blog-cover.png"
      slug={slug}
    >
      {post.content.map((paragraph, i) => (
        <p
          key={i}
          className="leading-relaxed"
          style={{ color: i === 0 ? '#D0CCC0' : '#9A9688', lineHeight: 1.9, fontSize: '1.05rem' }}
        >
          {paragraph}
        </p>
      ))}
    </BlogPostLayout>
  )
}

function BlogPostLayout({
  title,
  date,
  readTime,
  category,
  coverImage,
  slug,
  children,
}: {
  title: string
  date: string
  readTime: string
  category: string
  coverImage: string
  slug: string
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    author: { '@type': 'Person', name: 'válassz engem' },
    publisher: { '@type': 'Organization', name: 'válassz engem', url: 'https://valasszengem.hu' },
    url: `https://valasszengem.hu/blog/${slug}`,
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', paddingTop: '5rem' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="section-padding px-6 relative overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full pointer-events-none"
          style={{
            height: '400px',
            background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(201,169,110,0.07) 0%, transparent 70%)',
          }}
        />
        <div className="max-w-2xl mx-auto relative z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs tracking-wider mb-8 transition-colors"
            style={{ color: '#5A5850', letterSpacing: '0.08em' }}
          >
            ← Vissza a blogra
          </Link>

          <div
            className="relative w-full overflow-hidden mb-8"
            style={{ aspectRatio: '16 / 9', backgroundColor: '#0a0a0a' }}
          >
            <Image
              src={coverImage}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="(max-width: 672px) 100vw, 672px"
              style={{ display: 'block' }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, transparent 30%, rgba(10,10,10,0.70) 65%, rgba(10,10,10,0.92) 100%)',
              }}
            />
            <div className="absolute inset-0 flex flex-col justify-end items-end" style={{ padding: '2rem' }}>
              <h1
                className="font-serif"
                style={{
                  fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
                  fontWeight: 300,
                  lineHeight: 1.2,
                  color: '#F0EDE5',
                  textAlign: 'right',
                  maxWidth: '65%',
                }}
              >
                {title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <span
              className="text-xs px-3 py-1"
              style={{
                border: '1px solid rgba(201,169,110,0.15)',
                color: '#C9A96E',
                backgroundColor: 'rgba(201,169,110,0.04)',
              }}
            >
              {category}
            </span>
            <span className="text-xs" style={{ color: '#5A5850' }}>
              {date} · {readTime}
            </span>
          </div>

          <div className="w-12 mb-10" style={{ height: '1px', backgroundColor: 'rgba(201,169,110,0.3)' }} />

          <div className="space-y-6">{children}</div>

          <div
            className="mt-16 p-8 text-center"
            style={{ border: '1px solid rgba(201,169,110,0.1)', backgroundColor: 'rgba(201,169,110,0.02)' }}
          >
            <p
              className="font-serif text-lg mb-2"
              style={{ color: '#F0EDE5', fontWeight: 300, fontStyle: 'italic' }}
            >
              Rezonál benned, amit olvastál?
            </p>
            <p className="text-sm mb-6" style={{ color: '#9A9688' }}>
              Az első egyeztetés díjmentes és kötelezettségmentes.
            </p>
            <Link
              href="/kapcsolat"
              className="inline-block px-8 py-3.5 text-sm tracking-wider"
              style={{ backgroundColor: '#C9A96E', color: '#0a0a0a', fontWeight: 500, letterSpacing: '0.08em' }}
            >
              Felveszem a kapcsolatot
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
