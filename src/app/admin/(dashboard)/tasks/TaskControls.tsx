'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateTaskStatus, updateTaskPriority } from './actions'

export const STATUSES = [
  { value: 'TODO',        label: 'Teendő',       color: '#60a5fa' },
  { value: 'IN_PROGRESS', label: 'Folyamatban',   color: '#fbbf24' },
  { value: 'DONE',        label: 'Kész',          color: '#4ade80' },
]

export const PRIORITIES = [
  { value: 'LOW',      label: 'Alacsony',  color: '#9A9688' },
  { value: 'MEDIUM',   label: 'Normál',    color: '#60a5fa' },
  { value: 'HIGH',     label: 'Magas',     color: '#fbbf24' },
  { value: 'CRITICAL', label: 'Kritikus',  color: '#f87171' },
]

export function statusStyle(v: string) {
  return STATUSES.find((s) => s.value === v) ?? { color: '#9A9688', label: v }
}

export function priorityStyle(v: string) {
  return PRIORITIES.find((p) => p.value === v) ?? { color: '#9A9688', label: v }
}

function InlineSelect({
  value,
  options,
  disabled,
  onChange,
}: {
  value: string
  options: { value: string; label: string; color: string }[]
  disabled: boolean
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}) {
  const current = options.find((o) => o.value === value) ?? options[0]
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="text-xs rounded px-2 py-1 outline-none cursor-pointer disabled:opacity-50 whitespace-nowrap"
      style={{
        backgroundColor: `${current.color}18`,
        color:           current.color,
        border:          `1px solid ${current.color}40`,
        fontWeight: 500,
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ backgroundColor: '#111', color: o.color }}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

export default function TaskControls({
  id,
  currentStatus,
  currentPriority,
}: {
  id:              string
  currentStatus:   string
  currentPriority: string
}) {
  const router = useRouter()
  const [status,   setStatus]   = useState(currentStatus)
  const [priority, setPriority] = useState(currentPriority)
  const [pendingS, setPendingS] = useState(false)
  const [pendingP, setPendingP] = useState(false)

  async function handleStatus(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value
    setStatus(next)
    setPendingS(true)
    try { await updateTaskStatus(id, next); router.refresh() }
    finally { setPendingS(false) }
  }

  async function handlePriority(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value
    setPriority(next)
    setPendingP(true)
    try { await updateTaskPriority(id, next); router.refresh() }
    finally { setPendingP(false) }
  }

  return (
    <div className="flex items-center gap-1.5">
      <InlineSelect value={status}   options={STATUSES}   disabled={pendingS} onChange={handleStatus}   />
      <InlineSelect value={priority} options={PRIORITIES} disabled={pendingP} onChange={handlePriority} />
    </div>
  )
}
