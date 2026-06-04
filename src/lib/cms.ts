export type PageSections = Record<string, string>

export interface DesignSettings {
  primary_color: string
  hero_overlay: number
  cta_text: string
}

export type SiteImages = Record<string, string>

const REVALIDATE = 60

const DESIGN_DEFAULTS: DesignSettings = {
  primary_color: '#C9A96E',
  hero_overlay: 40,
  cta_text: 'Időpontfoglalás',
}

function getConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
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

export async function getSiteImages(): Promise<SiteImages> {
  const { url, key } = getConfig()
  if (!url || !key) return {}
  try {
    const res = await fetch(
      `${url}/rest/v1/site_images?select=id,public_url`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        next: { revalidate: REVALIDATE },
      }
    )
    if (!res.ok) return {}
    const data: { id: string; public_url: string }[] = await res.json()
    return Object.fromEntries(data.map(({ id, public_url }) => [id, public_url]))
  } catch {
    return {}
  }
}
