import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { readFileSync } from 'fs'
import { join } from 'path'
import { checkAdminApiAuth } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

type CmdResult  = { stdout: string; stderr: string; ok: boolean; ms: number }
type LintStatus = 'pass' | 'fail' | 'skipped'
type Summary    = 'READY_TO_DEPLOY' | 'BLOCKED' | 'WARNING'

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

function hasLintScript(): boolean {
  try {
    const pkg = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf-8')
    ) as { scripts?: Record<string, string> }
    return !!pkg.scripts?.lint
  } catch {
    return false
  }
}

function computeSummary(typecheckOk: boolean, lintStatus: LintStatus, buildOk: boolean): Summary {
  if (!typecheckOk || !buildOk) return 'BLOCKED'
  if (lintStatus === 'fail' || lintStatus === 'skipped') return 'WARNING'
  return 'READY_TO_DEPLOY'
}

export async function POST() {
  const authError = await checkAdminApiAuth()
  if (authError) return authError

  const total = Date.now()

  const typecheck = await runCmd('npm run typecheck')

  let lint: CmdResult
  let lintStatus: LintStatus
  if (hasLintScript()) {
    lint = await runCmd('npm run lint')
    lintStatus = lint.ok ? 'pass' : 'fail'
  } else {
    lint = { stdout: '', stderr: 'lint nem konfigurált – npm run lint hiányzik', ok: false, ms: 0 }
    lintStatus = 'skipped'
  }

  const build = await runCmd('npm run build')

  const summary = computeSummary(typecheck.ok, lintStatus, build.ok)
  const duration_ms = Date.now() - total

  try {
    const admin = createAdminClient()
    await admin.from('qa_runs').insert({
      status:           summary === 'BLOCKED' ? 'fail' : 'pass',
      typecheck_status: typecheck.ok ? 'pass' : 'fail',
      lint_status:      lintStatus,
      build_status:     build.ok ? 'pass' : 'fail',
      summary,
      stdout: [
        `[typecheck]\n${typecheck.stdout}`,
        `[lint]\n${lintStatus === 'skipped' ? '(skipped)' : lint.stdout}`,
        `[build]\n${build.stdout}`,
      ].join('\n\n'),
      stderr: [
        `[typecheck]\n${typecheck.stderr}`,
        `[lint]\n${lintStatus === 'skipped' ? lint.stderr : lint.stderr}`,
        `[build]\n${build.stderr}`,
      ].join('\n\n'),
      duration_ms,
    })
  } catch {
    // DB mentés hiba nem akadályozza az eredmény visszaadását
  }

  return NextResponse.json({ summary, duration_ms, typecheck, lint, lintStatus, build })
}
