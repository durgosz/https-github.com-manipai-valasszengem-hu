'use client'
import { useState, useEffect, useRef } from 'react'
import { Upload, CheckCircle, AlertCircle, ImageIcon, Settings, Save, Monitor, Smartphone } from 'lucide-react'

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
    desc: 'Rólam oldal portréfotó (ajánlott: 800×1000)',
    fallback: '/about-bg.png',
  },
  {
    id: 'blog-default',
    label: 'Blog borítókép',
    desc: 'Alapértelmezett blog kép (ajánlott: 1200×675)',
    fallback: '/blog-cover.png',
  },
]

interface SlotState {
  url: string | null
  uploading: boolean
  success: boolean
  error: string | null
  position_x: string
  position_y: string
  zoom: number
  object_fit: string
  alt_text: string
  saving: boolean
  saveSuccess: boolean
  settingsError: string | null
  showSettings: boolean
  previewMode: 'desktop' | 'mobile'
}

function makeDefault(): SlotState {
  return {
    url: null,
    uploading: false,
    success: false,
    error: null,
    position_x: '50%',
    position_y: '50%',
    zoom: 100,
    object_fit: 'cover',
    alt_text: '',
    saving: false,
    saveSuccess: false,
    settingsError: null,
    showSettings: false,
    previewMode: 'desktop',
  }
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  display,
  leftLabel,
  rightLabel,
  midLabel,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  display: string
  leftLabel: string
  rightLabel: string
  midLabel?: string
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium" style={{ color: '#9A9688' }}>{label}</span>
        <span className="text-xs font-mono tabular-nums" style={{ color: '#C9A96E' }}>{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="admin-slider"
      />
      <div className="flex justify-between text-xs mt-1.5" style={{ color: '#3A3830' }}>
        <span>{leftLabel}</span>
        {midLabel && <span>{midLabel}</span>}
        <span>{rightLabel}</span>
      </div>
    </div>
  )
}

export default function ImagesPage() {
  const [slots, setSlots] = useState<Record<string, SlotState>>(() =>
    Object.fromEntries(IMAGE_SLOTS.map((s) => [s.id, makeDefault()]))
  )
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/images')
        if (!res.ok) return
        const data: {
          id: string
          public_url: string
          position_x: string | null
          position_y: string | null
          object_fit: string | null
          alt_text: string | null
          zoom: number | null
        }[] = await res.json()
        setSlots((prev) => {
          const next = { ...prev }
          data.forEach(({ id, public_url, position_x, position_y, object_fit, alt_text, zoom }) => {
            if (next[id]) {
              const hasNonDefaultSettings =
                (position_x && position_x !== '50%') ||
                (position_y && position_y !== '50%') ||
                (zoom && zoom !== 100) ||
                (object_fit && object_fit !== 'cover')
              next[id] = {
                ...next[id],
                url: public_url ?? null,
                position_x: position_x ?? '50%',
                position_y: position_y ?? '50%',
                zoom: zoom ?? 100,
                object_fit: object_fit ?? 'cover',
                alt_text: alt_text ?? '',
                // Ha van kép és nem-alapértelmezett beállítás, panel nyitva
                showSettings: !!public_url && !!hasNonDefaultSettings,
              }
            }
          })
          return next
        })
      } catch {}
    }
    load()
  }, [])

  function patchSlot(id: string, update: Partial<SlotState>) {
    setSlots((prev) => ({ ...prev, [id]: { ...prev[id], ...update } }))
  }

  async function handleUpload(slotId: string, file: File) {
    patchSlot(slotId, { uploading: true, error: null, success: false })
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('imageId', slotId)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Feltöltési hiba')
      }
      const { url } = await res.json()
      // Cache buster: azonos fájlnév esetén a böngésző friss képet tölt be
      const previewUrl = `${url}?v=${Date.now()}`
      patchSlot(slotId, { url: previewUrl, uploading: false, success: true })
      setTimeout(() => patchSlot(slotId, { success: false }), 3000)
    } catch (err) {
      patchSlot(slotId, { uploading: false, error: err instanceof Error ? err.message : 'Hiba' })
    }
  }

  async function handleSaveSettings(slotId: string) {
    const s = slots[slotId]
    patchSlot(slotId, { saving: true, settingsError: null, saveSuccess: false })
    try {
      const res = await fetch('/api/admin/images', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: slotId,
          position_x: s.position_x,
          position_y: s.position_y,
          zoom: s.zoom,
          object_fit: s.object_fit,
          alt_text: s.alt_text,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Mentési hiba')
      }
      patchSlot(slotId, { saving: false, saveSuccess: true })
      setTimeout(() => patchSlot(slotId, { saveSuccess: false }), 3000)
    } catch (err) {
      patchSlot(slotId, { saving: false, settingsError: err instanceof Error ? err.message : 'Hiba' })
    }
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl mb-2" style={{ color: '#F0EDE5', fontWeight: 300 }}>
          Képkezelő
        </h1>
        <p className="text-sm" style={{ color: '#9A9688' }}>
          Feltöltés, zoom, pozicionálás és méretezés képenként – valós idejű előnézettel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {IMAGE_SLOTS.map(({ id, label, desc, fallback }) => {
          const s = slots[id]
          const objectPosition = `${s.position_x} ${s.position_y}`
          const zoomScale = s.zoom / 100

          return (
            <div
              key={id}
              className="rounded-xl overflow-hidden"
              style={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {/* Preview mode toggle */}
              <div className="flex items-center gap-2 px-4 pt-4 pb-2">
                <span className="text-xs flex-1" style={{ color: '#5A5850' }}>Előnézet</span>
                {(['desktop', 'mobile'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => patchSlot(id, { previewMode: mode })}
                    className="p-1.5 rounded transition-colors"
                    style={{
                      background: s.previewMode === mode ? 'rgba(201,169,110,0.15)' : 'transparent',
                      color: s.previewMode === mode ? '#C9A96E' : '#5A5850',
                    }}
                    title={mode === 'desktop' ? 'Desktop' : 'Mobil'}
                  >
                    {mode === 'desktop' ? <Monitor size={14} /> : <Smartphone size={14} />}
                  </button>
                ))}
              </div>

              {/* Preview */}
              <div
                className="relative bg-[#0a0a0a] mx-4 rounded-lg overflow-hidden"
                style={{ aspectRatio: s.previewMode === 'mobile' ? '9/16' : '16/9' }}
              >
                {s.url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={s.url}
                    alt={s.alt_text || label}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: s.object_fit as 'cover' | 'contain',
                      objectPosition,
                      transform: zoomScale !== 1 ? `scale(${zoomScale})` : undefined,
                      transformOrigin: objectPosition,
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <ImageIcon size={28} style={{ color: '#5A5850' }} />
                    <span className="text-xs" style={{ color: '#5A5850' }}>Nincs feltöltve</span>
                    <span className="text-xs" style={{ color: '#3A3830' }}>({fallback})</span>
                  </div>
                )}
                {s.uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <div
                      className="w-8 h-8 rounded-full border-2 animate-spin"
                      style={{ borderColor: '#C9A96E', borderTopColor: 'transparent' }}
                    />
                  </div>
                )}
              </div>

              {/* Info + upload */}
              <div className="p-4">
                <div className="font-medium text-sm mb-1" style={{ color: '#F0EDE5' }}>{label}</div>
                <div className="text-xs mb-3" style={{ color: '#5A5850' }}>{desc}</div>

                {s.error && (
                  <div className="flex items-center gap-2 text-xs mb-3 p-2 rounded-lg" style={{ color: '#f87171', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                    <AlertCircle size={12} />{s.error}
                  </div>
                )}
                {s.success && (
                  <div className="flex items-center gap-2 text-xs mb-3 p-2 rounded-lg" style={{ color: '#4ade80', backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
                    <CheckCircle size={12} />Sikeresen feltöltve!
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*,.jfif"
                  className="hidden"
                  ref={(el) => { fileInputRefs.current[id] = el }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(id, f) }}
                />
                <button
                  onClick={() => fileInputRefs.current[id]?.click()}
                  disabled={s.uploading}
                  className="flex items-center gap-2 w-full justify-center py-2.5 rounded-lg text-xs font-medium transition-all mb-2"
                  style={{
                    backgroundColor: 'rgba(201,169,110,0.1)',
                    border: '1px solid rgba(201,169,110,0.2)',
                    color: '#C9A96E',
                    opacity: s.uploading ? 0.6 : 1,
                  }}
                >
                  <Upload size={12} />
                  {s.uploading ? 'Feltöltés...' : 'Kép feltöltése'}
                </button>

                {/* Settings toggle */}
                <button
                  onClick={() => patchSlot(id, { showSettings: !s.showSettings })}
                  className="flex items-center gap-2 w-full justify-center py-2 rounded-lg text-xs transition-all"
                  style={{ color: s.showSettings ? '#C9A96E' : '#5A5850', border: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <Settings size={11} />
                  Pozicionálás és zoom {s.showSettings ? '▲' : '▼'}
                </button>

                {/* Settings panel */}
                {s.showSettings && (
                  <div className="mt-3 space-y-5 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>

                    {/* Zoom */}
                    <SliderRow
                      label="Zoom"
                      value={s.zoom}
                      min={50}
                      max={200}
                      step={1}
                      display={`${s.zoom}%`}
                      leftLabel="50%"
                      midLabel="100%"
                      rightLabel="200%"
                      onChange={(v) => patchSlot(id, { zoom: v })}
                    />

                    {/* X position */}
                    <SliderRow
                      label="Vízszintes (X)"
                      value={parseFloat(s.position_x) || 50}
                      min={0}
                      max={100}
                      step={1}
                      display={s.position_x}
                      leftLabel="Bal"
                      rightLabel="Jobb"
                      onChange={(v) => patchSlot(id, { position_x: `${v}%` })}
                    />

                    {/* Y position */}
                    <SliderRow
                      label="Függőleges (Y)"
                      value={parseFloat(s.position_y) || 50}
                      min={0}
                      max={100}
                      step={1}
                      display={s.position_y}
                      leftLabel="Felső"
                      rightLabel="Alsó"
                      onChange={(v) => patchSlot(id, { position_y: `${v}%` })}
                    />

                    {/* Object fit */}
                    <div>
                      <div className="text-xs mb-2 font-medium" style={{ color: '#9A9688' }}>Méretezés</div>
                      <div className="flex gap-2">
                        {(['cover', 'contain'] as const).map((fit) => (
                          <button
                            key={fit}
                            onClick={() => patchSlot(id, { object_fit: fit })}
                            className="px-3 py-1.5 rounded text-xs transition-all"
                            style={{
                              backgroundColor: s.object_fit === fit ? 'rgba(201,169,110,0.15)' : 'rgba(255,255,255,0.04)',
                              border: s.object_fit === fit ? '1px solid rgba(201,169,110,0.4)' : '1px solid rgba(255,255,255,0.06)',
                              color: s.object_fit === fit ? '#C9A96E' : '#5A5850',
                            }}
                          >
                            {fit === 'cover' ? 'Cover' : 'Contain'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Alt text */}
                    <div>
                      <div className="text-xs mb-2 font-medium" style={{ color: '#9A9688' }}>Alt szöveg</div>
                      <input
                        type="text"
                        value={s.alt_text}
                        onChange={(e) => patchSlot(id, { alt_text: e.target.value })}
                        className="w-full text-xs rounded px-2 py-1.5"
                        style={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', color: '#F0EDE5' }}
                        placeholder="Leíró szöveg a képhez…"
                      />
                    </div>

                    {s.settingsError && (
                      <div className="flex items-center gap-2 text-xs p-2 rounded-lg" style={{ color: '#f87171', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                        <AlertCircle size={12} />{s.settingsError}
                      </div>
                    )}
                    {s.saveSuccess && (
                      <div className="flex items-center gap-2 text-xs p-2 rounded-lg" style={{ color: '#4ade80', backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
                        <CheckCircle size={12} />Beállítások mentve!
                      </div>
                    )}

                    <button
                      onClick={() => handleSaveSettings(id)}
                      disabled={s.saving || !s.url}
                      className="flex items-center gap-2 w-full justify-center py-2.5 rounded-lg text-xs font-medium transition-all"
                      title={!s.url ? 'Először tölts fel egy képet, majd mentheted a beállításokat' : 'Zoom, pozíció és alt szöveg mentése'}
                      style={{
                        backgroundColor: s.url ? 'rgba(201,169,110,0.15)' : 'rgba(255,255,255,0.04)',
                        border: s.url ? '1px solid rgba(201,169,110,0.3)' : '1px solid rgba(255,255,255,0.06)',
                        color: s.url ? '#C9A96E' : '#5A5850',
                        opacity: s.saving || !s.url ? 0.5 : 1,
                        cursor: !s.url ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <Save size={12} />
                      {s.saving ? 'Mentés...' : s.url ? 'Beállítások mentése' : 'Tölts fel képet a mentéshez'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
