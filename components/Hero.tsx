'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useLang } from '@/context/LangContext'

export default function Hero() {
  const logoRef    = useRef<HTMLImageElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const ctaRef     = useRef<HTMLAnchorElement>(null)
  const scrollRef  = useRef<HTMLDivElement>(null)
  const { t }      = useLang()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 })

      // Floating logo
      tl.fromTo(logoRef.current,
        { opacity: 0, y: 20, scale: 0.96 },
        { opacity: 1, y: 0,  scale: 1, duration: 1.2, ease: 'power3.out' }
      )

      tl.fromTo(taglineRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
        '-=0.5'
      )

      tl.fromTo(ctaRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        '-=0.4'
      )

      tl.fromTo(scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        '-=0.2'
      )

      // Perpetual logo float
      gsap.to(logoRef.current, {
        y: -14,
        duration: 3.5,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.5,
      })

      // Scroll bounce
      gsap.to(scrollRef.current, {
        y: 8,
        duration: 1.4,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="hero"
      className="min-h-screen bg-navy flex flex-col items-center justify-center
                 relative overflow-hidden"
    >
      {/* Tartan pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "url('/assets/patron.png')", backgroundSize: '320px' }}
      />

      {/* Stamp decoration — large, blurred, bottom-right */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/stamp-cream.png"
        alt=""
        className="absolute -bottom-16 -right-16 w-80 opacity-5 pointer-events-none
                   blur-sm rotate-12"
      />

      <div className="relative z-10 flex flex-col items-center gap-7 text-center px-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={logoRef}
          src="/assets/logo-main.png"
          alt="Studio G.D. — Crafted with Intention"
          className="logo-invert opacity-0"
          style={{ width: 'min(400px, 72vw)' }}
        />

        <p ref={taglineRef} className="text-taupe text-[11px] tracking-[0.38em] uppercase opacity-0">
          {t(
            'Papelería personalizada · Hecha con intención',
            'Custom stationery · Made with intention'
          )}
        </p>

        <a
          ref={ctaRef}
          href="#productos"
          className="mt-2 border border-taupe/35 text-cream text-[10px] tracking-[0.3em]
                     uppercase px-11 py-[14px] hover:bg-taupe/12 hover:border-taupe/70
                     transition-all duration-300 opacity-0"
        >
          {t('Ver productos', 'View products')}
        </a>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col
                   items-center gap-2 text-taupe/50 opacity-0 pointer-events-none"
      >
        <span className="text-[9px] tracking-[0.28em] uppercase">Scroll</span>
        <svg className="w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  )
}
