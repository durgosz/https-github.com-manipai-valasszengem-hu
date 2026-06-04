import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <AdminSidebar userEmail={user.email ?? ''} />
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen pt-14 md:pt-0 pb-20 md:pb-0">
        {children}
      </div>
    </div>
  )
}
