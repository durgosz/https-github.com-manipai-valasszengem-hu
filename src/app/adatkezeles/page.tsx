import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Adatkezelési tájékoztató',
  description: 'A válassz engem weboldal adatkezelési tájékoztatója – GDPR kompatibilis.',
}

export default function AdatkezelesPage() {
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
            Adatkezelési tájékoztató
          </h1>

          <div className="space-y-10 text-sm leading-relaxed" style={{ color: '#9A9688', lineHeight: 1.9 }}>
            <section>
              <h2 className="font-serif text-lg mb-4" style={{ color: '#F0EDE5', fontWeight: 400 }}>
                1. Az adatkezelő adatai
              </h2>
              <p>
                <strong style={{ color: '#D0CCC0' }}>Weboldal:</strong> válassz engem (valasszengem.hu)<br />
                <strong style={{ color: '#D0CCC0' }}>Kapcsolat:</strong> hello@valasszengem.hu<br />
                <strong style={{ color: '#D0CCC0' }}>Tevékenység:</strong> Önismereti és mentálhigiénés szemléletű beszélgetések nyújtása
              </p>
            </section>

            <section>
              <h2 className="font-serif text-lg mb-4" style={{ color: '#F0EDE5', fontWeight: 400 }}>
                2. A kezelt adatok köre és célja
              </h2>
              <p className="mb-4">
                A következő személyes adatokat kezeljük és az alábbi célokból:
              </p>
              <ul className="space-y-3">
                {[
                  ['Kapcsolatfelvételi forma adatai', 'Név, e-mail cím, telefonszám, üzenet', 'Visszajelzés és időpontegyeztetés'],
                  ['Süti (cookie) adatok', 'Munkamenet-sütik, analitikai sütik', 'Az oldal működtetése és látogatottság mérése'],
                ].map(([tipus, adatok, cel]) => (
                  <li key={tipus} className="p-4" style={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <strong style={{ color: '#D0CCC0', display: 'block', marginBottom: '4px' }}>{tipus}</strong>
                    <span>Adatok: {adatok}</span><br />
                    <span>Cél: {cel}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-lg mb-4" style={{ color: '#F0EDE5', fontWeight: 400 }}>
                3. Az adatkezelés jogalapja
              </h2>
              <p>
                Az adatkezelés jogalapja a GDPR 6. cikk (1) bekezdés a) pontja szerint az érintett hozzájárulása,
                illetve b) pontja szerint a szerződés teljesítése (időpontfoglalás esetén).
              </p>
            </section>

            <section>
              <h2 className="font-serif text-lg mb-4" style={{ color: '#F0EDE5', fontWeight: 400 }}>
                4. Az adatok megőrzési ideje
              </h2>
              <p>
                A kapcsolatfelvételi adatokat a cél megvalósulásától (pl. időpont lebonyolítása) számított 1 évig
                tároljuk, kivéve, ha jogszabály hosszabb megőrzési időt ír elő. Az analitikai adatokat 26 hónapig
                őrizzük.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-lg mb-4" style={{ color: '#F0EDE5', fontWeight: 400 }}>
                5. Az érintett jogai
              </h2>
              <p className="mb-3">Az érintett az alábbi jogokkal rendelkezik:</p>
              <ul className="space-y-2">
                {[
                  'Hozzáférés joga – tájékoztatást kérhet a kezelt adatairól',
                  'Helyesbítés joga – kérheti pontatlan adatai javítását',
                  'Törlés joga – kérheti adatai törlését ("az elfeledtetéshez való jog")',
                  'Adatkezelés korlátozásának joga',
                  'Adathordozhatóság joga',
                  'Tiltakozás joga az adatkezelés ellen',
                ].map((jog) => (
                  <li key={jog} className="flex items-start gap-2">
                    <span style={{ color: 'rgba(201,169,110,0.4)', flexShrink: 0, marginTop: '4px' }}>–</span>
                    {jog}
                  </li>
                ))}
              </ul>
              <p className="mt-4">
                Jogainak gyakorlásához forduljon hozzánk az hello@valasszengem.hu e-mail-címen.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-lg mb-4" style={{ color: '#F0EDE5', fontWeight: 400 }}>
                6. Panasz benyújtása
              </h2>
              <p>
                Ha úgy ítéli meg, hogy az adatkezelés jogellenes, panaszt nyújthat be a Nemzeti Adatvédelmi és
                Információszabadság Hatósághoz (NAIH): naih.hu
              </p>
            </section>

            <section>
              <h2 className="font-serif text-lg mb-4" style={{ color: '#F0EDE5', fontWeight: 400 }}>
                7. Harmadik felek és integráció
              </h2>
              <p>
                Az oldal Google Analytics és/vagy Meta Pixel alapú mérést alkalmazhat a hozzájárulás megadása
                esetén. Időpontfoglaláshoz Cal.com beágyazott naptárt alkalmazunk – ezek saját adatkezelési
                feltételeik szerint működnek.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-lg mb-4" style={{ color: '#F0EDE5', fontWeight: 400 }}>
                8. Az adatkezelési tájékoztató módosítása
              </h2>
              <p>
                Fenntartjuk a jogot a tájékoztató módosítására. A változásokról az oldalon értesítjük a látogatókat.
                Jelen tájékoztató legutóbb 2025. június 1-jén frissült.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
