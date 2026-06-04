'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Upload, CheckCircle, AlertCircle, ImageIcon } from 'lucide-react'

const IMAGE_SLOTS = [
  {
    id: 'hero',
    label: 'Hero háttérkép',
    desc: 'Főoldal háttér (ajánlott: 1920×1080)',
    fallback: '/hero-bg.png',
  },
  {
    id: 'about',
    label: 'Rólam kép',
    desc: 'Rólam oldal háttér (ajánlott: 1200×800)',
    fallback: '/about-bg.png',
  },
  {
    id: 'blog-default',
    label: 'Blog borítókép',
    desc: 'Alapértelmezett blog kép (ajánlott: 1200×675)',
    fallback: '/blog-cover.png',
  },
]

interface ImageSlotState {
  url: string | null
  uploading: boolean
  success: boolean
  error: string | null
}

export default function ImagesPage() {
  const [slots, setSlots] = useState<Record<string, ImageSlotState>>(() =>
    Object.fromEntries(
      IMAGE_SLOTS.map((s) => [s.id, { url: null, uploading: false, success: false, error: null }])
    )
  )
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    async function loadCurrentImages() {
      try {
        const res = await fetch('/api/admin/images')
        if (!res.ok) return
        const data: { id: string; public_url: string }[] = await res.json()
        setSlots((prev) => {
          const updated = { ...prev }
          data.forEach(({ id, public_url }) => {
            if (updated[id]) updated[id] = { ...updated[id], url: public_url }
          })
          return updated
        })
      } catch {}
    }
    loadCurrentImages()
  }, [])

  async function handleUpload(slotId: string, file: File) {
    setSlots((prev) => ({
      ...prev,
      [slotId]: { ...prev[slotId], uploading: true, error: null, success: false },
    }))

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('imageId', slotId)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Feltöltési hiba')
      }

      const { url } = await res.json()
      setSlots((prev) => ({
        ...prev,
        [slotId]: { url, uploading: false, success: true, error: null },
      }))
      setTimeout(() => {
        setSlots((prev) => ({
          ...prev,
          [slotId]: { ...prev[slotId], success: false },
        }))
      }, 3000)
    } catch (err) {
      setSlots((prev) => ({
        ...prev,
        [slotId]: {
          ...prev[slotId],
          uploading: false,
          error: err instanceof Error ? err.message : 'Hiba',
        },
      }))
    }
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1
          className="font-serif text-3xl mb-2"
          style={{ color: '#F0EDE5', fontWeight: 300 }}
        >
          Képkezelő
        </h1>
        <p className="text-sm" style={{ color: '#9A9688' }}>
          A feltöltött képek Supabase Storage-ba kerülnek és automatikusan frissülnek az oldalon.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {IMAGE_SLOTS.map(({ id, label, desc, fallback }) => {
          const state = slots[id]
          return (
            <div
              key={id}
              className="rounded-xl overflow-hidden"
              style={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {/* Preview */}
              <div className="relative aspect-video bg-[#0a0a0a]">
                {state.url ? (
                  <Image
                    src={state.url}
                    alt={label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <ImageIcon size={28} style={{ color: '#5A5850' }} />
                    <span className="text-xs" style={{ color: '#5A5850' }}>
                      Nincs feltöltve
                    </span>
                    <span className="text-xs" style={{ color: '#3A3830' }}>
                      (aktuális: {fallback})
                    </span>
                  </div>
                )}
                {state.uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <div
                      className="w-8 h-8 rounded-full border-2 animate-spin"
                      style={{ borderColor: '#C9A96E', borderTopColor: 'transparent' }}
                    />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="font-medium text-sm mb-1" style={{ color: '#F0EDE5' }}>
                  {label}
                </div>
                <div className="text-xs mb-3" style={{ color: '#5A5850' }}>
                  {desc}
                </div>

                {state.error && (
                  <div
                    className="flex items-center gap-2 text-xs mb-3 p-2 rounded-lg"
                    style={{
                      color: '#f87171',
                      backgroundColor: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.15)',
                    }}
                  >
                    <AlertCircle size={12} />
                    {state.error}
                  </div>
                )}

                {state.success && (
                  <div
                    className="flex items-center gap-2 text-xs mb-3 p-2 rounded-lg"
                    style={{
                      color: '#4ade80',
                      backgroundColor: 'rgba(34,197,94,0.08)',
                      border: '1px solid rgba(34,197,94,0.15)',
                    }}
                  >
                    <CheckCircle size={12} />
                    Sikeresen feltöltve!
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => { fileInputRefs.current[id] = el }}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleUpload(id, file)
                  }}
                />
                <button
                  onClick={() => fileInputRefs.current[id]?.click()}
                  disabled={state.uploading}
                  className="flex items-center gap-2 w-full justify-center py-2.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    backgroundColor: 'rgba(201,169,110,0.1)',
                    border: '1px solid rgba(201,169,110,0.2)',
                    color: '#C9A96E',
                    opacity: state.uploading ? 0.6 : 1,
                  }}
                >
                  <Upload size={12} />
                  {state.uploading ? 'Feltöltés...' : 'Kép feltöltése'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
