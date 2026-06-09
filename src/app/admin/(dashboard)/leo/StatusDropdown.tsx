'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateLeadStatus } from './actions'

export const STATUSES: { value: string; label: string; color: string }[] = [
  { value: 'NEW',            label: 'Új',                    color: '#60a5fa' },
  { value: 'CONTACTED',      label: 'Megkeresve',             color: '#fbbf24' },
  { value: 'MEETING_BOOKED', label: 'Találkozó egyeztetve',   color: '#a78bfa' },
  { value: 'CLIENT',         label: 'Ügyfél',                 color: '#4ade80' },
  { value: 'CLOSED',         label: 'Lezárva',                color: '#5A5850' },
]

export function statusColor(value: string): string {
  return STATUSES.find((s) => s.value === value)?.color ?? '#9A9688'
}

export function statusLabel(value: string): string {
  return STATUSES.find((s) => s.value === value)?.label ?? value
}

export default function StatusDropdown({
  id,
  currentStatus,
}: {
  id: string
  currentStatus: string
}) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [pending, setPending] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value
    setStatus(next)
    setPending(true)
    try {
      await updateLeadStatus(id, next)
      router.refresh()
    } finally {
      setPending(false)
    }
  }

  const color = statusColor(status)

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={pending}
      className="text-xs rounded px-2 py-1 outline-none cursor-pointer disabled:opacity-50"
      style={{
        backgroundColor: `${color}18`,
        color,
        border: `1px solid ${color}40`,
        fontWeight: 500,
      }}
    >
      {STATUSES.map((s) => (
        <option key={s.value} value={s.value} style={{ backgroundColor: '#111', color: s.color }}>
          {s.label}
        </option>
      ))}
    </select>
  )
}
