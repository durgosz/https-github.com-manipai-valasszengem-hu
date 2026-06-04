'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ExternalLink, Save, Check } from 'lucide-react'

const PAGE_CONFIGS = [
  {
    id: 'home',
    label: 'Főoldal',
    previewUrl: '/',
    fields: [
      { key: 'hero_title', label: 'Hero főcím', type: 'text' },
      { key: 'hero_subtitle', label: 'Hero alcím', type: 'textarea' },
      { key: 'hero_cta', label: 'CTA gomb szöveg', type: 'text' },
      { key: 'about_preview', label: 'Rólam előnézet szöveg', type: 'textarea' },
    ],
  },
  {
    id: 'about',
    label: 'Rólam',
    previewUrl: '/rolam',
    fields: [
      { key: 'bio_main', label: 'Főszöveg', type: 'textarea' },
      { key: 'bio_detail', label: 'Részletek', type: 'textarea' },
      { key: 'topics', label: 'Témák (soronként egy)', type: 'textarea' },
    ],
  },
  {
    id: 'services',
    label: 'Szolgáltatások',
    previewUrl: '/szolgaltatasok',
    fields: [
      { key: 's1_name', label: '1. Neve', type: 'text' },
      { key: 's1_duration', label: '1. Időtartam', type: 'text' },
      { key: 's1_price', label: '1. Ár', type: 'text' },
      { key: 's1_desc', label: '1. Leírás', type: 'textarea' },
      { key: 's2_name', label: '2. Neve', type: 'text' },
      { key: 's2_duration', label: '2. Időtartam', type: 'text' },
      { key: 's2_price', label: '2. Ár', type: 'text' },
      { key: 's2_desc', label: '2. Leírás', type: 'textarea' },
      { key: 's3_name', label: '3. Neve', type: 'text' },
      { key: 's3_duration', label: '3. Időtartam', type: 'text' },
      { key: 's3_price', label: '3. Ár', type: 'text' },
      { key: 's3_desc', label: '3. Leírás', type: 'textarea' },
    ],
  },
  {
    id: 'pricing',
    label: 'Árazás',
    previewUrl: '/arazas',
    fields: [
      { key: 'intro', label: 'Bevezető szöveg', type: 'textarea' },
      { key: 'price_60', label: '60 perces ülés ára', type: 'text' },
      { key: 'price_90', label: '90 perces ülés ára', type: 'text' },
      { key: 'pricing_cta', label: 'CTA gomb szöveg', type: 'text' },
      { key: 'trust_text', label: 'Bizalmi szöveg', type: 'textarea' },
    ],
  },
  {
    id: 'contact',
    label: 'Kapcsolat',
    previewUrl: '/kapcsolat',
    fields: [
      { key: 'title', label: 'Oldal cím', type: 'text' },
      { key: 'subtitle', label: 'Alcím', type: 'textarea' },
      { key: 'email', label: 'Email cím', type: 'text' },
      { key: 'phone', label: 'Telefon', type: 'text' },
    ],
  },
]

export default function PagesEditor() {
  const [selectedPage, setSelectedPage] = useState(PAGE_CONFIGS[0].id)
  const [sections, setSections] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const config = PAGE_CONFIGS.find((p) => p.id === selectedPage)!

  const loadPage = useCallback(async (pageId: string) => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('pages')
        .select('sections')
        .eq('id', pageId)
        .single()
      setSections(data?.sections ?? {})
    } catch {
      setSections({})
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    loadPage(selectedPage)
  }, [selectedPage, loadPage])

  async function handleSave() {
    setSaving(true)
    try {
      await supabase.from('pages').upsert({
        id: selectedPage,
        sections,
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

  return (
    <div className="flex flex-col md:flex-row h-full min-h-screen">
      {/* Page selector */}
      <aside
        className="md:w-52 shrink-0 p-4 md:border-r"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <p className="text-xs uppercase tracking-widest mb-3 px-2" style={{ color: '#5A5850' }}>
          Oldalak
        </p>
        <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-1 md:pb-0">
          {PAGE_CONFIGS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPage(p.id)}
              className="px-3 py-2 rounded-lg text-sm whitespace-nowrap text-left transition-all"
              style={{
                color: selectedPage === p.id ? '#C9A96E' : '#9A9688',
                backgroundColor:
                  selectedPage === p.id ? 'rgba(201,169,110,0.08)' : 'transparent',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Editor */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-serif" style={{ color: '#F0EDE5', fontWeight: 300 }}>
              {config.label}
            </h2>
            <p className="text-xs mt-1" style={{ color: '#5A5850' }}>
              A mentett szövegek Supabase-ben tárolódnak
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={config.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all"
              style={{
                color: '#9A9688',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <ExternalLink size={12} />
              Előnézet
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: saved ? 'rgba(34,197,94,0.15)' : '#C9A96E',
                color: saved ? '#4ade80' : '#0a0a0a',
                border: saved ? '1px solid rgba(34,197,94,0.3)' : 'none',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saved ? (
                <>
                  <Check size={12} /> Mentve
                </>
              ) : (
                <>
                  <Save size={12} /> Mentés
                </>
              )}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 rounded-lg animate-pulse"
                style={{ backgroundColor: '#1a1a1a' }}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-5 max-w-2xl">
            {config.fields.map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-sm mb-2" style={{ color: '#9A9688' }}>
                  {label}
                </label>
                {type === 'textarea' ? (
                  <textarea
                    value={sections[key] ?? ''}
                    onChange={(e) =>
                      setSections((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    rows={4}
                    className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all resize-none"
                    style={{
                      backgroundColor: '#1e1e1e',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#F0EDE5',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
                    onBlur={(e) =>
                      (e.target.style.borderColor = 'rgba(255,255,255,0.08)')
                    }
                  />
                ) : (
                  <input
                    type="text"
                    value={sections[key] ?? ''}
                    onChange={(e) =>
                      setSections((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
                    style={{
                      backgroundColor: '#1e1e1e',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#F0EDE5',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
                    onBlur={(e) =>
                      (e.target.style.borderColor = 'rgba(255,255,255,0.08)')
                    }
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
