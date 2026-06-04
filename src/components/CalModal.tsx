'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import CalEmbed from './CalEmbed'

interface CalModalProps {
  calLink: string
  title: string
  onClose: () => void
}

export default function CalModal({ calLink, title, onClose }: CalModalProps) {
  const elementId = useRef(`cal-modal-${calLink.replace(/[/\\]/g, '-')}-${Date.now()}`)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.88)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl flex flex-col"
        style={{
          backgroundColor: '#111111',
          border: '1px solid rgba(201,169,110,0.15)',
          maxHeight: '92vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid rgba(201,169,110,0.08)' }}
        >
          <span
            className="font-serif"
            style={{ color: '#F0EDE5', fontSize: '1.05rem', fontWeight: 400 }}
          >
            {title}
          </span>
          <button
            onClick={onClose}
            className="transition-colors duration-200"
            style={{ color: '#5A5850', lineHeight: 0 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Cal embed */}
        <div style={{ overflow: 'auto', flex: 1 }}>
          <CalEmbed
            calLink={calLink}
            elementId={elementId.current}
            height={600}
          />
        </div>

        {/* Fallback link */}
        <div
          className="shrink-0 text-center py-3 px-6"
          style={{ borderTop: '1px solid rgba(201,169,110,0.06)' }}
        >
          <a
            href={`https://cal.com/${calLink}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'rgba(201,169,110,0.4)', fontSize: '11px', letterSpacing: '0.05em' }}
          >
            Ha a naptár nem töltődik be, kattints ide →
          </a>
        </div>
      </div>
    </div>
  )
}
