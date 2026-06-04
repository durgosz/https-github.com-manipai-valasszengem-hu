'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError('Hibás email vagy jelszó')
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div
            className="font-serif text-3xl mb-2"
            style={{ color: '#C9A96E', fontWeight: 300 }}
          >
            válassz engem
          </div>
          <p className="text-sm" style={{ color: '#9A9688' }}>
            Admin bejelentkezés
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-2xl p-8 space-y-5"
          style={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {error && (
            <div
              className="rounded-lg p-3 text-sm"
              style={{
                backgroundColor: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#f87171',
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm mb-2" style={{ color: '#9A9688' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
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
              Jelszó
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
              style={{
                backgroundColor: '#1e1e1e',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#F0EDE5',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: '#C9A96E',
              color: '#0a0a0a',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Bejelentkezés...' : 'Bejelentkezés'}
          </button>
        </form>
      </div>
    </div>
  )
}
