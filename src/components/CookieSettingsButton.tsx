'use client'

export default function CookieSettingsButton() {
  return (
    <button
      onClick={() => {
        localStorage.removeItem('cookie-consent')
        window.location.reload()
      }}
      className="text-sm transition-colors duration-200 text-left"
      style={{ color: '#5A5850' }}
    >
      Cookie beállítások
    </button>
  )
}
