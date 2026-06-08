import { checkSystemHealth, getDesignSettings, getPageSections, getSiteImages } from '@/lib/cms'
import { CheckCircle, XCircle, AlertTriangle, ExternalLink } from 'lucide-react'
import ResetDemoButton from '../ResetDemoButton'

export const dynamic = 'force-dynamic'

type Status = 'ok' | 'missing' | 'error'

function Row({ label, value, status }: { label: string; value: string; status: Status }) {
  const colors = {
    ok:      { bg: 'rgba(34,197,94,0.1)',   text: '#4ade80', border: 'rgba(34,197,94,0.2)' },
    missing: { bg: 'rgba(201,169,110,0.08)', text: '#C9A96E', border: 'rgba(201,169,110,0.2)' },
    error:   { bg: 'rgba(239,68,68,0.08)',   text: '#f87171', border: 'rgba(239,68,68,0.2)' },
  }
  const labels = { ok: 'MŰKÖDIK', missing: 'HIÁNYZIK', error: 'HIBA' }
  const icons  = {
    ok:      <CheckCircle   size={16} style={{ color: '#4ade80' }} />,
    missing: <AlertTriangle size={16} style={{ color: '#C9A96E' }} />,
    error:   <XCircle       size={16} style={{ color: '#f87171' }} />,
  }
  const c = colors[status]

  return (
    <div
      className="flex items-start gap-4 p-4 rounded-lg"
      style={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="mt-0.5 shrink-0">{icons[status]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs mb-1" style={{ color: '#5A5850' }}>{label}</p>
        <p className="text-sm font-mono break-all" style={{ color: status === 'ok' ? '#F0EDE5' : c.text }}>
          {value || '— nincs beállítva —'}
        </p>
      </div>
      <span
        className="shrink-0 text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
        style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}
      >
        {labels[status]}
      </span>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs tracking-widest uppercase font-medium mt-8 mb-3" style={{ color: '#5A5850' }}>
      {children}
    </h2>
  )
}

function envStatus(key: string): Status {
  return process.env[key] ? 'ok' : 'error'
}

function envValue(key: string): string {
  const v = process.env[key]
  if (!v) return ''
  if (key.includes('KEY') || key.includes('SECRET') || key.includes('ROLE')) {
    return v.slice(0, 8) + '••••••••'
  }
  return v.length > 60 ? v.slice(0, 60) + '…' : v
}

export default async function SmokeTestPage() {
  const [systemOk, design, home, about, images] = await Promise.all([
    checkSystemHealth(),
    getDesignSettings(),
    getPageSections('home'),
    getPageSections('about'),
    getSiteImages(),
  ])

  function contentStatus(value: string | undefined): Status {
    if (!value) return systemOk ? 'missing' : 'error'
    return 'ok'
  }

  const cmsChecks: { label: string; value: string; status: Status }[] = [
    { label: 'Hero cím (pages.home → hero_title)',      value: home.hero_title ?? '',   status: contentStatus(home.hero_title) },
    { label: 'Hero alcím (pages.home → hero_subtitle)', value: home.hero_subtitle ?? '', status: contentStatus(home.hero_subtitle) },
    { label: 'Hero CTA (pages.home → hero_cta)',        value: home.hero_cta ?? '',      status: contentStatus(home.hero_cta) },
    { label: 'CTA szöveg (design_settings → cta_text)', value: design.cta_text,          status: design.cta_text ? 'ok' : (systemOk ? 'missing' : 'error') },
    { label: 'Fő szín (design_settings → primary_color)', value: design.primary_color,   status: design.primary_color ? 'ok' : (systemOk ? 'missing' : 'error') },
    { label: 'Hero overlay (design_settings)',           value: `${design.hero_overlay}%`, status: design.hero_overlay !== null ? 'ok' : (systemOk ? 'missing' : 'error') },
    { label: 'Hero kép (site_images → hero)',           value: images['hero']?.url ?? '',          status: contentStatus(images['hero']?.url) },
    { label: 'Rólam kép (site_images → about)',         value: images['about']?.url ?? '',         status: contentStatus(images['about']?.url) },
    { label: 'Blog kép (site_images → blog-default)',   value: images['blog-default']?.url ?? '',  status: contentStatus(images['blog-default']?.url) },
    { label: 'Rólam főszöveg (pages.about → bio_main)', value: (about.bio_main ?? '').slice(0, 80) + ((about.bio_main?.length ?? 0) > 80 ? '…' : ''), status: contentStatus(about.bio_main) },
    { label: 'Rólam témák (pages.about → topics)',      value: (about.topics ?? '').slice(0, 80) + ((about.topics?.length ?? 0) > 80 ? '…' : ''),    status: contentStatus(about.topics) },
  ]

  const envChecks: { label: string; value: string; status: Status }[] = [
    { label: 'NEXT_PUBLIC_SUPABASE_URL',  value: envValue('NEXT_PUBLIC_SUPABASE_URL'),  status: envStatus('NEXT_PUBLIC_SUPABASE_URL') },
    { label: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: envValue('NEXT_PUBLIC_SUPABASE_ANON_KEY'), status: envStatus('NEXT_PUBLIC_SUPABASE_ANON_KEY') },
    { label: 'SUPABASE_SERVICE_ROLE_KEY', value: envValue('SUPABASE_SERVICE_ROLE_KEY'), status: envStatus('SUPABASE_SERVICE_ROLE_KEY') },
    { label: 'ADMIN_EMAILS',              value: envValue('ADMIN_EMAILS'),              status: envStatus('ADMIN_EMAILS') },
    { label: 'RESEND_API_KEY',            value: envValue('RESEND_API_KEY'),            status: envStatus('RESEND_API_KEY') },
    { label: 'ANTHROPIC_API_KEY',         value: envValue('ANTHROPIC_API_KEY'),         status: envStatus('ANTHROPIC_API_KEY') },
    { label: 'CENTRALAI_WEBHOOK_SECRET',  value: envValue('CENTRALAI_WEBHOOK_SECRET'),  status: process.env.CENTRALAI_WEBHOOK_SECRET ? 'ok' : 'missing' },
    {
      label: 'ADMIN_2FA_BYPASS (production-ban legyen üres)',
      value: process.env.ADMIN_2FA_BYPASS
        ? (process.env.NODE_ENV === 'production' ? 'beállítva, de PRODUCTION-ban INAKTÍV ✓' : `${process.env.ADMIN_2FA_BYPASS} (dev bypass aktív)`)
        : 'nincs beállítva',
      status: process.env.ADMIN_2FA_BYPASS && process.env.NODE_ENV === 'production' ? 'missing' : 'ok',
    },
  ]

  const allChecks = [...cmsChecks, ...envChecks]
  const okCount      = allChecks.filter((c) => c.status === 'ok').length
  const missingCount = allChecks.filter((c) => c.status === 'missing').length
  const errorCount   = allChecks.filter((c) => c.status === 'error').length
  const cmsTotal     = cmsChecks.length

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h1 className="font-serif text-3xl" style={{ color: '#F0EDE5', fontWeight: 300 }}>
            CMS Smoke Test
          </h1>
          <span
            className="text-sm px-3 py-1 rounded-full font-medium"
            style={{
              backgroundColor: errorCount === 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              color: errorCount === 0 ? '#4ade80' : '#f87171',
              border: errorCount === 0 ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(239,68,68,0.2)',
            }}
          >
            {okCount}/{allChecks.length} OK
          </span>
          {!systemOk && (
            <span
              className="text-sm px-3 py-1 rounded-full font-medium"
              style={{
                backgroundColor: 'rgba(239,68,68,0.1)',
                color: '#f87171',
                border: '1px solid rgba(239,68,68,0.2)',
              }}
            >
              ⚠ Supabase elérhetetlen
            </span>
          )}
        </div>
        <p className="text-sm" style={{ color: '#9A9688' }}>
          Rendszer, env változók és CMS tartalom állapota egy helyen.
        </p>
      </div>

      {/* Jelmagyarázat */}
      <div
        className="mb-4 p-4 rounded-xl flex flex-wrap gap-4 text-xs"
        style={{ backgroundColor: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="flex items-center gap-1.5" style={{ color: '#4ade80' }}>
          <CheckCircle size={12} /> MŰKÖDIK
        </span>
        <span className="flex items-center gap-1.5" style={{ color: '#C9A96E' }}>
          <AlertTriangle size={12} /> HIÁNYZIK — opcionális vagy feltölthető
        </span>
        <span className="flex items-center gap-1.5" style={{ color: '#f87171' }}>
          <XCircle size={12} /> HIBA — kötelező, élesítés előtt javítandó
        </span>
      </div>

      {/* ENV ellenőrzés */}
      <SectionTitle>Környezeti változók (env)</SectionTitle>
      <div className="space-y-2">
        {envChecks.map((check) => (
          <Row key={check.label} label={check.label} value={check.value} status={check.status} />
        ))}
      </div>

      {/* CMS tartalom */}
      <SectionTitle>CMS tartalom ({cmsChecks.filter(c => c.status === 'ok').length}/{cmsTotal} beállítva)</SectionTitle>
      <div className="space-y-2">
        {cmsChecks.map((check) => (
          <Row key={check.label} label={check.label} value={check.value} status={check.status} />
        ))}
      </div>

      {/* Összefoglaló */}
      <div
        className="mt-8 p-5 rounded-xl text-sm space-y-2"
        style={{
          backgroundColor: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          color: '#9A9688',
        }}
      >
        {errorCount > 0 && (
          <p><strong style={{ color: '#f87171' }}>{errorCount} kritikus hiba</strong> — élesítés ELŐTT javítandó. Ellenőrizd az env változókat Vercelben.</p>
        )}
        {missingCount > 0 && errorCount === 0 && (
          <p><strong style={{ color: '#C9A96E' }}>{missingCount} hiányzó érték</strong> — rendszer működik, de nem teljes. Töltsd fel a hiányzó tartalmakat.</p>
        )}
        {errorCount === 0 && missingCount === 0 && (
          <p><strong style={{ color: '#4ade80' }}>✓ Minden OK.</strong> Az oldal élesítésre kész.</p>
        )}
        {errorCount === 0 && missingCount > 0 && (
          <p style={{ color: '#5A5850' }}>
            Képek: <strong style={{ color: '#F0EDE5' }}>Admin → Képkezelő</strong> &nbsp;|&nbsp;
            Szövegek: <strong style={{ color: '#F0EDE5' }}>Admin → Oldalak</strong>
          </p>
        )}
      </div>

      {/* Gyors navigáció */}
      <div className="mt-6 flex flex-wrap gap-3 items-center">
        {[
          { href: '/admin/pages', label: 'Oldalszerkesztő' },
          { href: '/admin/images', label: 'Képkezelő' },
          { href: '/admin/design', label: 'Design beállítások' },
          { href: '/admin/mfa-setup', label: '2FA beállítás' },
        ].map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all"
            style={{ color: '#9A9688', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <ExternalLink size={11} />
            {label}
          </a>
        ))}
        <ResetDemoButton />
      </div>
    </div>
  )
}
