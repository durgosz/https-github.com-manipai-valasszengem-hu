'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  FileText,
  ImageIcon,
  BookOpen,
  Palette,
  Sparkles,
  LayoutGrid,
  LogOut,
  FlaskConical,
} from 'lucide-react'

const navItems = [
  { href: '/admin', icon: LayoutGrid, label: 'Áttekintés', short: 'Kezdő', exact: true },
  { href: '/admin/pages', icon: FileText, label: 'Oldalak', short: 'Oldalak', exact: false },
  { href: '/admin/images', icon: ImageIcon, label: 'Képek', short: 'Képek', exact: false },
  { href: '/admin/blog', icon: BookOpen, label: 'Blog', short: 'Blog', exact: false },
  { href: '/admin/design', icon: Palette, label: 'Design', short: 'Design', exact: false },
  { href: '/admin/mira', icon: Sparkles, label: 'Mira AI', short: 'Mira', exact: false },
  { href: '/admin/smoke-test', icon: FlaskConical, label: 'Smoke Test', short: 'Test', exact: false },
]

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-60 z-40"
        style={{ backgroundColor: '#0d0d0d', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="p-6 mb-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="font-serif text-lg" style={{ color: '#C9A96E' }}>
            válassz engem
          </div>
          <div className="text-xs mt-0.5" style={{ color: '#5A5850' }}>
            Admin felület
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, icon: Icon, label, exact }) => {
            const active = isActive(href, exact)
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
                style={{
                  color: active ? '#C9A96E' : '#9A9688',
                  backgroundColor: active ? 'rgba(201,169,110,0.08)' : 'transparent',
                  borderLeft: `2px solid ${active ? '#C9A96E' : 'transparent'}`,
                }}
              >
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div
            className="text-xs mb-3 px-3 truncate"
            style={{ color: '#5A5850' }}
            title={userEmail}
          >
            {userEmail}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full transition-all hover:bg-red-500/10 hover:text-red-400"
            style={{ color: '#9A9688' }}
          >
            <LogOut size={16} />
            Kijelentkezés
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14"
        style={{ backgroundColor: '#0d0d0d', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="font-serif text-base" style={{ color: '#C9A96E' }}>
          válassz engem
        </span>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg"
          style={{ color: '#9A9688' }}
        >
          <LogOut size={16} />
        </button>
      </header>

      {/* Mobile Bottom Nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-1 py-2"
        style={{ backgroundColor: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        {navItems.map(({ href, icon: Icon, short, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg min-w-0"
              style={{ color: active ? '#C9A96E' : '#5A5850' }}
            >
              <Icon size={18} />
              <span className="text-[9px] truncate">{short}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
