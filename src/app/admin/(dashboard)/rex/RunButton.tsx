'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Loader2, Play, MinusCircle, Rocket, ShieldAlert, AlertTriangle } from 'lucide-react'

type CmdResult  = { stdout: string; stderr: string; ok: boolean; ms: number }
type LintStatus = 'pass' | 'fail' | 'skipped'
type Summary    = 'READY_TO_DEPLOY' | 'BLOCKED' | 'WARNING'

type RunResult = {
  summary:     Summary
  duration_ms: number
  typecheck:   CmdResult
  lint:        CmdResult
  lintStatus:  LintStatus
  build:       CmdResult
}

const SUMMARY_STYLE: Record<Summary, { bg: string; border: string; color: string; icon: React.ReactNode; label: string }> = {
  READY_TO_DEPLOY: {
    bg:     'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.25)',
    color:  '#4ade80',
    icon:   <Rocket size={18} />,
    label:  'READY TO DEPLOY',
  },
  BLOCKED: {
    bg:     'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.25)',
    color:  '#f87171',
    icon:   <ShieldAlert size={18} />,
    label:  'BLOCKED',
  },
  WARNING: {
    bg:     'rgba(251,191,36,0.08)',
    border: 'rgba(251,191,36,0.25)',
    color:  '#fbbf24',
    icon:   <AlertTriangle size={18} />,
    label:  'WARNING',
  },
}

function stepStatus(ok: boolean): { color: string; icon: React.ReactNode; label: string } {
  return ok
    ? { color: '#4ade80', icon: <CheckCircle size={14} />, label: 'PASS' }
    : { color: '#f87171', icon: <XCircle     size={14} />, label: 'FAIL' }
}

function lintStepStatus(ls: LintStatus): { color: string; icon: React.ReactNode; label: string } {
  if (ls === 'pass')    return { color: '#4ade80', icon: <CheckCircle  size={14} />, label: 'PASS' }
  if (ls === 'fail')    return { color: '#f87171', icon: <XCircle      size={14} />, label: 'FAIL' }
  return                       { color: '#9A9688', icon: <MinusCircle  size={14} />, label: 'SKIPPED' }
}

function CmdBlock({
  label,
  result,
  status,
}: {
  label:  string
  result: CmdResult
  status: { color: string; icon: React.ReactNode; label: string }
}) {
  const output = [result.stderr, result.stdout].filter(Boolean).join('\n').trim()
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-3 px-4 py-2.5" style={{ backgroundColor: '#141414' }}>
        <span style={{ color: status.color }}>{status.icon}</span>
        <span className="text-sm font-mono" style={{ color: '#F0EDE5' }}>{label}</span>
        <span
          className="ml-auto text-xs px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${status.color}1a`, color: status.color }}
        >
          {status.label}{result.ms > 0 ? ` · ${(result.ms / 1000).toFixed(1)}s` : ''}
        </span>
      </div>
      {output && (
        <pre
          className="p-4 text-xs overflow-x-auto overflow-y-auto"
          style={{
            backgroundColor: '#0a0a0a',
            color: status.label === 'PASS' ? '#9A9688' : status.color,
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
  const router  = useRouter()
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState<RunResult | null>(null)
  const [error,   setError]   = useState<string | null>(null)

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

  const s = result ? SUMMARY_STYLE[result.summary] : null

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
            typecheck → lint → build (2-4 perc)
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

      {result && s && (
        <div className="space-y-3">
          {/* Összesített státusz */}
          <div
            className="flex items-center gap-3 p-4 rounded-lg"
            style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}
          >
            <span style={{ color: s.color }}>{s.icon}</span>
            <span className="font-semibold text-sm tracking-wider" style={{ color: s.color }}>
              {s.label}
            </span>
            <span className="ml-auto text-xs" style={{ color: '#5A5850' }}>
              {(result.duration_ms / 1000).toFixed(1)}s
            </span>
          </div>

          {/* Typecheck */}
          <CmdBlock
            label="npm run typecheck"
            result={result.typecheck}
            status={stepStatus(result.typecheck.ok)}
          />

          {/* Lint */}
          <CmdBlock
            label="npm run lint"
            result={result.lint}
            status={lintStepStatus(result.lintStatus)}
          />

          {/* Build */}
          <CmdBlock
            label="npm run build"
            result={result.build}
            status={stepStatus(result.build.ok)}
          />
        </div>
      )}
    </div>
  )
}
