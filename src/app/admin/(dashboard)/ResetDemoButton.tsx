'use client'

import { useState, useTransition } from 'react'
import { RotateCcw, X, AlertTriangle, Check } from 'lucide-react'
import { resetDemoContent } from '@/app/admin/actions'

export default function ResetDemoButton() {
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState<'success' | 'error' | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleConfirm() {
    startTransition(async () => {
      try {
        await resetDemoContent()
        setOpen(false)
        setToast('success')
        setTimeout(() => setToast(null), 3000)
      } catch {
        setOpen(false)
        setToast('error')
        setTimeout(() => setToast(null), 4000)
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all"
        style={{ color: '#9A9688', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <RotateCcw size={11} />
        Demo tartalom
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
            onClick={() => !isPending && setOpen(false)}
          />
          <div
            className="relative w-full max-w-md rounded-xl p-6"
            style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <button
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="absolute top-4 right-4"
              style={{ color: '#5A5850' }}
            >
              <X size={16} />
            </button>

            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(201,169,110,0.08)' }}
            >
              <AlertTriangle size={18} style={{ color: '#C9A96E' }} />
            </div>

            <h2 className="text-lg font-serif mb-2" style={{ color: '#F0EDE5', fontWeight: 300 }}>
              Demo tartalom visszaállítása
            </h2>
            <p className="text-sm mb-1" style={{ color: '#9A9688', lineHeight: 1.7 }}>
              Biztosan visszaállítod az alap demo tartalmat? A jelenlegi szövegek felülíródnak.
            </p>
            <p className="text-xs mb-6" style={{ color: '#5A5850' }}>
              Blogcikkek és feltöltött képek nem érintettek.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="px-4 py-2 rounded-lg text-sm transition-all"
                style={{
                  color: '#9A9688',
                  border: '1px solid rgba(255,255,255,0.08)',
                  opacity: isPending ? 0.5 : 1,
                }}
              >
                Mégsem
              </button>
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: 'rgba(201,169,110,0.12)',
                  color: '#C9A96E',
                  border: '1px solid rgba(201,169,110,0.25)',
                  opacity: isPending ? 0.7 : 1,
                }}
              >
                {isPending ? 'Visszaállítás...' : 'Igen, visszaállítom'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm shadow-lg"
          style={toast === 'success' ? {
            backgroundColor: '#1a1a1a',
            border: '1px solid rgba(34,197,94,0.25)',
            color: '#4ade80',
          } : {
            backgroundColor: '#1a1a1a',
            border: '1px solid rgba(239,68,68,0.25)',
            color: '#f87171',
          }}
        >
          {toast === 'success'
            ? <><Check size={14} /> Demo tartalom visszaállítva</>
            : <><X size={14} /> Hiba történt a visszaállítás során</>}
        </div>
      )}
    </>
  )
}
