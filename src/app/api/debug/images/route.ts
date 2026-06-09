import { NextResponse } from 'next/server'
import { checkAdminApiAuth } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'

// Ideiglenes production debug endpoint – törölhető az éles diagnózis után.
// Csak admin session-nel érhető el (checkAdminApiAuth).
export async function GET() {
  const authError = await checkAdminApiAuth()
  if (authError) return authError

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? null
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
  const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  let derivedHostname: string | null = null
  if (supabaseUrl) {
    try { derivedHostname = new URL(supabaseUrl).hostname } catch {}
  }

  // Raw DB query – megkerüli a getSiteImages() ISR cache-t
  let dbRow: Record<string, unknown> | null = null
  let dbError: string | null = null
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('site_images')
      .select('id, public_url, position_x, position_y, object_fit, alt_text, zoom, updated_at')
      .eq('id', 'about')
      .single()
    dbRow = data ?? null
    dbError = error?.message ?? null
  } catch (e) {
    dbError = e instanceof Error ? e.message : 'ismeretlen hiba'
  }

  // Ellenőrzi, hogy a tárolt URL valóban elérhető-e (HEAD request)
  let urlReachable: boolean | null = null
  let urlStatus: number | null = null
  if (dbRow?.public_url) {
    try {
      const r = await fetch(dbRow.public_url as string, { method: 'HEAD', cache: 'no-store' })
      urlReachable = r.ok
      urlStatus = r.status
    } catch {
      urlReachable = false
    }
  }

  return NextResponse.json({
    env: {
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
      derivedHostname,
      hasServiceKey,
      hasAnonKey,
    },
    remotePatternExpected: derivedHostname
      ? `https://${derivedHostname}/storage/v1/object/public/**`
      : null,
    siteImages_about: {
      dbRow,
      dbError,
      urlReachable,
      urlStatus,
    },
  })
}
