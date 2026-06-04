'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

const CATEGORIES = ['Önismeret', 'Kapcsolatok', 'Önfejlesztés', 'Tájékoztató']

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

export default function NewBlogPost() {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [readTime, setReadTime] = useState('5 perc')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!slug || slug === slugify(title)) {
      setSlug(slugify(value))
    }
  }

  async function handleSave() {
    if (!title.trim()) {
      setError('A cím kötelező')
      return
    }
    if (!slug.trim()) {
      setError('A slug kötelező')
      return
    }
    if (!content.trim()) {
      setError('A tartalom kötelező')
      return
    }

    setSaving(true)
    setError('')

    const { error: insertError } = await supabase.from('posts').insert({
      title,
      slug,
      category,
      read_time: readTime,
      excerpt,
      content,
      published,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
    } else {
      router.push('/admin/blog')
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/blog"
          className="p-2 rounded-lg transition-all"
          style={{ color: '#9A9688' }}
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1
            className="font-serif text-2xl"
            style={{ color: '#F0EDE5', fontWeight: 300 }}
          >
            Új cikk
          </h1>
        </div>
      </div>

      {error && (
        <div
          className="mb-6 p-3 rounded-lg text-sm"
          style={{
            backgroundColor: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            color: '#f87171',
          }}
        >
          {error}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-sm mb-2" style={{ color: '#9A9688' }}>
            Cím *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="A cikk címe"
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

        <div>
          <label className="block text-sm mb-2" style={{ color: '#9A9688' }}>
            URL slug *
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="url-slug-a-cikkhez"
            className="w-full rounded-lg px-4 py-3 text-sm outline-none font-mono"
            style={{
              backgroundColor: '#1e1e1e',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#C9A96E',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
          />
          <p className="text-xs mt-1.5" style={{ color: '#5A5850' }}>
            valasszengem.hu/blog/{slug || '...'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2" style={{ color: '#9A9688' }}>
              Kategória
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-sm outline-none"
              style={{
                backgroundColor: '#1e1e1e',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#F0EDE5',
              }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2" style={{ color: '#9A9688' }}>
              Olvasási idő
            </label>
            <input
              type="text"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              placeholder="5 perc"
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

        <div>
          <label className="block text-sm mb-2" style={{ color: '#9A9688' }}>
            Összefoglaló (excerpt)
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            placeholder="Rövid leírás a cikkhez (blog listaoldalon jelenik meg)"
            className="w-full rounded-lg px-4 py-3 text-sm outline-none resize-none"
            style={{
              backgroundColor: '#1e1e1e',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#F0EDE5',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
          />
        </div>

        <div>
          <label className="block text-sm mb-2" style={{ color: '#9A9688' }}>
            Tartalom * (bekezdésenként üres sor)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            placeholder="A cikk szövege. Bekezdések között hagyj egy üres sort."
            className="w-full rounded-lg px-4 py-3 text-sm outline-none resize-none leading-relaxed"
            style={{
              backgroundColor: '#1e1e1e',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#F0EDE5',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setPublished((v) => !v)}
              className="relative w-11 h-6 rounded-full transition-all cursor-pointer"
              style={{
                backgroundColor: published
                  ? '#C9A96E'
                  : 'rgba(255,255,255,0.1)',
              }}
            >
              <div
                className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                style={{ left: published ? '1.5rem' : '0.25rem' }}
              />
            </div>
            <span className="text-sm" style={{ color: '#9A9688' }}>
              {published ? 'Közzétéve' : 'Draft (nem publikus)'}
            </span>
          </label>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: '#C9A96E',
              color: '#0a0a0a',
              opacity: saving ? 0.7 : 1,
            }}
          >
            <Save size={14} />
            {saving ? 'Mentés...' : 'Mentés'}
          </button>
        </div>
      </div>
    </div>
  )
}
