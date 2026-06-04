import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

function confirmationHtml(name: string) {
  return `<!DOCTYPE html>
<html lang="hu">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Georgia,'Times New Roman',serif;">
<div style="max-width:560px;margin:0 auto;padding:48px 24px;">
  <div style="text-align:center;margin-bottom:40px;padding-bottom:32px;border-bottom:1px solid rgba(201,169,110,0.15)">
    <span style="font-size:20px;font-weight:300;letter-spacing:0.22em;color:#C9A96E;text-transform:uppercase;text-decoration:none">
      válassz engem
    </span>
  </div>
  <p style="font-size:22px;font-weight:300;color:#F0EDE5;margin:0 0 20px;line-height:1.4">
    Kedves ${name},
  </p>
  <p style="color:#9A9688;line-height:1.85;margin:0 0 16px;font-size:15px">
    Köszönöm, hogy felvetted velem a kapcsolatot. Üzenetedet megkaptam, és hamarosan &ndash; általában <strong style="color:#D0CCC0;font-weight:400">1-2 munkanapon belül</strong> &ndash; válaszolok.
  </p>
  <p style="color:#9A9688;line-height:1.85;margin:0 0 16px;font-size:15px">
    Az első egyeztetés díjmentes és kötelezettségmentes. Addig is, ha sürgős a kérdésed, írj közvetlenül erre az e-mail-re, vagy látogass el a weboldalra.
  </p>
  <div style="margin:32px 0;padding:24px;border-left:1px solid rgba(201,169,110,0.3);background:rgba(201,169,110,0.03)">
    <p style="color:#C9A96E;font-style:italic;font-size:16px;font-weight:300;margin:0;line-height:1.6">
      „Nem arra vagyok kíváncsi, mit kellett volna tenned.<br>Arra vagyok kíváncsi, mi történik most benned."
    </p>
  </div>
  <p style="color:#9A9688;line-height:1.85;margin:0 0 32px;font-size:15px">
    Hamarosan visszajelzek.
  </p>
  <div style="border-top:1px solid rgba(201,169,110,0.08);padding-top:32px;margin-top:16px">
    <p style="color:#5A5850;font-size:12px;margin:0 0 6px">
      <strong style="color:#9A9688;font-weight:400">válassz engem</strong>
    </p>
    <p style="color:#5A5850;font-size:12px;margin:0 0 4px">
      hello@valasszengem.hu
    </p>
    <p style="color:#5A5850;font-size:12px;margin:0">
      <a href="https://valasszengem.hu" style="color:#C9A96E;text-decoration:none">valasszengem.hu</a>
    </p>
  </div>
  <p style="color:#3A3A32;font-size:10px;margin:32px 0 0;line-height:1.7">
    Ez az e-mail azért kaptad, mert a valasszengem.hu weboldalon keresztül üzenetet küldtél.
    Az önismereti és mentálhigiénés szemléletű beszélgetések nem helyettesítik az orvosi,
    pszichológiai vagy pszichoterápiás ellátást.
  </p>
</div>
</body>
</html>`
}

function adminNotificationHtml(data: {
  name: string
  email: string
  phone?: string
  message?: string
  preferredTime?: string
}) {
  return `<!DOCTYPE html>
<html lang="hu">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Georgia,serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 24px;">
  <div style="margin-bottom:32px;padding-bottom:24px;border-bottom:1px solid rgba(201,169,110,0.15)">
    <span style="font-size:18px;font-weight:300;letter-spacing:0.2em;color:#C9A96E;text-transform:uppercase">
      Új kapcsolatfelvétel
    </span>
  </div>
  <table style="width:100%;border-collapse:collapse">
    ${[
      ['Név', data.name],
      ['E-mail', `<a href="mailto:${data.email}" style="color:#C9A96E">${data.email}</a>`],
      ['Telefon', data.phone || '—'],
      ['Kívánt időpont', data.preferredTime || '—'],
      ['Üzenet', data.message || '—'],
    ].map(([label, value]) => `
    <tr>
      <td style="padding:10px 0;color:#5A5850;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;vertical-align:top;width:130px">${label}</td>
      <td style="padding:10px 0;color:#F0EDE5;font-size:14px;line-height:1.6;border-bottom:1px solid rgba(255,255,255,0.04)">${value}</td>
    </tr>`).join('')}
  </table>
</div>
</body>
</html>`
}

export async function POST(request: NextRequest) {
  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Érvénytelen kérés' }, { status: 400 })
  }

  const { name, email, phone, message, preferredTime } = body

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Hiányzó kötelező mezők' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Érvénytelen e-mail cím' }, { status: 400 })
  }

  // Save to Supabase
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    const { error } = await supabase.from('connections').insert([{
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      message: message.trim(),
      preferred_time: preferredTime?.trim() || null,
    }])

    if (error) {
      console.error('[Supabase error]', error)
    }
  } catch (err) {
    console.error('[Supabase unreachable]', err)
  }

  // Send lead to CentralAI CRM
  try {
    await fetch('https://centralai-liard.vercel.app/api/webhook/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': '7ksmDl3qDLl3X-8F41qQGNaHHxvdrrj6',
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || '',
        message: message.trim(),
      }),
    })
  } catch (err) {
    console.error('[CentralAI webhook error]', err)
  }

  // Send emails via Resend
  try {
    const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
    await Promise.all([
      resend.emails.send({
        from: 'válassz engem <hello@valasszengem.hu>',
        to: [email.trim()],
        subject: 'Köszönöm a megkeresésed – válassz engem',
        html: confirmationHtml(name.trim()),
      }),
      resend.emails.send({
        from: 'válassz engem <hello@valasszengem.hu>',
        to: ['sz.durgo@gmail.com'],
        replyTo: email.trim(),
        subject: `Új érdeklődő – ${name.trim()}`,
        html: adminNotificationHtml({ name, email, phone, message, preferredTime }),
      }),
    ])
  } catch (err) {
    console.error('[Resend error]', err)
  }

  return NextResponse.json({ success: true })
}
