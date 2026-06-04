'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, Save, Copy, Check, Loader2 } from 'lucide-react'

type Tab = 'blog' | 'facebook' | 'linkedin'

interface Generated {
  blog: string
  facebook: string
  linkedin: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöôő]/g, 'o')
    .replace(/[úùüûű]/g, 'u')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function MiraAgent() {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState<Generated | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('blog')
  const [error, setError] = useState('')
  const [savingDraft, setSavingDraft] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const supabase = createClient()

  async function handleGenerate() {
    if (!topic.trim()) return
    setLoading(true)
    setError('')
    setGenerated(null)

    try {
      const res = await fetch('/api/admin/mira', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Generálási hiba')
      }

      const data = await res.json()
      setGenerated(data)
      setActiveTab('blog')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hiba a generálás során')
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveDraft() {
    if (!generated || !topic) return
    setSavingDraft(true)

    try {
      const slug = slugify(topic) + '-' + Date.now().toString().slice(-4)
      const firstLine = generated.blog.split('\n')[0].replace(/^#+\s*/, '').trim()

      await supabase.from('posts').insert({
        title: firstLine || topic,
        slug,
        category: 'Önismeret',
        read_time: '5 perc',
        excerpt: generated.blog.slice(0, 200).trim() + '...',
        content: generated.blog,
        published: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      setDraftSaved(true)
      setTimeout(() => setDraftSaved(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSavingDraft(false)
    }
  }

  async function handleCopy() {
    if (!generated) return
    const textMap: Record<Tab, string> = {
      blog: generated.blog,
      facebook: generated.facebook,
      linkedin: generated.linkedin,
    }
    await navigator.clipboard.writeText(textMap[activeTab])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'blog', label: 'Blog', icon: '✍️' },
    { key: 'facebook', label: 'Facebook', icon: '📘' },
    { key: 'linkedin', label: 'LinkedIn', icon: '💼' },
  ]

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(201,169,110,0.12)' }}
          >
            <Sparkles size={16} style={{ color: '#C9A96E' }} />
          </div>
          <h1 className="font-serif text-3xl" style={{ color: '#F0EDE5', fontWeight: 300 }}>
            Mira Content Agent
          </h1>
        </div>
        <p className="text-sm" style={{ color: '#9A9688' }}>
          Add meg a témát, és Mira generál blog cikket, Facebook és LinkedIn posztot.
        </p>
      </div>

      {/* Input */}
      <div className="max-w-2xl mb-8">
        <div
          className="p-6 rounded-xl"
          style={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <label className="block text-sm mb-3" style={{ color: '#9A9688' }}>
            Téma vagy kulcsszó
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate()
            }}
            rows={3}
            placeholder={'pl. „Miert nehez segitseget kerni?” vagy „Az onismeret es a parkapcsolat kapcsolata”'}
            className="w-full rounded-lg px-4 py-3 text-sm outline-none resize-none mb-4"
            style={{
              backgroundColor: '#1e1e1e',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#F0EDE5',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: '#5A5850' }}>
              Ctrl+Enter a generáláshoz
            </p>
            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: topic.trim() ? '#C9A96E' : 'rgba(255,255,255,0.06)',
                color: topic.trim() ? '#0a0a0a' : '#5A5850',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Generálás...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Generálás
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div
            className="mt-4 p-3 rounded-lg text-sm"
            style={{
              backgroundColor: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#f87171',
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Generated content */}
      {generated && (
        <div className="max-w-2xl">
          {/* Tabs */}
          <div
            className="flex gap-1 p-1 rounded-xl mb-4 w-fit"
            style={{ backgroundColor: '#141414' }}
          >
            {tabs.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-all"
                style={{
                  backgroundColor:
                    activeTab === key ? 'rgba(201,169,110,0.12)' : 'transparent',
                  color: activeTab === key ? '#C9A96E' : '#9A9688',
                }}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Content area */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#5A5850' }}>
                {tabs.find((t) => t.key === activeTab)?.label} változat
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
                  style={{
                    color: copied ? '#4ade80' : '#9A9688',
                    border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  {copied ? <Check size={11} /> : <Copy size={11} />}
                  {copied ? 'Másolva!' : 'Másolás'}
                </button>
                <button
                  onClick={handleSaveDraft}
                  disabled={savingDraft}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
                  style={{
                    color: draftSaved ? '#4ade80' : '#C9A96E',
                    border: `1px solid ${draftSaved ? 'rgba(34,197,94,0.3)' : 'rgba(201,169,110,0.3)'}`,
                    opacity: savingDraft ? 0.7 : 1,
                  }}
                >
                  {draftSaved ? <Check size={11} /> : <Save size={11} />}
                  {draftSaved ? 'Mentve!' : 'Draft mentése'}
                </button>
              </div>
            </div>

            <div className="p-6">
              <pre
                className="whitespace-pre-wrap text-sm leading-relaxed"
                style={{ color: '#D0CCC0', fontFamily: 'inherit' }}
              >
                {activeTab === 'blog' && generated.blog}
                {activeTab === 'facebook' && generated.facebook}
                {activeTab === 'linkedin' && generated.linkedin}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
