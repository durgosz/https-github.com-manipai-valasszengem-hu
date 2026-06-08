export type PageSections = Record<string, string>

export interface DesignSettings {
  primary_color: string
  hero_overlay: number
  cta_text: string
}

export interface SiteImageMeta {
  url: string
  position_x: string
  position_y: string
  object_fit: string
  alt_text: string
  zoom: number
}
export type SiteImages = Record<string, SiteImageMeta>

const REVALIDATE = 60

const DESIGN_DEFAULTS: DesignSettings = {
  primary_color: '#C9A96E',
  hero_overlay: 40,
  cta_text: 'Időpontfoglalás',
}

function getConfig() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NODE_ENV === 'production') {
    console.warn('[cms] SUPABASE_SERVICE_ROLE_KEY hiányzik – anon kulcsot használ (korlátozott RLS)')
  }
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    key,
  }
}

export async function getPageSections(pageId: string): Promise<PageSections> {
  const { url, key } = getConfig()
  if (!url || !key) return {}
  try {
    const res = await fetch(
      `${url}/rest/v1/pages?id=eq.${pageId}&select=sections&limit=1`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        next: { revalidate: REVALIDATE },
      }
    )
    if (!res.ok) return {}
    const data = await res.json()
    return (data?.[0]?.sections as PageSections) ?? {}
  } catch {
    return {}
  }
}

export async function getDesignSettings(): Promise<DesignSettings> {
  const { url, key } = getConfig()
  if (!url || !key) return DESIGN_DEFAULTS
  try {
    const res = await fetch(
      `${url}/rest/v1/design_settings?id=eq.1&limit=1`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        next: { revalidate: REVALIDATE },
      }
    )
    if (!res.ok) return DESIGN_DEFAULTS
    const data = await res.json()
    const row = data?.[0]
    if (!row) return DESIGN_DEFAULTS
    return {
      primary_color: row.primary_color ?? DESIGN_DEFAULTS.primary_color,
      hero_overlay: row.hero_overlay ?? DESIGN_DEFAULTS.hero_overlay,
      cta_text: row.cta_text ?? DESIGN_DEFAULTS.cta_text,
    }
  } catch {
    return DESIGN_DEFAULTS
  }
}

export async function checkSystemHealth(): Promise<boolean> {
  const { url, key } = getConfig()
  if (!url || !key) return false
  try {
    const res = await fetch(
      `${url}/rest/v1/design_settings?id=eq.1&select=id&limit=1`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: 'no-store',
      }
    )
    return res.ok
  } catch {
    return false
  }
}

function toSiteImages(
  data: { id: string; public_url: string; position_x?: string | null; position_y?: string | null; object_fit?: string | null; alt_text?: string | null; zoom?: number | null }[]
): SiteImages {
  return Object.fromEntries(
    data.map(({ id, public_url, position_x, position_y, object_fit, alt_text, zoom }) => [
      id,
      {
        url: public_url,
        position_x: position_x ?? '50%',
        position_y: position_y ?? '50%',
        object_fit: object_fit ?? 'cover',
        alt_text: alt_text ?? '',
        zoom: zoom ?? 100,
      },
    ])
  )
}

export async function getSiteImages(): Promise<SiteImages> {
  const { url, key } = getConfig()
  if (!url || !key) return {}
  const headers = { apikey: key, Authorization: `Bearer ${key}` }
  try {
    const res = await fetch(
      `${url}/rest/v1/site_images?select=id,public_url,position_x,position_y,object_fit,alt_text,zoom`,
      // cache: 'no-store' – a fetch-szintű cache-t kikapcsoljuk.
      // Az oldal ISR (revalidate = 60) + revalidatePath vezérli a render-t,
      // nem a fetch cache, amely Next.js 16-ban megváltozott API-val nem invalidálódik megbízhatóan.
      { headers, cache: 'no-store' }
    )
    if (res.ok) {
      const data = await res.json()
      const aboutRow = data.find((r: { id: string }) => r.id === 'about')
      console.log('[getSiteImages] OK – about.public_url:', aboutRow?.public_url ?? '(nincs)')
      return toSiteImages(data)
    }
    // Fallback: ha az oszlopok még nem léteznek az adatbázisban
    console.warn('[getSiteImages] teljes lekérdezés sikertelen (HTTP', res.status, ') – fallback: csak public_url')
    const fallback = await fetch(
      `${url}/rest/v1/site_images?select=id,public_url`,
      { headers, cache: 'no-store' }
    )
    if (!fallback.ok) {
      console.error('[getSiteImages] fallback is sikertelen (HTTP', fallback.status, ')')
      return {}
    }
    const fallbackData = await fallback.json()
    const aboutFallback = fallbackData.find((r: { id: string }) => r.id === 'about')
    console.warn('[getSiteImages] fallback OK – about.public_url:', aboutFallback?.public_url ?? '(nincs)')
    return toSiteImages(fallbackData)
  } catch (e) {
    console.error('[getSiteImages] kivétel:', e)
    return {}
  }
}
