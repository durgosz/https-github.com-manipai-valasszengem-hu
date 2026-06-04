import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie tájékoztató',
  description: 'A válassz engem weboldal sütihasználatáról szóló tájékoztató.',
}

export default function CookiePage() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', paddingTop: '5rem' }}>
      <section className="section-padding px-6">
        <div className="max-w-2xl mx-auto">
          <div
            className="w-12 mb-8"
            style={{ height: '1px', backgroundColor: 'rgba(201,169,110,0.3)' }}
          />
          <h1
            className="font-serif mb-10"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 300,
              color: '#F0EDE5',
              lineHeight: 1.2,
            }}
          >
            Cookie (süti) tájékoztató
          </h1>

          <div className="space-y-10 text-sm leading-relaxed" style={{ color: '#9A9688', lineHeight: 1.9 }}>
            <section>
              <h2 className="font-serif text-lg mb-4" style={{ color: '#F0EDE5', fontWeight: 400 }}>
                Mi az a süti (cookie)?
              </h2>
              <p>
                A sütik kis adatfájlok, amelyeket a weboldal helyez el a számítógépeden vagy mobileszközödön
                az oldal meglátogatásakor. Segítenek az oldal működésében, személyre szabott élményt nyújtanak,
                és információt gyűjtenek az oldal látogatásáról.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-lg mb-4" style={{ color: '#F0EDE5', fontWeight: 400 }}>
                Milyen sütiket használunk?
              </h2>
              <div className="space-y-4">
                {[
                  {
                    nev: 'Feltétlenül szükséges sütik',
                    leiras: 'Az oldal alapvető működéséhez szükséges sütik. Ezek nélkül az oldal nem tud megfelelően működni. Nem igényelnek hozzájárulást.',
                    peldak: 'Munkamenet-süti, cookie-hozzájárulás státusza',
                  },
                  {
                    nev: 'Analitikai sütik',
                    leiras: 'Segítenek megérteni, hogyan használják a látogatók az oldalt. Az adatokat anonim vagy összesített formában kezeljük. Csak hozzájárulás esetén aktívak.',
                    peldak: 'Google Analytics (_ga, _gid)',
                  },
                  {
                    nev: 'Marketing sütik',
                    leiras: 'Célzott hirdetések megjelenítéséhez használhatók. Csak hozzájárulás esetén kerülnek elhelyezésre.',
                    peldak: 'Meta Pixel (_fbp)',
                  },
                ].map((s) => (
                  <div
                    key={s.nev}
                    className="p-5"
                    style={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <strong style={{ color: '#D0CCC0', display: 'block', marginBottom: '6px' }}>{s.nev}</strong>
                    <p className="mb-2">{s.leiras}</p>
                    <p className="text-xs" style={{ color: '#5A5850' }}>Példák: {s.peldak}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-serif text-lg mb-4" style={{ color: '#F0EDE5', fontWeight: 400 }}>
                Hogyan kezeled a süti-beállításokat?
              </h2>
              <p className="mb-3">
                Az oldal első látogatásakor egy cookie-banner jelenik meg, ahol megadhatod vagy megtagadhatod
                a hozzájárulást. A beállítások bármikor módosíthatók:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span style={{ color: 'rgba(201,169,110,0.4)', flexShrink: 0 }}>–</span>
                  A böngésződ beállításaiban törölheted vagy letilthatod a sütiket
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'rgba(201,169,110,0.4)', flexShrink: 0 }}>–</span>
                  Az oldal alján lévő &quot;Cookie beállítások&quot; linkre kattintva visszavonhatod a hozzájárulást
                </li>
              </ul>
              <p className="mt-3">
                Figyelem: ha letiltod az összes sütit, az oldal egyes funkciói nem fognak megfelelően működni.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-lg mb-4" style={{ color: '#F0EDE5', fontWeight: 400 }}>
                Harmadik felek sütijei
              </h2>
              <p>
                Egyes sütik harmadik fél szolgáltatóktól (pl. Google, Meta) származnak. Ezek a szolgáltatók
                saját adatkezelési szabályzataik szerint járnak el. Ajánljuk, hogy ismerkedj meg ezek feltételeivel is.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-lg mb-4" style={{ color: '#F0EDE5', fontWeight: 400 }}>
                Kapcsolat
              </h2>
              <p>
                Ha kérdésed van a sütik használatával kapcsolatban, keress minket az info@valasszengem.hu
                e-mail-címen.
              </p>
              <p className="mt-3 text-xs" style={{ color: '#5A5850' }}>
                Jelen tájékoztató legutóbb 2025. június 1-jén frissült.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
