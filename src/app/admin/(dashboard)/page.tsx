import { createAdminClient } from '@/lib/supabase/admin'
import { FileText, ImageIcon, BookOpen, Palette, Sparkles } from 'lucide-react'
import AdminModuleCard from './AdminModuleCard'

export default async function AdminDashboard() {
  let totalPosts = 0
  let publishedPosts = 0

  try {
    const supabase = createAdminClient()
    const [{ count: total }, { count: published }] = await Promise.all([
      supabase.from('posts').select('*', { count: 'exact', head: true }),
      supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('published', true),
    ])
    totalPosts = total ?? 0
    publishedPosts = published ?? 0
  } catch {}

  const modules = [
    {
      href: '/admin/pages',
      icon: FileText,
      label: 'Oldalszerkesztő',
      desc: 'Szövegek szerkesztése és mentése',
    },
    {
      href: '/admin/images',
      icon: ImageIcon,
      label: 'Képkezelő',
      desc: 'Hero, rólam, blog képek feltöltése',
    },
    {
      href: '/admin/blog',
      icon: BookOpen,
      label: 'Blog Studio',
      desc: `${publishedPosts} közzétett · ${totalPosts - publishedPosts} draft`,
    },
    {
      href: '/admin/design',
      icon: Palette,
      label: 'Design beállítások',
      desc: 'Szín, overlay, CTA szöveg',
    },
    {
      href: '/admin/mira',
      icon: Sparkles,
      label: 'Mira Content Agent',
      desc: 'Blog, Facebook, LinkedIn generálás',
    },
  ]

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1
          className="font-serif text-3xl mb-2"
          style={{ color: '#F0EDE5', fontWeight: 300 }}
        >
          Áttekintés
        </h1>
        <p className="text-sm" style={{ color: '#9A9688' }}>
          Üdvözöllek az admin felületen!
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Közzétett cikk', value: publishedPosts },
          { label: 'Draft cikk', value: totalPosts - publishedPosts },
          { label: 'Összes cikk', value: totalPosts },
          { label: 'Modulok', value: 5 },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="p-5 rounded-xl"
            style={{
              backgroundColor: '#141414',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div
              className="text-2xl font-semibold mb-1"
              style={{ color: '#C9A96E' }}
            >
              {value}
            </div>
            <div className="text-xs" style={{ color: '#9A9688' }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map(({ href, icon, label, desc }) => (
          <AdminModuleCard key={href} href={href} icon={icon} label={label} desc={desc} />
        ))}
      </div>
    </div>
  )
}
