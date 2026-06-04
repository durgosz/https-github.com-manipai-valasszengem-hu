'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Globe, FileText } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  published: boolean
  created_at: string
  category: string
}

export default function BlogStudio() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = createClient()

  async function loadPosts() {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('posts')
        .select('id, title, slug, published, created_at, category')
        .order('created_at', { ascending: false })
      setPosts(data ?? [])
    } catch {
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Biztosan törlöd ezt a cikket?')) return
    setDeleting(id)
    try {
      await supabase.from('posts').delete().eq('id', id)
      setPosts((prev) => prev.filter((p) => p.id !== id))
    } finally {
      setDeleting(null)
    }
  }

  async function togglePublish(post: Post) {
    const { error } = await supabase
      .from('posts')
      .update({ published: !post.published, updated_at: new Date().toISOString() })
      .eq('id', post.id)
    if (!error) {
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, published: !p.published } : p))
      )
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="font-serif text-3xl mb-2"
            style={{ color: '#F0EDE5', fontWeight: 300 }}
          >
            Blog Studio
          </h1>
          <p className="text-sm" style={{ color: '#9A9688' }}>
            Cikkek írása, szerkesztése és közzététele
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium"
          style={{ backgroundColor: '#C9A96E', color: '#0a0a0a' }}
        >
          <Plus size={15} />
          Új cikk
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded-xl animate-pulse"
              style={{ backgroundColor: '#141414' }}
            />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div
          className="rounded-xl p-12 text-center"
          style={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <FileText size={32} className="mx-auto mb-4" style={{ color: '#5A5850' }} />
          <p className="text-sm mb-4" style={{ color: '#9A9688' }}>
            Még nincs cikk. Írj az elsőt!
          </p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#C9A96E', color: '#0a0a0a' }}
          >
            <Plus size={14} />
            Új cikk
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 p-4 rounded-xl"
              style={{
                backgroundColor: '#141414',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="font-medium text-sm truncate"
                    style={{ color: '#F0EDE5' }}
                  >
                    {post.title}
                  </span>
                  <span
                    className="shrink-0 text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: post.published
                        ? 'rgba(34,197,94,0.1)'
                        : 'rgba(255,255,255,0.05)',
                      color: post.published ? '#4ade80' : '#5A5850',
                      border: post.published
                        ? '1px solid rgba(34,197,94,0.2)'
                        : '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {post.published ? 'Közzétett' : 'Draft'}
                  </span>
                </div>
                <div className="text-xs" style={{ color: '#5A5850' }}>
                  {post.category} · {formatDate(post.created_at)}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => togglePublish(post)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all"
                  style={{
                    color: post.published ? '#9A9688' : '#C9A96E',
                    border: `1px solid ${post.published ? 'rgba(255,255,255,0.08)' : 'rgba(201,169,110,0.3)'}`,
                  }}
                  title={post.published ? 'Visszavonás' : 'Közzététel'}
                >
                  <Globe size={11} />
                  {post.published ? 'Visszavon' : 'Közzétesz'}
                </button>

                <Link
                  href={`/admin/blog/${post.id}`}
                  className="p-2 rounded-lg transition-all"
                  style={{ color: '#9A9688' }}
                  title="Szerkesztés"
                >
                  <Pencil size={14} />
                </Link>

                <button
                  onClick={() => handleDelete(post.id)}
                  disabled={deleting === post.id}
                  className="p-2 rounded-lg transition-all hover:text-red-400"
                  style={{ color: '#5A5850' }}
                  title="Törlés"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
