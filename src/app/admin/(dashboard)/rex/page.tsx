import { createAdminClient } from '@/lib/supabase/admin'
import { CheckCircle, XCircle, MinusCircle, Clock, Rocket, ShieldAlert, AlertTriangle } from 'lucide-react'
import RunButton from './RunButton'

export const dynamic = 'force-dynamic'

type Summary = 'READY_TO_DEPLOY' | 'BLOCKED' | 'WARNING'

type QaRun = {
  id:               string
  created_at:       string
  summary:          string | null
  typecheck_status: string | null
  lint_status:      string | null
  build_status:     string | null
  duration_ms:      number | null
}

async function getRecentRuns(): Promise<QaRun[]> {
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from('qa_runs')
      .select('id, created_at, summary, typecheck_status, lint_status, build_status, duration_ms')
      .order('created_at', { ascending: false })
      .limit(10)
    return (data as QaRun[]) ?? []
  } catch {
    return []
  }
}

const SUMMARY_STYLE: Record<Summary, { color: string; icon: React.ReactNode; label: string }> = {
  READY_TO_DEPLOY: { color: '#4ade80', icon: <Rocket       size={13} />, label: 'READY' },
  BLOCKED:         { color: '#f87171', icon: <ShieldAlert   size={13} />, label: 'BLOCKED' },
  WARNING:         { color: '#fbbf24', icon: <AlertTriangle size={13} />, label: 'WARNING' },
}

function StatusChip({ value }: { value: string | null }) {
  if (!value) return null
  const color =
    value === 'pass'    ? '#4ade80' :
    value === 'fail'    ? '#f87171' :
    value === 'skipped' ? '#9A9688' : '#5A5850'
  const icon =
    value === 'pass'    ? <CheckCircle  size={11} /> :
    value === 'fail'    ? <XCircle      size={11} /> :
    value === 'skipped' ? <MinusCircle  size={11} /> : null
  return (
    <span
      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded"
      style={{ backgroundColor: `${color}1a`, color }}
    >
      {icon}{value.toUpperCase()}
    </span>
  )
}

export default async function RexPage() {
  const runs = await getRecentRuns()

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-serif text-2xl mb-1" style={{ color: '#F0EDE5' }}>
          Rex QA Agent
        </h1>
        <p className="text-sm" style={{ color: '#5A5850' }}>
          Typecheck → Lint → Build · deployment előtti hibakeresés
        </p>
      </div>

      <div
        className="p-6 rounded-xl mb-8"
        style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <RunButton />
      </div>

      <div>
        <h2 className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: '#5A5850' }}>
          Utolsó 10 futtatás
        </h2>

        {runs.length === 0 ? (
          <p className="text-sm" style={{ color: '#5A5850' }}>
            Még nem volt QA futtatás.
          </p>
        ) : (
          <div className="space-y-2">
            {runs.map((run) => {
              const summaryKey = (run.summary ?? '') as Summary
              const ss = SUMMARY_STYLE[summaryKey]
              return (
                <div
                  key={run.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg flex-wrap"
                  style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {/* Összesített státusz */}
                  {ss ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: ss.color }}>
                      {ss.icon}{ss.label}
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: '#5A5850' }}>—</span>
                  )}

                  <span className="text-xs font-mono" style={{ color: '#5A5850' }}>
                    {new Date(run.created_at).toLocaleString('hu-HU')}
                  </span>

                  <div className="flex items-center gap-1.5 ml-auto flex-wrap">
                    <span className="text-xs" style={{ color: '#5A5850' }}>tc:</span>
                    <StatusChip value={run.typecheck_status} />
                    <span className="text-xs" style={{ color: '#5A5850' }}>lint:</span>
                    <StatusChip value={run.lint_status} />
                    <span className="text-xs" style={{ color: '#5A5850' }}>build:</span>
                    <StatusChip value={run.build_status} />
                    {run.duration_ms != null && (
                      <span className="text-xs flex items-center gap-1 ml-1" style={{ color: '#5A5850' }}>
                        <Clock size={11} />
                        {(run.duration_ms / 1000).toFixed(1)}s
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
