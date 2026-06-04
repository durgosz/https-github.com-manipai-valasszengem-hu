'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Check } from 'lucide-react'

const DEFAULTS = {
  primary_color: '#C9A96E',
  hero_overlay: 40,
  cta_text: 'Időpontfoglalás',
}

export default function DesignSettings() {
  const [color, setColor] = useState(DEFAULTS.primary_color)
  const [overlay, setOverlay] = useState(DEFAULTS.hero_overlay)
  const [ctaText, setCtaText] = useState(DEFAULTS.cta_text)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const loadSettings = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('design_settings')
        .select('*')
        .eq('id', 1)
        .single()
      if (data) {
        setColor(data.primary_color ?? DEFAULTS.primary_color)
        setOverlay(data.hero_overlay ?? DEFAULTS.hero_overlay)
        setCtaText(data.cta_text ?? DEFAULTS.cta_text)
      }
    } catch {}
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  async function handleSave() {
    setSaving(true)
    try {
      await supabase.from('design_settings').upsert({
        id: 1,
        primary_color: color,
        hero_overlay: overlay,
        cta_text: ctaText,
        updated_at: new Date().toISOString(),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-10 max-w-xl mx-auto space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-xl animate-pulse" style={{ backgroundColor: '#141414' }} />
        ))}
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl mb-2" style={{ color: '#F0EDE5', fontWeight: 300 }}>
            Design beállítások
          </h1>
          <p className="text-sm" style={{ color: '#9A9688' }}>
            A változtatások az oldalon azonnal érvénybe lépnek.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{
            backgroundColor: saved ? 'rgba(34,197,94,0.12)' : '#C9A96E',
            color: saved ? '#4ade80' : '#0a0a0a',
            border: saved ? '1px solid rgba(34,197,94,0.3)' : 'none',
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saved ? <><Check size={14} /> Mentve</> : <><Save size={14} /> Mentés</>}
        </button>
      </div>

      <div className="max-w-xl space-y-6">
        {/* Primary color */}
        <div
          className="p-6 rounded-xl"
          style={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <label className="block font-medium text-sm mb-1" style={{ color: '#F0EDE5' }}>
            Fő szín
          </label>
          <p className="text-xs mb-4" style={{ color: '#9A9688' }}>
            A kiemelések, gombok és arany akcentek színe.
          </p>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border-0 p-1"
                style={{ backgroundColor: '#1e1e1e' }}
              />
            </div>
            <div>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#C9A96E"
                className="rounded-lg px-4 py-2.5 text-sm outline-none font-mono"
                style={{
                  backgroundColor: '#1e1e1e',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#F0EDE5',
                  width: '140px',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>
            {/* Color preview chips */}
            <div className="flex gap-2">
              {['#C9A96E', '#B8956A', '#E8C97A', '#A0856A'].map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full border-2 transition-all"
                  style={{
                    backgroundColor: c,
                    borderColor: color === c ? '#fff' : 'transparent',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Live preview */}
          <div className="mt-5 p-4 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
            <p className="text-xs mb-3" style={{ color: '#5A5850' }}>Előnézet:</p>
            <div className="flex items-center gap-3">
              <button
                className="px-4 py-2 rounded text-sm font-medium"
                style={{ backgroundColor: color, color: '#0a0a0a' }}
              >
                {ctaText}
              </button>
              <span className="text-sm" style={{ color }}>
                Szöveges link →
              </span>
              <div className="w-12 h-0.5" style={{ backgroundColor: color, opacity: 0.3 }} />
            </div>
          </div>
        </div>

        {/* Hero overlay */}
        <div
          className="p-6 rounded-xl"
          style={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <label className="block font-medium text-sm mb-1" style={{ color: '#F0EDE5' }}>
            Hero kép sötétítés
          </label>
          <p className="text-xs mb-4" style={{ color: '#9A9688' }}>
            A hero háttérkép felett lévő sötét overlay erőssége (0 = átlátszó, 100 = teljesen fekete).
          </p>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={0}
              max={100}
              value={overlay}
              onChange={(e) => setOverlay(Number(e.target.value))}
              className="flex-1 h-2 rounded-full outline-none cursor-pointer"
              style={{ accentColor: color }}
            />
            <span
              className="text-lg font-semibold w-12 text-right tabular-nums"
              style={{ color }}
            >
              {overlay}%
            </span>
          </div>
          {/* Overlay preview */}
          <div
            className="mt-4 h-16 rounded-lg relative overflow-hidden"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            <div
              className="absolute inset-0 rounded-lg"
              style={{ backgroundColor: `rgba(0,0,0,${overlay / 100})` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs" style={{ color: `rgba(240,237,229,${1 - overlay / 200})` }}>
                Hero szöveg láthatósága
              </span>
            </div>
          </div>
        </div>

        {/* CTA text */}
        <div
          className="p-6 rounded-xl"
          style={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <label className="block font-medium text-sm mb-1" style={{ color: '#F0EDE5' }}>
            CTA gomb szövege
          </label>
          <p className="text-xs mb-4" style={{ color: '#9A9688' }}>
            A fő cselekvésre ösztönző gomb felirata (pl. héron, navigációban).
          </p>
          <input
            type="text"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            className="w-full rounded-lg px-4 py-3 text-sm outline-none"
            style={{
              backgroundColor: '#1e1e1e',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#F0EDE5',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
          />
        </div>
      </div>
    </div>
  )
}
