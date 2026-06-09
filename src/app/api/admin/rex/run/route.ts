import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { checkAdminApiAuth } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

type CmdResult = { stdout: string; stderr: string; ok: boolean; ms: number }

function runCmd(cmd: string): Promise<CmdResult> {
  const t = Date.now()
  return new Promise((resolve) => {
    exec(
      cmd,
      {
        cwd: process.cwd(),
        timeout: 300_000,
        maxBuffer: 10 * 1024 * 1024,
        env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
      },
      (err, stdout, stderr) => resolve({ stdout, stderr, ok: !err, ms: Date.now() - t })
    )
  })
}

export async function POST() {
  const authError = await checkAdminApiAuth()
  if (authError) return authError

  const total = Date.now()

  const typecheck = await runCmd('npm run typecheck')
  const build = await runCmd('npm run build')

  const status = typecheck.ok && build.ok ? 'pass' : 'fail'
  const duration_ms = Date.now() - total

  try {
    const admin = createAdminClient()
    await admin.from('qa_runs').insert({
      status,
      typecheck_status: typecheck.ok ? 'pass' : 'fail',
      build_status: build.ok ? 'pass' : 'fail',
      stdout: `[typecheck]\n${typecheck.stdout}\n\n[build]\n${build.stdout}`,
      stderr: `[typecheck]\n${typecheck.stderr}\n\n[build]\n${build.stderr}`,
      duration_ms,
    })
  } catch {
    // DB mentés hiba nem akadályozza az eredmény visszaadását
  }

  return NextResponse.json({ status, duration_ms, typecheck, build })
}
