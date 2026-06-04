/**
 * Ideiglenes preview oldal — logó variánsok összehasonlítása
 * Elérhető: /preview-logo (csak lokálisan / staging)
 */
export default function PreviewLogoPage() {
  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem' }}>

      {/* Fejléc */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 2rem 3rem' }}>
        <p style={{ color: '#5A5850', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
          Logó variáns összehasonlítás
        </p>
        <h1 style={{ color: '#F0EDE5', fontFamily: 'Georgia, serif', fontWeight: 300, fontSize: '1.6rem', marginBottom: 0 }}>
          Navbar logó variánsok
        </h1>
      </div>

      {/* ── Variáns A: Ikon bal oldalán ──────────────────────────── */}
      <VariantSection label="A — ikon a szöveg bal oldalán" recommended>
        <MockNav>
          <LogoA />
        </MockNav>
        <MockNavScrolled>
          <LogoA />
        </MockNavScrolled>
        <MockNavMobile>
          <LogoA />
        </MockNavMobile>
      </VariantSection>

      {/* ── Variáns B: Ikon felette (stacked) ───────────────────── */}
      <VariantSection label="B — ikon a szöveg felett (stacked)">
        <MockNav>
          <LogoB />
        </MockNav>
        <MockNavScrolled>
          <LogoB />
        </MockNavScrolled>
        <MockNavMobile>
          <LogoB />
        </MockNavMobile>
      </VariantSection>

      {/* ── Variáns C: Jelenlegi (összehasonlítás) ──────────────── */}
      <VariantSection label="C — jelenlegi (ikon nélkül, összehasonlításként)">
        <MockNav>
          <LogoC />
        </MockNav>
        <MockNavScrolled>
          <LogoC />
        </MockNavScrolled>
        <MockNavMobile>
          <LogoC />
        </MockNavMobile>
      </VariantSection>

    </div>
  )
}

// ─── SVG életfa ikon (navbar méret) ─────────────────────────────────────────

function TreeIcon({ size = 22 }: { size?: number }) {
  // 24×28 viewBox, arany, átlátszó háttér
  // 2 ágszint + csúcs + levél-pontok
  const h = size
  const w = Math.round(size * (24 / 28))
  return (
    <svg
      viewBox="0 0 24 28"
      width={w}
      height={h}
      style={{ display: 'block', flexShrink: 0 }}
      aria-hidden="true"
    >
      {/* Törzs */}
      <line x1="12" y1="27" x2="12" y2="13.5" stroke="#C9A96E" strokeWidth="2.2" strokeLinecap="round" />

      {/* 1. ágszint (legszélesebb) */}
      <path d="M 12 21.5 Q 6.5 17.5 1.5 14.5"
        stroke="#C9A96E" strokeWidth="1.9" fill="none" strokeLinecap="round" />
      <path d="M 12 21.5 Q 17.5 17.5 22.5 14.5"
        stroke="#C9A96E" strokeWidth="1.9" fill="none" strokeLinecap="round" />

      {/* 2. ágszint */}
      <path d="M 12 16.5 Q 7.5 12 4.5 8"
        stroke="#C9A96E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 12 16.5 Q 16.5 12 19.5 8"
        stroke="#C9A96E" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Csúcs */}
      <line x1="12" y1="13.5" x2="12" y2="1.5" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" />

      {/* Levél-pontok */}
      <circle cx="1.5"  cy="14.5" r="2.2" fill="#C9A96E" />
      <circle cx="22.5" cy="14.5" r="2.2" fill="#C9A96E" />
      <circle cx="4.5"  cy="8"    r="1.8" fill="#C9A96E" />
      <circle cx="19.5" cy="8"    r="1.8" fill="#C9A96E" />
      <circle cx="12"   cy="1.5"  r="2"   fill="#C9A96E" />
    </svg>
  )
}

// ─── Logó variánsok ──────────────────────────────────────────────────────────

function LogoA() {
  return (
    <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
      <TreeIcon size={22} />
      <span style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: '1.15rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: '#C9A96E',
        fontWeight: 400,
        lineHeight: 1,
      }}>
        válassz engem
      </span>
    </a>
  )
}

function LogoB() {
  return (
    <a href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
      <TreeIcon size={18} />
      <span style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: '0.75rem',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: '#C9A96E',
        fontWeight: 400,
        lineHeight: 1,
      }}>
        válassz engem
      </span>
    </a>
  )
}

function LogoC() {
  return (
    <a href="/" style={{ textDecoration: 'none' }}>
      <span style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: '1.15rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: '#C9A96E',
        fontWeight: 400,
      }}>
        válassz engem
      </span>
    </a>
  )
}

// ─── Mock navbar burkolók ────────────────────────────────────────────────────

function MockNav({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <p style={{ color: '#5A5850', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
        transparent (oldal teteje)
      </p>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 80,
        padding: '0 2rem',
        backgroundColor: 'transparent',
        border: '1px dashed rgba(201,169,110,0.12)',
      }}>
        {children}
        <MockMenuLinks />
      </div>
    </div>
  )
}

function MockNavScrolled({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 12 }}>
      <p style={{ color: '#5A5850', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
        scrollozott (sötét, blur háttér)
      </p>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 80,
        padding: '0 2rem',
        backgroundColor: 'rgba(10,10,10,0.92)',
        borderBottom: '1px solid rgba(201,169,110,0.08)',
        border: '1px solid rgba(201,169,110,0.08)',
      }}>
        {children}
        <MockMenuLinks />
      </div>
    </div>
  )
}

function MockNavMobile({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 12 }}>
      <p style={{ color: '#5A5850', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
        mobil (320px)
      </p>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 70,
        padding: '0 1.25rem',
        backgroundColor: 'rgba(10,10,10,0.92)',
        border: '1px solid rgba(201,169,110,0.08)',
        maxWidth: 320,
      }}>
        {children}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </div>
    </div>
  )
}

function MockMenuLinks() {
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      {['Rólam', 'Szolgáltatások', 'Árazás', 'Blog'].map(l => (
        <span key={l} style={{ color: '#9A9688', fontSize: 13, letterSpacing: '0.08em' }}>{l}</span>
      ))}
      <span style={{
        color: '#C9A96E',
        fontSize: 13,
        letterSpacing: '0.08em',
        padding: '8px 20px',
        border: '1px solid rgba(201,169,110,0.4)',
      }}>
        Időpontot kérek
      </span>
    </div>
  )
}

// ─── Section wrapper ─────────────────────────────────────────────────────────

function VariantSection({
  label,
  children,
  recommended,
}: {
  label: string
  children: React.ReactNode
  recommended?: boolean
}) {
  return (
    <div style={{
      maxWidth: 900,
      margin: '0 auto 3.5rem',
      padding: '0 2rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h2 style={{
          color: '#F0EDE5',
          fontFamily: 'Georgia, serif',
          fontWeight: 300,
          fontSize: '1.05rem',
          letterSpacing: '0.05em',
          margin: 0,
        }}>
          {label}
        </h2>
        {recommended && (
          <span style={{
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#C9A96E',
            border: '1px solid rgba(201,169,110,0.3)',
            padding: '2px 8px',
          }}>
            ajánlott
          </span>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {children}
      </div>
    </div>
  )
}
