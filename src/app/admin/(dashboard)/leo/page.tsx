import { createAdminClient } from '@/lib/supabase/admin'
import { Users, Mail, Phone, Calendar } from 'lucide-react'
import StatusDropdown, { statusColor, statusLabel } from './StatusDropdown'

export const dynamic = 'force-dynamic'

type Lead = {
  id:         string
  created_at: string
  name:       string | null
  email:      string | null
  phone:      string | null
  source:     string | null
  status:     string
  notes:      string | null
}

async function getLeads(): Promise<Lead[]> {
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from('leads')
      .select('id, created_at, name, email, phone, source, status, notes')
      .order('created_at', { ascending: false })
      .limit(100)
    return (data as Lead[]) ?? []
  } catch {
    return []
  }
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="p-5 rounded-xl"
      style={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="text-2xl font-semibold mb-1" style={{ color }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: '#9A9688' }}>{label}</div>
    </div>
  )
}

export default async function LeoPage() {
  const leads = await getLeads()

  const stats = {
    total:  leads.length,
    new:    leads.filter((l) => l.status === 'NEW').length,
    client: leads.filter((l) => l.status === 'CLIENT').length,
    closed: leads.filter((l) => l.status === 'CLOSED').length,
  }

  return (
    <div className="p-6 max-w-5xl">
      {/* Fejléc */}
      <div className="mb-8 flex items-center gap-3">
        <Users size={22} style={{ color: '#C9A96E' }} />
        <div>
          <h1 className="font-serif text-2xl mb-0.5" style={{ color: '#F0EDE5' }}>
            Leo CRM Agent
          </h1>
          <p className="text-sm" style={{ color: '#5A5850' }}>
            Érdeklődők és ügyfelek kezelése
          </p>
        </div>
      </div>

      {/* Stat kártyák */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Összes lead"    value={stats.total}  color="#C9A96E" />
        <StatCard label="Új érdeklődő"   value={stats.new}    color="#60a5fa" />
        <StatCard label="Ügyfél"         value={stats.client} color="#4ade80" />
        <StatCard label="Lezárva"        value={stats.closed} color="#5A5850" />
      </div>

      {/* Lead lista */}
      {leads.length === 0 ? (
        <div
          className="p-8 rounded-xl text-center"
          style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <Users size={32} className="mx-auto mb-3" style={{ color: '#5A5850' }} />
          <p className="text-sm" style={{ color: '#5A5850' }}>
            Még nincs lead. Ha valaki kitölti a kapcsolati űrlapot, automatikusan megjelenik itt.
          </p>
        </div>
      ) : (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Fejléc sor */}
          <div
            className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-4 py-2.5 text-xs tracking-widest uppercase"
            style={{ backgroundColor: '#141414', color: '#5A5850', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span>Név / E-mail</span>
            <span>Telefon / Forrás</span>
            <span>Státusz</span>
            <span>Dátum</span>
            <span />
          </div>

          {/* Sorok */}
          {leads.map((lead, i) => {
            const color = statusColor(lead.status)
            return (
              <div
                key={lead.id}
                className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-4 py-3.5 items-center"
                style={{
                  backgroundColor: i % 2 === 0 ? '#111' : '#0d0d0d',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                {/* Név + email */}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#F0EDE5' }}>
                    {lead.name || '—'}
                  </p>
                  {lead.email && (
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-xs truncate flex items-center gap-1 mt-0.5"
                      style={{ color: '#C9A96E' }}
                    >
                      <Mail size={10} />
                      {lead.email}
                    </a>
                  )}
                </div>

                {/* Telefon + forrás */}
                <div className="min-w-0">
                  {lead.phone ? (
                    <p className="text-xs flex items-center gap-1" style={{ color: '#9A9688' }}>
                      <Phone size={10} />
                      {lead.phone}
                    </p>
                  ) : (
                    <p className="text-xs" style={{ color: '#5A5850' }}>—</p>
                  )}
                  {lead.source && (
                    <p className="text-xs mt-0.5" style={{ color: '#5A5850' }}>
                      {lead.source}
                    </p>
                  )}
                </div>

                {/* Státusz dropdown */}
                <div>
                  <StatusDropdown id={lead.id} currentStatus={lead.status} />
                </div>

                {/* Dátum */}
                <div className="text-xs flex items-center gap-1 whitespace-nowrap" style={{ color: '#5A5850' }}>
                  <Calendar size={10} />
                  {new Date(lead.created_at).toLocaleDateString('hu-HU', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>

                {/* Státusz badge (szín jelzés) */}
                <div>
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                    title={statusLabel(lead.status)}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
