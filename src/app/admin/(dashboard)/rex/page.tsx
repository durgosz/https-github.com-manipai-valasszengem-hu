import { createAdminClient } from '@/lib/supabase/admin'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import RunButton from './RunButton'

export const dynamic = 'force-dynamic'

type QaRun = {
  id: string
  created_at: string
  status: string
  typecheck_status: string | null
  build_status: string | null
  duration_ms: number | null
}

async function getRecentRuns(): Promise<QaRun[]> {
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from('qa_runs')
      .select('id, created_at, status, typecheck_status, build_status, duration_ms')
      .order('created_at', { ascending: false })
      .limit(10)
    return (data as QaRun[]) ?? []
  } catch {
    return []
  }
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
          Typecheck és build ellenőrzés – deployment előtti hibakeresés
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
            {runs.map((run) => (
              <div
                key={run.id}
                className="flex items-center gap-4 px-4 py-3 rounded-lg"
                style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {run.status === 'pass'
                  ? <CheckCircle size={15} style={{ color: '#4ade80' }} />
                  : <XCircle    size={15} style={{ color: '#f87171' }} />
                }
                <span className="text-xs font-mono" style={{ color: '#5A5850' }}>
                  {new Date(run.created_at).toLocaleString('hu-HU')}
                </span>
                <div className="flex items-center gap-2 ml-auto flex-wrap">
                  {(['typecheck', 'build'] as const).map((k) => {
                    const s = run[`${k}_status`]
                    return (
                      <span
                        key={k}
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: s === 'pass' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                          color: s === 'pass' ? '#4ade80' : '#f87171',
                        }}
                      >
                        {k}: {s ?? '?'}
                      </span>
                    )
                  })}
                  {run.duration_ms != null && (
                    <span className="text-xs flex items-center gap-1" style={{ color: '#5A5850' }}>
                      <Clock size={11} />
                      {(run.duration_ms / 1000).toFixed(1)}s
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
