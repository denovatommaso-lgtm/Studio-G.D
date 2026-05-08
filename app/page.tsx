'use client'
import { useState, useCallback } from 'react'
import Navigation  from '@/components/Navigation'
import Hero        from '@/components/Hero'
import Products    from '@/components/Products'
import Nosotras    from '@/components/Nosotras'
import Servicios   from '@/components/Servicios'
import Contacto    from '@/components/Contacto'
import Footer      from '@/components/Footer'
import BikeIntro   from '@/components/BikeIntro'

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? '521XXXXXXXXXX'

export default function Home () {
  // introReady  → page wrapper begins fading in (cross-fades with BikeIntro)
  // introGone   → BikeIntro has fully faded and unmounted
  const [introReady, setIntroReady] = useState(false)
  const [introGone,  setIntroGone]  = useState(false)

  const handleComplete = useCallback(() => setIntroReady(true),  [])
  const handleGone     = useCallback(() => setIntroGone(true),   [])

  return (
    <>
      {/* ── Intro overlay ─────────────────────────────────────────────────── */}
      {!introGone && (
        <BikeIntro onComplete={handleComplete} onGone={handleGone} />
      )}

      {/* ── Page content ──────────────────────────────────────────────────── */}
      {/* Fades in as BikeIntro fades out — both transitions run simultaneously */}
      <div
        style={{
          opacity    : introReady ? 1 : 0,
          transition : introReady ? 'opacity 1.1s cubic-bezier(0.4,0,0.2,1)' : 'none',
          pointerEvents: introReady ? 'auto' : 'none',
        }}
      >
        <Navigation introReady={introReady} />
        <main>
          <Hero        introReady={introReady} />
          <Nosotras />
          <Products />
          <Servicios />
          <Contacto />
        </main>
        <Footer />

        {/* Admin access — discreet bottom-left */}
        <a
          href="/admin"
          className="fixed bottom-5 left-5 z-50 flex items-center gap-2
                     text-taupe/30 hover:text-taupe/60 transition-colors duration-300"
          title="Admin"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <span className="text-[8px] tracking-[0.25em] uppercase">Admin</span>
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${WA_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="fixed bottom-7 right-7 z-50 w-14 h-14 rounded-full bg-[#25D366]
                     flex items-center justify-center shadow-xl shadow-[#25D366]/30
                     hover:scale-110 transition-transform duration-200"
        >
          <svg className="w-7 fill-white" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.118.554 4.103 1.523 5.826L.057 23.856a.5.5 0 00.609.609l6.03-1.466A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.648-.52-5.152-1.426l-.369-.22-3.827.93.93-3.827-.22-.37A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
        </a>
      </div>
    </>
  )
}
