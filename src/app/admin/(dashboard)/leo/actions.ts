'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdminSession } from '@/lib/admin-auth'

const VALID_STATUSES = ['NEW', 'CONTACTED', 'MEETING_BOOKED', 'CLIENT', 'CLOSED']

export async function updateLeadStatus(id: string, status: string): Promise<void> {
  await requireAdminSession()
  if (!VALID_STATUSES.includes(status)) throw new Error('Érvénytelen státusz')
  const admin = createAdminClient()
  await admin.from('leads').update({ status }).eq('id', id)
}
