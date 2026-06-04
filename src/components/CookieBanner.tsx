'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      style={{ backgroundColor: 'rgba(10,10,10,0.97)', borderTop: '1px solid rgba(201,169,110,0.12)' }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm leading-relaxed" style={{ color: '#9A9688' }}>
            Ez a weboldal sütiket (cookie-kat) használ az alapvető működéshez. Az oldal böngészésével
            hozzájárulsz a sütik használatához.{' '}
            <Link href="/cookie" className="underline transition-colors" style={{ color: '#C9A96E' }}>
              Cookie tájékoztató
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={decline}
            className="text-xs px-4 py-2 tracking-wider transition-colors"
            style={{ color: '#5A5850', letterSpacing: '0.06em' }}
          >
            Elutasítom
          </button>
          <button
            onClick={accept}
            className="text-xs px-5 py-2 tracking-wider transition-all duration-200"
            style={{
              border: '1px solid rgba(201,169,110,0.4)',
              color: '#C9A96E',
              letterSpacing: '0.08em',
              backgroundColor: 'rgba(201,169,110,0.06)',
            }}
          >
            Elfogadom
          </button>
          <button
            onClick={decline}
            className="p-1 transition-colors"
            style={{ color: '#5A5850' }}
            aria-label="Bezárás"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
