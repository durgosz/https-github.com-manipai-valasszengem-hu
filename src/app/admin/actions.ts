'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const BIO_MAIN = `Sokáig azt kerestem, hogy mi hiányzik.

Melyik felismerés, melyik módszer, melyik ember hozza majd el azt, amire vágyom.

Ma már úgy látom, hogy nem egy válasz hiányzott.

Hanem néhány egészen egyszerű dolog, amire valószínűleg mindannyian vágyunk valahol:

Vegyél észre. Válassz engem. Maradj velem.`

const BIO_DETAIL = `Ezek a mondatok sokáig láthatatlanul ott voltak a döntéseim, a kapcsolataim és a kereséseim mögött.

Az elmúlt években sok időt töltöttem önismerettel. Terápiában, csoportokban, képzéseken és olyan beszélgetésekben, amelyek néha többet adtak, mint bármilyen könyv vagy elmélet.

Nem egy nagy felismerés változtatott meg. Hanem egy döntés – hogy megnézem, mi lett volna, ha maradok.

Érdekel, hogy egy ember hogyan érti a saját történetét. Mi foglalkoztatja. Mivel küzd. Mire vágyik. Mi az, ami újra és újra visszatér az életében, hiába próbálja már rég maga mögött hagyni.

A beszélgetések során együtt próbáljuk jobban megérteni azt, ami most fontos.`

const TOPICS = [
  'önismereti kérdések',
  'kapcsolati nehézségek',
  'veszteségek és elutasítások',
  'szégyen és önelfogadás',
  'visszatérő minták az életünkben',
  'identitás és életközepi változások',
  'érzelmekkel való kapcsolatunk',
].join('\n')

const DEMO_PAGES = [
  {
    id: 'home',
    sections: {
      hero_title: 'Ki vagyok én, ha NEM ENGEM választanak?',
      hero_subtitle: 'Nem kell egyedül hordoznod mindent.',
      hero_cta: 'Időpontot kérek',
      about_preview: '',
    },
  },
  {
    id: 'about',
    sections: {
      title: 'Durgó Szulejmán',
      subtitle: 'Egy emberi hang a saját utadon',
      bio_main: BIO_MAIN,
      bio_detail: BIO_DETAIL,
      topics: TOPICS,
      closing: 'Nem kell készülni. Nem kell normálisnak lenni. Nem kell mindent érteni magadról ahhoz, hogy leülj valakivel.',
    },
  },
  {
    id: 'services',
    sections: {},
  },
  {
    id: 'pricing',
    sections: {
      intro: '',
      price_60: '12 000 Ft',
      price_90: '16 000 Ft',
      pricing_cta: 'Időpontot kérek',
      trust_text: '',
    },
  },
  {
    id: 'contact',
    sections: {},
  },
]

const DEMO_DESIGN = {
  id: 1,
  primary_color: '#C9A96E',
  hero_overlay: 40,
  cta_text: 'Időpontot kérek',
}

export async function resetDemoContent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const admin = createAdminClient()

  const { error: pagesError } = await admin.from('pages').upsert(DEMO_PAGES)
  if (pagesError) throw new Error(pagesError.message)

  const { error: designError } = await admin.from('design_settings').upsert([DEMO_DESIGN])
  if (designError) throw new Error(designError.message)

  revalidatePath('/', 'layout')
  revalidatePath('/rolam')
  revalidatePath('/arazas')
  revalidatePath('/szolgaltatasok')
  revalidatePath('/kapcsolat')
}
