'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'

const CATEGORIES = ['Önismeret', 'Kapcsolatok', 'Önfejlesztés', 'Tájékoztató']

interface Post {
  id: string
  title: string
  slug: string
  category: string
  read_time: string
  excerpt: string
  content: string
  published: boolean
}

export default function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      const { data, error: fetchError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError || !data) {
        setNotFound(true)
      } else {
        setPost(data)
      }
      setLoading(false)
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function handleSave() {
    if (!post) return
    if (!post.title.trim() || !post.slug.trim() || !post.content.trim()) {
      setError('Cím, slug és tartalom kötelező')
      return
    }

    setSaving(true)
    setError('')

    const { error: updateError } = await supabase
      .from('posts')
      .update({
        title: post.title,
        slug: post.slug,
        category: post.category,
        read_time: post.read_time,
        excerpt: post.excerpt,
        content: post.content,
        published: post.published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
    } else {
      router.push('/admin/blog')
    }
  }

  async function handleDelete() {
    if (!confirm('Biztosan törlöd ezt a cikket?')) return
    await supabase.from('posts').delete().eq('id', id)
    router.push('/admin/blog')
  }

  function updateField<K extends keyof Post>(key: K, value: Post[K]) {
    setPost((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  if (loading) {
    return (
      <div className="p-10 max-w-3xl mx-auto space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-12 rounded-lg animate-pulse"
            style={{ backgroundColor: '#141414' }}
          />
        ))}
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="p-10 text-center">
        <p style={{ color: '#9A9688' }}>Cikk nem található</p>
        <Link href="/admin/blog" className="text-sm mt-4 inline-block" style={{ color: '#C9A96E' }}>
          ← Vissza a bloghoz
        </Link>
      </div>
    )
  }

  if (!post) return null

  const inputStyle = {
    backgroundColor: '#1e1e1e',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#F0EDE5' as const,
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog" className="p-2 rounded-lg" style={{ color: '#9A9688' }}>
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-serif text-2xl" style={{ color: '#F0EDE5', fontWeight: 300 }}>
            Cikk szerkesztése
          </h1>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all hover:text-red-400"
          style={{ color: '#5A5850', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <Trash2 size={12} />
          Törlés
        </button>
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
          <label className="block text-sm mb-2" style={{ color: '#9A9688' }}>Cím</label>
          <input
            type="text"
            value={post.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full rounded-lg px-4 py-3 text-sm outline-none"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
          />
        </div>

        <div>
          <label className="block text-sm mb-2" style={{ color: '#9A9688' }}>URL slug</label>
          <input
            type="text"
            value={post.slug}
            onChange={(e) => updateField('slug', e.target.value)}
            className="w-full rounded-lg px-4 py-3 text-sm outline-none font-mono"
            style={{ ...inputStyle, color: '#C9A96E' }}
            onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2" style={{ color: '#9A9688' }}>Kategória</label>
            <select
              value={post.category}
              onChange={(e) => updateField('category', e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-sm outline-none"
              style={inputStyle}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2" style={{ color: '#9A9688' }}>Olvasási idő</label>
            <input
              type="text"
              value={post.read_time}
              onChange={(e) => updateField('read_time', e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-sm outline-none"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2" style={{ color: '#9A9688' }}>Összefoglaló</label>
          <textarea
            value={post.excerpt}
            onChange={(e) => updateField('excerpt', e.target.value)}
            rows={3}
            className="w-full rounded-lg px-4 py-3 text-sm outline-none resize-none"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
          />
        </div>

        <div>
          <label className="block text-sm mb-2" style={{ color: '#9A9688' }}>
            Tartalom (bekezdésenként üres sor)
          </label>
          <textarea
            value={post.content}
            onChange={(e) => updateField('content', e.target.value)}
            rows={16}
            className="w-full rounded-lg px-4 py-3 text-sm outline-none resize-none leading-relaxed"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => updateField('published', !post.published)}
              className="relative w-11 h-6 rounded-full transition-all cursor-pointer"
              style={{ backgroundColor: post.published ? '#C9A96E' : 'rgba(255,255,255,0.1)' }}
            >
              <div
                className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                style={{ left: post.published ? '1.5rem' : '0.25rem' }}
              />
            </div>
            <span className="text-sm" style={{ color: '#9A9688' }}>
              {post.published ? 'Közzétéve' : 'Draft (nem publikus)'}
            </span>
          </label>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#C9A96E', color: '#0a0a0a', opacity: saving ? 0.7 : 1 }}
          >
            <Save size={14} />
            {saving ? 'Mentés...' : 'Mentés'}
          </button>
        </div>
      </div>
    </div>
  )
}
