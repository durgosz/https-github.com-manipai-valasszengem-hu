'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Loader2 } from 'lucide-react'
import { createTask } from './actions'

const AGENTS = ['Zara', 'Rex', 'Leo', 'Mira', 'Mike', 'Sage']

const inputStyle: React.CSSProperties = {
  backgroundColor: '#0a0a0a',
  border:          '1px solid rgba(255,255,255,0.08)',
  color:           '#F0EDE5',
}

export default function NewTaskForm() {
  const router = useRouter()
  const [open,    setOpen]    = useState(false)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setPending(true)
    try {
      await createTask(new FormData(form))
      form.reset()
      setOpen(false)
      router.refresh()
    } finally {
      setPending(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
        style={{ backgroundColor: '#C9A96E', color: '#0a0a0a' }}
      >
        <Plus size={15} />
        Új feladat
      </button>
    )
  }

  return (
    <div
      className="p-6 rounded-xl"
      style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center justify-between mb-5">
        <span className="text-sm font-medium" style={{ color: '#F0EDE5' }}>
          Új feladat
        </span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="p-1 rounded"
          style={{ color: '#5A5850' }}
        >
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs mb-1.5" style={{ color: '#9A9688' }}>Cím *</label>
          <input
            name="title"
            required
            placeholder="Feladat neve..."
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="block text-xs mb-1.5" style={{ color: '#9A9688' }}>Leírás</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Részletek, kontextus..."
            className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
            style={inputStyle}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#9A9688' }}>Agent</label>
            <select name="assigned_agent" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle}>
              <option value="">— nincs —</option>
              {AGENTS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#9A9688' }}>Prioritás</label>
            <select name="priority" defaultValue="MEDIUM" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle}>
              <option value="LOW">Alacsony</option>
              <option value="MEDIUM">Normál</option>
              <option value="HIGH">Magas</option>
              <option value="CRITICAL">Kritikus</option>
            </select>
          </div>

          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#9A9688' }}>Határidő</label>
            <input
              name="due_date"
              type="date"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ ...inputStyle, colorScheme: 'dark' }}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-lg text-sm"
            style={{ color: '#9A9688' }}
          >
            Mégse
          </button>
          <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            style={{ backgroundColor: '#C9A96E', color: '#0a0a0a' }}
          >
            {pending && <Loader2 size={14} className="animate-spin" />}
            Létrehozás
          </button>
        </div>
      </form>
    </div>
  )
}
