'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Image from 'next/image'
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
      const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } })

      // 1. Thin line draws across
      tl.fromTo(lineRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.8, ease: 'power2.out' }
      )

      // 2. Bike rides from left to right
      tl.fromTo(bikeRef.current,
        { x: '-180px', opacity: 0 },
        {
          x: 'calc(100vw + 180px)',
          opacity: 1,
          duration: 2.6,
          ease: 'power1.inOut',
          onStart: () => gsap.to(bikeRef.current, { opacity: 1, duration: 0.3 }),
          onComplete: () => gsap.set(bikeRef.current, { opacity: 0 }),
        },
        '-=0.2'
      )

      // 3. Logo reveals while bike is mid-journey
      tl.fromTo(logoRef.current,
        { opacity: 0, scale: 0.94, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'power3.out' },
        '-=1.8'
      )

      // 4. Enter button
      tl.fromTo(btnRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.3'
      )
    }, containerRef)

    // Auto-dismiss after 7s
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
      {/* Thin decorative line */}
      <div
        ref={lineRef}
        className="absolute top-1/2 left-0 w-full h-px bg-taupe/20 -translate-y-8"
      />

      {/* Bike track */}
      <div className="absolute left-0 w-full overflow-hidden pointer-events-none"
           style={{ top: 'calc(50% - 70px)', height: 120 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={bikeRef}
          src="/assets/bici.png"
          alt=""
          className="absolute h-24 w-auto opacity-0 logo-invert"
          style={{ bottom: 0 }}
        />
      </div>

      {/* Logo */}
      <div ref={logoRef} className="flex flex-col items-center gap-3 opacity-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/logo-main.png"
          alt="Studio G.D."
          className="logo-invert"
          style={{ width: 'min(320px, 68vw)' }}
        />
        <div className="w-8 h-px bg-taupe/40 mt-1" />
      </div>

      {/* Enter button */}
      <button
        ref={btnRef}
        onClick={dismiss}
        className="mt-12 opacity-0 btn-ghost cursor-pointer"
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
