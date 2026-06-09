import { createAdminClient } from '@/lib/supabase/admin'
import { ClipboardList } from 'lucide-react'
import NewTaskForm from './NewTaskForm'
import TaskControls from './TaskControls'

export const dynamic = 'force-dynamic'

type Task = {
  id:             string
  created_at:     string
  title:          string
  description:    string | null
  assigned_agent: string | null
  status:         string
  priority:       string
  due_date:       string | null
}

const AGENT_COLORS: Record<string, string> = {
  Zara: '#C9A96E',
  Rex:  '#60a5fa',
  Leo:  '#4ade80',
  Mira: '#a78bfa',
  Mike: '#fb923c',
  Sage: '#2dd4bf',
}

async function getTasks(): Promise<Task[]> {
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from('tasks')
      .select('id, created_at, title, description, assigned_agent, status, priority, due_date')
      .order('created_at', { ascending: false })
    return (data as Task[]) ?? []
  } catch {
    return []
  }
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="p-5 rounded-xl"
      style={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="text-2xl font-semibold mb-1" style={{ color }}>{value}</div>
      <div className="text-xs" style={{ color: '#9A9688' }}>{label}</div>
    </div>
  )
}

export default async function TasksPage() {
  const tasks = await getTasks()

  const stats = {
    total:      tasks.length,
    open:       tasks.filter((t) => t.status === 'TODO').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    done:       tasks.filter((t) => t.status === 'DONE').length,
  }

  return (
    <div className="p-6 max-w-5xl">
      {/* Fejléc */}
      <div className="mb-8 flex items-center gap-3">
        <ClipboardList size={22} style={{ color: '#C9A96E' }} />
        <div>
          <h1 className="font-serif text-2xl mb-0.5" style={{ color: '#F0EDE5' }}>
            Zara Tasks
          </h1>
          <p className="text-sm" style={{ color: '#5A5850' }}>
            Ügynök feladatok és priorizálás
          </p>
        </div>
      </div>

      {/* Stat kártyák */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Összes"      value={stats.total}      color="#C9A96E" />
        <StatCard label="Teendő"      value={stats.open}       color="#60a5fa" />
        <StatCard label="Folyamatban" value={stats.inProgress} color="#fbbf24" />
        <StatCard label="Kész"        value={stats.done}       color="#4ade80" />
      </div>

      {/* Új feladat */}
      <div className="mb-6">
        <NewTaskForm />
      </div>

      {/* Lista */}
      {tasks.length === 0 ? (
        <div
          className="p-8 rounded-xl text-center"
          style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <ClipboardList size={32} className="mx-auto mb-3" style={{ color: '#5A5850' }} />
          <p className="text-sm" style={{ color: '#5A5850' }}>
            Még nincs feladat. Hozz létre egyet az „Új feladat" gombbal.
          </p>
        </div>
      ) : (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Fejléc sor */}
          <div
            className="hidden md:grid px-4 py-2.5 text-xs tracking-widest uppercase"
            style={{
              gridTemplateColumns: '1fr 80px 1fr 70px 70px',
              backgroundColor: '#141414',
              color: '#5A5850',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span>Cím</span>
            <span>Agent</span>
            <span>Státusz / Prioritás</span>
            <span>Határidő</span>
            <span>Létrehozva</span>
          </div>

          {/* Sorok */}
          {tasks.map((task, i) => {
            const agentColor = AGENT_COLORS[task.assigned_agent ?? ''] ?? '#9A9688'
            const overdue    = task.due_date
              && task.status !== 'DONE'
              && new Date(task.due_date) < new Date()

            return (
              <div
                key={task.id}
                className="grid px-4 py-3.5 items-start gap-3"
                style={{
                  gridTemplateColumns: '1fr',
                  backgroundColor:     i % 2 === 0 ? '#111' : '#0d0d0d',
                  borderBottom:        '1px solid rgba(255,255,255,0.04)',
                }}
              >
                {/* Mobile: stack teljesen */}
                <div className="md:hidden space-y-2">
                  <p
                    className="text-sm font-medium"
                    style={{
                      color:          task.status === 'DONE' ? '#5A5850' : '#F0EDE5',
                      textDecoration: task.status === 'DONE' ? 'line-through' : 'none',
                    }}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs" style={{ color: '#5A5850' }}>{task.description}</p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    {task.assigned_agent && (
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ backgroundColor: `${agentColor}18`, color: agentColor, border: `1px solid ${agentColor}30` }}
                      >
                        {task.assigned_agent}
                      </span>
                    )}
                    <TaskControls id={task.id} currentStatus={task.status} currentPriority={task.priority} />
                  </div>
                  <div className="flex gap-4 text-xs" style={{ color: '#5A5850' }}>
                    {task.due_date && (
                      <span style={{ color: overdue ? '#f87171' : '#5A5850' }}>
                        Határidő: {new Date(task.due_date).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                    <span>{new Date(task.created_at).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>

                {/* Desktop: grid */}
                <div
                  className="hidden md:grid items-start gap-3"
                  style={{ gridTemplateColumns: '1fr 80px 1fr 70px 70px' }}
                >
                  {/* Cím */}
                  <div className="min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{
                        color:          task.status === 'DONE' ? '#5A5850' : '#F0EDE5',
                        textDecoration: task.status === 'DONE' ? 'line-through' : 'none',
                      }}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs mt-0.5 truncate" style={{ color: '#5A5850' }}>
                        {task.description}
                      </p>
                    )}
                  </div>

                  {/* Agent */}
                  <div>
                    {task.assigned_agent ? (
                      <span
                        className="text-xs px-2 py-0.5 rounded font-medium whitespace-nowrap"
                        style={{ backgroundColor: `${agentColor}18`, color: agentColor, border: `1px solid ${agentColor}30` }}
                      >
                        {task.assigned_agent}
                      </span>
                    ) : (
                      <span className="text-xs" style={{ color: '#5A5850' }}>—</span>
                    )}
                  </div>

                  {/* Státusz + Prioritás */}
                  <TaskControls id={task.id} currentStatus={task.status} currentPriority={task.priority} />

                  {/* Határidő */}
                  <div className="text-xs whitespace-nowrap" style={{ color: overdue ? '#f87171' : '#5A5850' }}>
                    {task.due_date
                      ? new Date(task.due_date).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' })
                      : '—'}
                  </div>

                  {/* Létrehozva */}
                  <div className="text-xs whitespace-nowrap" style={{ color: '#5A5850' }}>
                    {new Date(task.created_at).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
