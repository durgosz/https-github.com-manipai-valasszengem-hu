'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Loader2, Play } from 'lucide-react'

type CmdResult = { stdout: string; stderr: string; ok: boolean; ms: number }
type RunResult = { status: 'pass' | 'fail'; duration_ms: number; typecheck: CmdResult; build: CmdResult }

const COMMANDS: { key: keyof RunResult; label: string }[] = [
  { key: 'typecheck', label: 'npm run typecheck' },
  { key: 'build',    label: 'npm run build' },
]

function CmdBlock({ label, result }: { label: string; result: CmdResult }) {
  const output = [result.stderr, result.stdout].filter(Boolean).join('\n').trim()
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-3 px-4 py-2.5" style={{ backgroundColor: '#141414' }}>
        {result.ok
          ? <CheckCircle size={14} style={{ color: '#4ade80' }} />
          : <XCircle    size={14} style={{ color: '#f87171' }} />
        }
        <span className="text-sm font-mono" style={{ color: '#F0EDE5' }}>{label}</span>
        <span
          className="ml-auto text-xs px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: result.ok ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            color: result.ok ? '#4ade80' : '#f87171',
          }}
        >
          {result.ok ? 'PASS' : 'FAIL'} · {(result.ms / 1000).toFixed(1)}s
        </span>
      </div>
      {output && (
        <pre
          className="p-4 text-xs overflow-x-auto overflow-y-auto"
          style={{
            backgroundColor: '#0a0a0a',
            color: result.ok ? '#9A9688' : '#f87171',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            maxHeight: '300px',
          }}
        >
          {output}
        </pre>
      )}
    </div>
  )
}

export default function RunButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RunResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleRun() {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch('/api/admin/rex/run', { method: 'POST' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error ?? `HTTP ${res.status}`)
      }
      const data: RunResult = await res.json()
      setResult(data)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ismeretlen hiba')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          onClick={handleRun}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
          style={{ backgroundColor: '#C9A96E', color: '#0a0a0a' }}
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />}
          {loading ? 'Futtatás...' : 'QA ellenőrzés futtatása'}
        </button>
        {loading && (
          <span className="text-xs" style={{ color: '#5A5850' }}>
            typecheck + build – akár 2-3 perc is lehet
          </span>
        )}
      </div>

      {error && (
        <div
          className="p-4 rounded-lg text-sm"
          style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
        >
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-3">
          <div
            className="flex items-center gap-3 p-4 rounded-lg"
            style={{
              backgroundColor: result.status === 'pass' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${result.status === 'pass' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
            }}
          >
            {result.status === 'pass'
              ? <CheckCircle size={18} style={{ color: '#4ade80' }} />
              : <XCircle    size={18} style={{ color: '#f87171' }} />
            }
            <span className="font-medium text-sm" style={{ color: result.status === 'pass' ? '#4ade80' : '#f87171' }}>
              {result.status === 'pass' ? 'Minden ellenőrzés sikeres' : 'Ellenőrzés hibával zárult'}
            </span>
            <span className="ml-auto text-xs" style={{ color: '#5A5850' }}>
              {(result.duration_ms / 1000).toFixed(1)}s
            </span>
          </div>

          {COMMANDS.map(({ key, label }) => (
            <CmdBlock key={key} label={label} result={result[key] as CmdResult} />
          ))}
        </div>
      )}
    </div>
  )
}
