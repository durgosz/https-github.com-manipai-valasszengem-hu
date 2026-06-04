import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { topic } = await request.json()

  if (!topic?.trim()) {
    return NextResponse.json({ error: 'Téma kötelező' }, { status: 400 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY nincs beállítva' },
      { status: 500 }
    )
  }

  const prompt = `Te Mira vagy, Szulejmán önismereti és mentálhigiénés tanácsadó weboldalának (valasszengem.hu) tartalom-generáló asszisztense.
A weboldal hangvétele: mély, személyes, reflektív, nem diagnosztizáló, hanem kíváncsiságot és önismeretet ösztönző.
Az olvasók: emberek, akik önismeretükkel, kapcsolataikkal vagy belső elakadásaikkal foglalkoznak.

A megadott témáról generálj három tartalmat KIZÁRÓLAG MAGYAR NYELVEN:

1. BLOG BEJEGYZÉS (400-550 szó): Elgondolkodtató, reflektív esszé. Első személyű hangvétel lehetséges. Nincs lista, nincs felsorolás. Folyó szöveg, erős nyitómondattal. Ne legyen terápiás tanácsadás.

2. FACEBOOK POSZT (120-160 szó): Személyes, érzékletes, bevonó. Emójik megengedett, de mértékkel. Kérdéssel vagy gondolatébresztővel záruljon.

3. LINKEDIN POSZT (180-240 szó): Szakmai, de személyes. A mentálhigiéné és önismeret értékéről szól szakemberként. Nincs hashtag-erdő – max 3.

Téma: "${topic}"

Válaszolj KIZÁRÓLAG az alábbi JSON formátumban, más szöveg nélkül:
{
  "blog": "...",
  "facebook": "...",
  "linkedin": "..."
}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 3000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error?.message ?? 'API hiba')
    }

    const data = await response.json()
    const text = data.content?.[0]?.text ?? ''

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Nem sikerült a generált tartalmat feldolgozni')
    }

    const parsed = JSON.parse(jsonMatch[0])

    if (!parsed.blog || !parsed.facebook || !parsed.linkedin) {
      throw new Error('Hiányos generált tartalom')
    }

    return NextResponse.json(parsed)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Generálási hiba' },
      { status: 500 }
    )
  }
}
