'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdminSession } from '@/lib/admin-auth'

const VALID_STATUSES   = ['TODO', 'IN_PROGRESS', 'DONE']
const VALID_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

export async function createTask(formData: FormData): Promise<void> {
  await requireAdminSession()

  const title = (formData.get('title') as string | null)?.trim()
  if (!title) throw new Error('Cím kötelező')

  const admin = createAdminClient()
  await admin.from('tasks').insert({
    title,
    description:    (formData.get('description') as string | null)?.trim() || null,
    assigned_agent: (formData.get('assigned_agent') as string | null) || null,
    priority:       (formData.get('priority') as string | null)        || 'MEDIUM',
    due_date:       (formData.get('due_date') as string | null)        || null,
    status: 'TODO',
  })
}

export async function updateTaskStatus(id: string, status: string): Promise<void> {
  await requireAdminSession()
  if (!VALID_STATUSES.includes(status)) throw new Error('Érvénytelen státusz')
  const admin = createAdminClient()
  await admin.from('tasks').update({ status }).eq('id', id)
}

export async function updateTaskPriority(id: string, priority: string): Promise<void> {
  await requireAdminSession()
  if (!VALID_PRIORITIES.includes(priority)) throw new Error('Érvénytelen prioritás')
  const admin = createAdminClient()
  await admin.from('tasks').update({ priority }).eq('id', id)
}
