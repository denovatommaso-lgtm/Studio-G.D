'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { useLang } from '@/context/LangContext'
import { useEffect, useState } from 'react'

/* ─── Entry animations ───────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
}

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

/* ─── Background colour cycle ────────────────────────────── */
const BG_TINTS = [
  'rgba(6,9,18,0)',       // pure navy — neutral
  'rgba(30,18,6,0.12)',   // warm amber hint
  'rgba(6,15,18,0.10)',   // cool teal hint
  'rgba(20,10,30,0.10)',  // subtle violet
  'rgba(6,9,18,0)',       // back to neutral
]

export default function Hero() {
  const { t }   = useLang()
  const reduced = useReducedMotion()

  /* ── Background tint index ── */
  const [bgIdx, setBgIdx] = useState(0)

  useEffect(() => {
    const bgTimer = setInterval(() => {
      setBgIdx(i => (i + 1) % BG_TINTS.length)
    }, 5000)
    return () => clearInterval(bgTimer)
  }, [])

  return (
    <section
      id="hero"
      className="min-h-screen bg-navy flex flex-col items-center justify-center
                 relative overflow-hidden"
    >
      {/* ── Animated background tint overlay ─────────────── */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        animate={{ backgroundColor: BG_TINTS[bgIdx] }}
        transition={{ duration: 4.5, ease: 'easeInOut' }}
      />

      {/* ── Radial vignette ───────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 90% at 50% 46%, transparent 20%, rgba(6,9,18,0.78) 100%)',
        }}
      />

      {/* ── Tartan pattern ────────────────────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.09] pointer-events-none z-0"
        style={{ backgroundImage: "url('/assets/patron.png')", backgroundSize: '320px' }}
      />

      {/* ── Content cascade ───────────────────────────────── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        {/* Logo */}
        <motion.div
          variants={fadeUp}
          className="overflow-hidden"
          style={{
            width  : 'min(620px, 90vw)',
            height : 'calc(min(620px, 90vw) * 0.24)',
          }}
        >
          <motion.img
            src="/assets/logo-main.png"
            alt="Studio G.D. — Crafted with Intention"
            className="logo-invert w-full"
            style={{ marginTop: 'calc(min(620px, 90vw) * -0.38)' }}
            animate={reduced ? {} : { y: [0, -14, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          />
        </motion.div>

        {/* Ornamental rule */}
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-4 mt-5 mb-6 w-full max-w-[340px]"
        >
          <div className="flex-1 h-px bg-taupe/45" />
          <span className="text-[8px] tracking-[0.48em] uppercase text-taupe/75 font-sans whitespace-nowrap">
            {t('Papelería · Est. 2025', 'Stationery · Est. 2025')}
          </span>
          <div className="flex-1 h-px bg-taupe/45" />
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="text-cream/75 text-[10px] tracking-[0.42em] uppercase mb-9"
        >
          {t(
            'Papelería personalizada · Hecha con intención',
            'Custom stationery · Made with intention'
          )}
        </motion.p>

        <motion.a
          variants={fadeUp}
          href="#productos"
          className="border border-taupe/55 text-cream text-[10px] tracking-[0.3em]
                     uppercase px-12 py-[15px] hover:bg-taupe/15 hover:border-taupe/80
                     transition-all duration-300"
          whileHover={reduced ? {} : { scale: 1.03 }}
          whileTap={reduced ? {} : { scale: 0.97 }}
        >
          {t('Ver productos', 'View products')}
        </motion.a>
      </motion.div>

      {/* ── Scroll indicator ──────────────────────────────── */}
      <motion.div
        className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col
                   items-center gap-2 text-taupe/70 pointer-events-none z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.7 }}
      >
        <span className="text-[9px] tracking-[0.28em] uppercase">Scroll</span>
        <motion.svg
          className="w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          animate={reduced ? {} : { y: [0, 7, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </motion.svg>
      </motion.div>
    </section>
  )
}
