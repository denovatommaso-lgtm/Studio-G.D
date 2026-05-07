'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useLang } from '@/context/LangContext'

interface Props { onComplete: () => void }

export default function Preloader({ onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const bikeRef      = useRef<HTMLImageElement>(null)
  const logoRef      = useRef<HTMLDivElement>(null)
  const btnRef       = useRef<HTMLButtonElement>(null)
  const lineRef      = useRef<HTMLDivElement>(null)
  const { t }        = useLang()

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Park bike off-screen left before anything starts
      gsap.set(bikeRef.current, { x: '-260px' })

      const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } })

      // 1. Line draws across
      tl.fromTo(lineRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.9, ease: 'power2.out' }
      )

      // 2a. Bike fades in
      tl.to(bikeRef.current,
        { opacity: 1, duration: 0.4, ease: 'power2.out' },
        '-=0.15'
      )

      // 2b. Bike rides all the way across — same start as fade-in
      tl.to(bikeRef.current,
        {
          x: 'calc(100vw + 260px)',
          duration: 2.8,
          ease: 'power1.inOut',
          onComplete: () => gsap.set(bikeRef.current, { opacity: 0 }),
        },
        '<'
      )

      // 3. Logo reveals while bike is mid-journey
      tl.fromTo(logoRef.current,
        { opacity: 0, scale: 0.94, y: 14 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        '-=1.9'
      )

      // 4. Enter button
      tl.fromTo(btnRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.3'
      )
    }, containerRef)

    const timer = setTimeout(dismiss, 7000)
    return () => { ctx.revert(); clearTimeout(timer) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dismiss = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.75,
      ease: 'power2.inOut',
      onComplete,
    })
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-navy flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Decorative line — at 65%, well below the centered logo */}
      <div
        ref={lineRef}
        className="absolute left-0 w-full h-px bg-taupe/20"
        style={{ top: '65%' }}
      />

      {/* Bike track — NO overflow-hidden so bike enters/exits naturally;
          outer container clips to viewport. Bottom edge aligned with the line. */}
      <div
        className="absolute left-0 w-full pointer-events-none"
        style={{ bottom: '35%', height: 210 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={bikeRef}
          src="/assets/bici.png"
          alt=""
          className="absolute h-40 w-auto logo-invert"
          style={{ bottom: 0, opacity: 0 }}
        />
      </div>

      {/* Logo — same crop trick as Hero: artwork sits at 43–57% of the 1201×1201 PNG */}
      <div ref={logoRef} className="flex flex-col items-center gap-6 opacity-0">
        <div
          className="overflow-hidden"
          style={{
            width:  'min(320px, 68vw)',
            height: 'calc(min(320px, 68vw) * 0.24)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logo-main.png"
            alt="Studio G.D."
            className="logo-invert w-full"
            style={{ marginTop: 'calc(min(320px, 68vw) * -0.38)' }}
          />
        </div>
        <div className="w-8 h-px bg-taupe/40" />
      </div>

      {/* Enter button */}
      <button
        ref={btnRef}
        onClick={dismiss}
        className="mt-10 opacity-0 btn-ghost cursor-pointer"
      >
        {t('Entrar', 'Enter')}
      </button>

      {/* Corner isotipo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/isotipo.png"
        alt=""
        className="absolute bottom-8 right-8 w-8 logo-invert-dim"
      />
    </div>
  )
}
