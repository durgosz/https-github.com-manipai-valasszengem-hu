import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

interface Props {
  href: string
  icon: LucideIcon
  label: string
  desc: string
}

export default function AdminModuleCard({ href, icon: Icon, label, desc }: Props) {
  return (
    <Link
      href={href}
      className="p-6 rounded-xl transition-colors duration-200 block hover:[border-color:rgba(201,169,110,0.2)]"
      style={{
        backgroundColor: '#141414',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
        style={{ backgroundColor: 'rgba(201,169,110,0.08)' }}
      >
        <Icon size={18} style={{ color: '#C9A96E' }} />
      </div>
      <div className="font-medium mb-1.5 text-sm" style={{ color: '#F0EDE5' }}>
        {label}
      </div>
      <div className="text-xs leading-relaxed" style={{ color: '#9A9688' }}>
        {desc}
      </div>
    </Link>
  )
}
