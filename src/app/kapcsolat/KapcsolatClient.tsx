'use client'

import { useState } from 'react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import CalEmbed from '@/components/CalEmbed'
import { Shield, Mail, Clock, Video, CheckCircle, AlertCircle } from 'lucide-react'

const calLink = process.env.NEXT_PUBLIC_CAL_LINK ?? 'valasszengem/egyeztetes'

type FormState = 'idle' | 'loading' | 'success' | 'error'

interface KapcsolatProps {
  title?: string
  subtitle?: string
  email?: string
  phone?: string
}

export default function KapcsolatClient({ title, subtitle, email, phone }: KapcsolatProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', preferredTime: '' })
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const resolvedTitle = title || 'Keress meg'
  const resolvedSubtitle = subtitle || 'Az első kapcsolatfelvétel nem kötelez semmire. Foglalj időpontot közvetlenül, vagy írj üzenetet – hamarosan válaszolok.'
  const resolvedEmail = email || 'hello@valasszengem.hu'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Hiba történt. Kérlek próbáld újra.')
        setState('error')
      } else {
        setState('success')
      }
    } catch {
      setErrorMsg('Hálózati hiba. Kérlek ellenőrizd a kapcsolatot.')
      setState('error')
    }
  }

  const inputStyle = {
    backgroundColor: '#111111',
    border: '1px solid rgba(255,255,255,0.07)',
    color: '#F0EDE5',
  } as const

  return (
    <div style={{ backgroundColor: '#0a0a0a', paddingTop: '5rem' }}>
      {/* Hero */}
      <section className="section-padding px-6 relative overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full pointer-events-none"
          style={{ height: '400px', background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(201,169,110,0.07) 0%, transparent 70%)' }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <span className="text-xs tracking-widest uppercase block mb-6" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em' }}>
              Kapcsolat
            </span>
            <h1 className="font-serif mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 300, lineHeight: 1.15, color: '#F0EDE5' }}>
              {resolvedTitle}
            </h1>
            <p className="mx-auto" style={{ color: '#9A9688', maxWidth: '480px', lineHeight: 1.8 }}>
              {resolvedSubtitle}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Cal.com embed */}
      <section id="naptar" className="px-6 pb-16" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div>
                <span className="text-xs tracking-widest uppercase block mb-2" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em' }}>
                  Időpontfoglalás
                </span>
                <h2 className="font-serif" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 300, color: '#F0EDE5' }}>
                  Válassz időpontot a naptárból
                </h2>
              </div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs"
                style={{ border: '1px solid rgba(201,169,110,0.15)', color: '#9A9688', backgroundColor: 'rgba(201,169,110,0.03)', whiteSpace: 'nowrap' }}
              >
                <Video size={11} style={{ color: 'var(--color-gold)' }} />
                Google Meet link automatikusan generálódik
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={80}>
            <div style={{ border: '1px solid rgba(201,169,110,0.1)', backgroundColor: '#111111', overflow: 'hidden' }}>
              <CalEmbed calLink={calLink} elementId="cal-contact" height={540} />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact form + info */}
      <section className="px-6 pb-24" style={{ backgroundColor: '#0a0a0a', borderTop: '1px solid rgba(201,169,110,0.06)' }}>
        <div className="max-w-5xl mx-auto pt-16">
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="text-xs tracking-widest uppercase block mb-4" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em' }}>
                Vagy írj üzenetet
              </span>
              <h2 className="font-serif" style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', fontWeight: 300, color: '#F0EDE5' }}>
                Kapcsolatfelvételi űrlap
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Sidebar */}
            <AnimatedSection delay={60} className="lg:col-span-2">
              <div className="space-y-8">
                <div className="p-6" style={{ border: '1px solid rgba(201,169,110,0.12)', backgroundColor: 'rgba(201,169,110,0.03)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <Shield size={16} style={{ color: 'var(--color-gold)' }} />
                    <span className="text-sm font-medium" style={{ color: '#F0EDE5' }}>Biztonságos és bizalmas</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#9A9688', lineHeight: 1.8 }}>
                    Minden megkeresést bizalmasan kezelem. Az adataidat kizárólag a
                    kapcsolatfelvételhez szükséges mértékben használom, és biztonságosan tárolom.
                  </p>
                </div>

                <div className="space-y-5">
                  <h3 className="text-xs tracking-widest uppercase" style={{ color: 'var(--color-gold)', letterSpacing: '0.15em' }}>
                    Elérhetőség
                  </h3>
                  <a href={`mailto:${resolvedEmail}`} className="flex items-center gap-3 text-sm transition-colors" style={{ color: '#9A9688' }}>
                    <Mail size={15} style={{ color: 'rgba(201,169,110,0.5)' }} />
                    <span>{resolvedEmail}</span>
                  </a>
                  {phone && (
                    <a href={`tel:${phone}`} className="flex items-center gap-3 text-sm" style={{ color: '#9A9688' }}>
                      <span style={{ color: 'rgba(201,169,110,0.5)', fontSize: '15px' }}>☎</span>
                      <span>{phone}</span>
                    </a>
                  )}
                  <div className="flex items-start gap-3 text-sm" style={{ color: '#9A9688' }}>
                    <Clock size={15} style={{ color: 'rgba(201,169,110,0.5)', marginTop: '3px' }} />
                    <span>Hétfő – Péntek<br />9:00 – 18:00</span>
                  </div>
                </div>

                <div className="p-5 text-sm" style={{ border: '1px solid rgba(201,169,110,0.08)', backgroundColor: '#111111' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Video size={14} style={{ color: 'var(--color-gold)' }} />
                    <span className="text-xs tracking-wider uppercase" style={{ color: 'var(--color-gold)', letterSpacing: '0.1em' }}>
                      Online találkozó
                    </span>
                  </div>
                  <p className="leading-relaxed" style={{ color: '#9A9688', lineHeight: 1.75 }}>
                    Az online ülésekhez a Cal.com automatikusan generál Google Meet linket,
                    amelyet e-mailben kapsz meg a foglalás után.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Form */}
            <AnimatedSection delay={120} className="lg:col-span-3">
              {state === 'success' ? (
                <div className="p-10 text-center" style={{ border: '1px solid rgba(201,169,110,0.2)', backgroundColor: 'rgba(201,169,110,0.03)' }}>
                  <CheckCircle size={40} className="mx-auto mb-6" style={{ color: 'var(--color-gold)' }} />
                  <h2 className="font-serif text-2xl mb-4" style={{ color: '#F0EDE5', fontWeight: 300 }}>
                    Köszönöm az üzenetedet!
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: '#9A9688', lineHeight: 1.8 }}>
                    Hamarosan visszajelzek – általában 1-2 munkanapon belül.<br />
                    E-mail visszaigazolást is küldtem a megadott e-mail-re.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-xs tracking-wider mb-2" style={{ color: '#9A9688', letterSpacing: '0.08em' }}>Neved *</label>
                      <input id="name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={state === 'loading'} className="w-full px-4 py-3 text-sm outline-none transition-all duration-200 disabled:opacity-50" style={inputStyle} placeholder="Például: Anna" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs tracking-wider mb-2" style={{ color: '#9A9688', letterSpacing: '0.08em' }}>E-mail *</label>
                      <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={state === 'loading'} className="w-full px-4 py-3 text-sm outline-none transition-all duration-200 disabled:opacity-50" style={inputStyle} placeholder="email@pelda.hu" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs tracking-wider mb-2" style={{ color: '#9A9688', letterSpacing: '0.08em' }}>Telefonszám (opcionális)</label>
                    <input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} disabled={state === 'loading'} className="w-full px-4 py-3 text-sm outline-none disabled:opacity-50" style={inputStyle} placeholder="+36 xx xxx xxxx" />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs tracking-wider mb-2" style={{ color: '#9A9688', letterSpacing: '0.08em' }}>Üzenet *</label>
                    <textarea id="message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} disabled={state === 'loading'} className="w-full px-4 py-3 text-sm outline-none resize-none disabled:opacity-50" style={inputStyle} placeholder="Röviden írd le, miben keresed a segítséget..." />
                  </div>

                  <div>
                    <label htmlFor="preferredTime" className="block text-xs tracking-wider mb-2" style={{ color: '#9A9688', letterSpacing: '0.08em' }}>Kívánt időpont / megjegyzés (opcionális)</label>
                    <input id="preferredTime" type="text" value={form.preferredTime} onChange={(e) => setForm({ ...form, preferredTime: e.target.value })} disabled={state === 'loading'} className="w-full px-4 py-3 text-sm outline-none disabled:opacity-50" style={inputStyle} placeholder="pl. hétfő délután, online előnyben..." />
                  </div>

                  {state === 'error' && (
                    <div role="alert" className="flex items-center gap-3 px-4 py-3 text-sm" style={{ border: '1px solid rgba(220,80,80,0.2)', backgroundColor: 'rgba(220,80,80,0.05)', color: '#E88888' }}>
                      <AlertCircle size={15} />
                      {errorMsg}
                    </div>
                  )}

                  <div className="pt-2">
                    <div className="flex items-start gap-3 mb-5">
                      <input id="gdpr-consent" type="checkbox" required disabled={state === 'loading'} className="mt-0.5 shrink-0 disabled:opacity-50" style={{ accentColor: 'var(--color-gold)', width: '14px', height: '14px' }} />
                      <label htmlFor="gdpr-consent" className="text-xs leading-relaxed cursor-pointer" style={{ color: '#5A5850' }}>
                        Elolvastam és elfogadom az{' '}
                        <a href="/adatkezeles" className="underline" style={{ color: '#9A9688' }}>adatkezelési tájékoztatót</a>.
                        E-mail visszaigazolást küldünk a megadott e-mail-re.
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={state === 'loading'}
                      className="w-full py-4 text-sm tracking-wider transition-all duration-300 disabled:opacity-60"
                      style={{
                        backgroundColor: state === 'loading' ? 'rgba(201,169,110,0.7)' : 'var(--color-gold)',
                        color: '#0a0a0a',
                        fontWeight: 500,
                        letterSpacing: '0.1em',
                        cursor: state === 'loading' ? 'wait' : 'pointer',
                      }}
                    >
                      {state === 'loading' ? 'Küldés...' : 'Elküldöm az üzenetet'}
                    </button>
                  </div>
                </form>
              )}
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}
