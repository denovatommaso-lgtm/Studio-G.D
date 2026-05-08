'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { useLang } from '@/context/LangContext'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
}

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

export default function Hero() {
  const { t }   = useLang()
  const reduced = useReducedMotion()

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

      {/* Estampa — top left */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src="/assets/estampa1.png"
        alt=""
        className="absolute pointer-events-none select-none"
        style={{ width: 420, top: -60, left: -80, opacity: 0.13 }}
        initial={{ opacity: 0, rotate: -18, scale: 0.9 }}
        animate={{ opacity: 0.13, rotate: -18, scale: 1 }}
        transition={{ duration: 2.4, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      />

      {/* Estampa — bottom right */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src="/assets/estampa5.png"
        alt=""
        className="absolute pointer-events-none select-none"
        style={{ width: 380, bottom: -40, right: -60, opacity: 0.14 }}
        initial={{ opacity: 0, rotate: 13, scale: 0.9 }}
        animate={{ opacity: 0.14, rotate: 13, scale: 1 }}
        transition={{ duration: 2.4, delay: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
      />

      {/* Content cascade */}
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

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col
                   items-center gap-2 text-taupe/70 pointer-events-none"
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
