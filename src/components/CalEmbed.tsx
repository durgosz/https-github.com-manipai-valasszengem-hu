'use client'

import { useEffect, useRef, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Cal?: any
  }
}

interface CalEmbedProps {
  calLink: string
  elementId: string
  height?: number
}

export default function CalEmbed({ calLink, elementId, height = 700 }: CalEmbedProps) {
  const initialized = useRef(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Official Cal.com bootloader — queues commands until embed.js loads.
    // Uses `|| existing` so multiple embeds share one Cal instance.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(function (C: any, A: string, L: string) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function p(a: any, ar: any) { a.q.push(ar) }
      C.Cal = C.Cal || function () {
        const cal = C.Cal
        // eslint-disable-next-line prefer-rest-params
        const ar = arguments
        if (!cal.loaded) {
          cal.ns = {}
          cal.q = cal.q || []
          const s = document.createElement('script')
          s.src = A
          s.async = true
          s.onerror = function () { setFailed(true) }
          document.head.appendChild(s)
          cal.loaded = true
        }
        if (ar[0] === L) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const api: any = function () { p(api, arguments) }
          api.q = []
          const ns = ar[1]
          if (typeof ns === 'string') {
            cal.ns[ns] = cal.ns[ns] || api
            p(cal.ns[ns], ar)
            p(cal, [L, ns, api])
          } else {
            p(cal, ar)
          }
          return
        }
        p(cal, ar)
      }
    })(window, 'https://app.cal.com/embed/embed.js', 'init')

    const Cal = window.Cal
    Cal('init', { origin: 'https://cal.com' })
    Cal('inline', {
      elementOrSelector: `#${elementId}`,
      calLink,
      config: { layout: 'month_view', theme: 'dark' },
    })
    Cal('ui', {
      theme: 'dark',
      styles: { branding: { brandColor: '#C9A96E' } },
      hideEventTypeDetails: true,
      layout: 'month_view',
    })
  }, [calLink, elementId])

  if (failed) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 text-center p-8"
        style={{ height: `${height}px`, backgroundColor: '#111111' }}
      >
        <p className="text-sm" style={{ color: '#9A9688' }}>
          A naptár betöltése nem sikerült.
        </p>
        <a
          href={`https://cal.com/${calLink}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline"
          style={{ color: '#C9A96E' }}
        >
          Nyisd meg közvetlenül →
        </a>
      </div>
    )
  }

  return (
    <div
      id={elementId}
      style={{ width: '100%', height: `${height}px`, overflow: 'hidden' }}
    />
  )
}
