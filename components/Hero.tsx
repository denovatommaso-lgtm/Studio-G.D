'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useLang } from '@/context/LangContext'

export default function Hero () {
  const logoRef    = useRef<HTMLDivElement>(null)
  const ruleRef    = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const ctaRef     = useRef<HTMLAnchorElement>(null)
  const scrollRef  = useRef<HTMLDivElement>(null)
  const stamp1Ref  = useRef<HTMLImageElement>(null)
  const stamp2Ref  = useRef<HTMLImageElement>(null)
  const { t }      = useLang()

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Stamps drift in behind content (slow, decorative) ─────────────────
      gsap.fromTo(
        [stamp1Ref.current, stamp2Ref.current],
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 2.8, stagger: 0.6, ease: 'power2.out', delay: 0.2 }
      )

      // ── Main content cascade ───────────────────────────────────────────────
      // Logo appears instantly as the cross-fade begins (BikeIntro logo is
      // fading out at the same position, so this is a seamless swap).
      const tl = gsap.timeline()

      tl.fromTo(logoRef.current,
        { opacity: 0, y: 8, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out' }
      )

      tl.fromTo(ruleRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
        '-=0.25'
      )

      tl.fromTo(taglineRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
        '-=0.3'
      )

      tl.fromTo(ctaRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      )

      tl.fromTo(scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        '-=0.2'
      )

      // ── Perpetual: logo gentle float ───────────────────────────────────────
      gsap.to(logoRef.current, {
        y        : -14,
        duration : 4.2,
        ease     : 'sine.inOut',
        yoyo     : true,
        repeat   : -1,
        delay    : 1.2,
      })

      // ── Perpetual: scroll indicator bounce ────────────────────────────────
      gsap.to(scrollRef.current, {
        y        : 7,
        duration : 1.5,
        ease     : 'sine.inOut',
        yoyo     : true,
        repeat   : -1,
      })

      // ── Perpetual: stamp slow drift ────────────────────────────────────────
      gsap.to(stamp1Ref.current, {
        y        : '-=20',
        rotation : '+=5',
        duration : 16,
        ease     : 'sine.inOut',
        yoyo     : true,
        repeat   : -1,
      })
      gsap.to(stamp2Ref.current, {
        y        : '+=14',
        rotation : '-=4',
        duration : 12,
        ease     : 'sine.inOut',
        yoyo     : true,
        repeat   : -1,
        delay    : 2.5,
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
      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 90% at 50% 46%, transparent 20%, rgba(6,9,18,0.75) 100%)',
        }}
      />

      {/* Tartan pattern */}
      <div
        className="absolute inset-0 opacity-[0.09] pointer-events-none"
        style={{ backgroundImage: "url('/assets/patron.png')", backgroundSize: '320px' }}
      />

      {/* Ghost stamp — top left */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={stamp1Ref}
        src="/assets/stamp-cream.png"
        alt=""
        className="absolute pointer-events-none select-none opacity-0"
        style={{
          width: 440, top: -70, left: -90,
          transform: 'rotate(-20deg)',
          filter: 'brightness(0) invert(1) opacity(0.07)',
        }}
      />

      {/* Ghost stamp — bottom right */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={stamp2Ref}
        src="/assets/stamp-sage.png"
        alt=""
        className="absolute pointer-events-none select-none opacity-0"
        style={{
          width: 400, bottom: -50, right: -70,
          transform: 'rotate(15deg)',
          filter: 'brightness(0) invert(1) opacity(0.08)',
        }}
      />

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">

        {/* Logo — same crop as BikeIntro so the cross-fade is a seamless position swap */}
        <div
          ref={logoRef}
          className="overflow-hidden"
          style={{
            width  : 'min(620px, 90vw)',
            height : 'calc(min(620px, 90vw) * 0.24)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logo-main.png"
            alt="Studio G.D. — Crafted with Intention"
            className="logo-invert w-full"
            style={{ marginTop: 'calc(min(620px, 90vw) * -0.38)' }}
          />
        </div>

        {/* Ornamental rule */}
        <div
          ref={ruleRef}
          className="flex items-center gap-4 mt-5 mb-6 w-full max-w-[340px]"
        >
          <div className="flex-1 h-px bg-taupe/45" />
          <span className="text-[8px] tracking-[0.48em] uppercase text-taupe/75 font-sans whitespace-nowrap">
            {t('Papelería · Est. 2025', 'Stationery · Est. 2025')}
          </span>
          <div className="flex-1 h-px bg-taupe/45" />
        </div>

        <p
          ref={taglineRef}
          className="text-cream/75 text-[10px] tracking-[0.42em] uppercase mb-9"
        >
          {t(
            'Papelería personalizada · Hecha con intención',
            'Custom stationery · Made with intention'
          )}
        </p>

        <a
          ref={ctaRef}
          href="#productos"
          className="border border-taupe/55 text-cream text-[10px] tracking-[0.3em]
                     uppercase px-12 py-[15px] hover:bg-taupe/15 hover:border-taupe/80
                     transition-all duration-300"
        >
          {t('Ver productos', 'View products')}
        </a>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col
                   items-center gap-2 text-taupe/70 pointer-events-none"
      >
        <span className="text-[9px] tracking-[0.28em] uppercase">Scroll</span>
        <svg className="w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  )
}
