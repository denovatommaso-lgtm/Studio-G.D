'use client'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/context/LangContext'
import { useEffect, useState, useRef } from 'react'

/* ─── Stamp pool ─────────────────────────────────────────── */
const STAMPS = [
  { src: '/assets/estampa1.png', w: 220 },
  { src: '/assets/estampa2.png', w: 180 },
  { src: '/assets/estampa3.png', w: 200 },
  { src: '/assets/estampa4.png', w: 190 },
  { src: '/assets/estampa5.png', w: 210 },
  { src: '/assets/sello1.png',   w: 130 },
  { src: '/assets/sello2.png',   w: 130 },
]

/* ─── Font labels (design-studio feel) ──────────────────── */
const FONT_LABELS = [
  { text: 'Cormorant',     style: 'font-serif italic'      },
  { text: 'Aa',            style: 'font-serif'             },
  { text: 'G . D .',       style: 'font-sans tracking-widest' },
  { text: 'Script',        style: 'font-script'            },
  { text: '✦',             style: 'font-sans'              },
  { text: 'Serif',         style: 'font-serif italic'      },
  { text: 'Sans',          style: 'font-sans tracking-wider' },
  { text: 'Papelería',     style: 'font-script'            },
  { text: '◇',             style: 'font-sans'              },
  { text: 'Est. 2025',     style: 'font-sans tracking-widest text-[10px]' },
]

/* ─── Zones: avoid centre (where content lives) ─────────── */
// [left%, top%, rotation-range]
const ZONES = [
  [4,  5,  20],
  [72, 4,  -16],
  [80, 55, 18],
  [2,  60, -22],
  [60, 82, 14],
  [10, 80, -14],
  [75, 28, -20],
  [18, 10, 16],
]

interface FloatingEl {
  id: number
  type: 'stamp' | 'font'
  data: typeof STAMPS[0] | typeof FONT_LABELS[0]
  left: number
  top: number
  rotate: number
  opacity: number
}

let _id = 0

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

  /* ── Floating elements state ── */
  const [elements, setElements] = useState<FloatingEl[]>([])
  const zoneRef = useRef<number[]>([]) // track recently used zones

  /* ── Background tint index ── */
  const [bgIdx, setBgIdx] = useState(0)

  useEffect(() => {
    if (reduced) return

    let running = true

    /* Spawn a new element every ~2.2 s */
    const spawn = () => {
      if (!running) return

      // Pick a zone not used recently
      const available = ZONES.map((_, i) => i).filter(i => !zoneRef.current.includes(i))
      const zoneIdx = available.length
        ? available[Math.floor(Math.random() * available.length)]
        : Math.floor(Math.random() * ZONES.length)

      zoneRef.current = [...zoneRef.current, zoneIdx].slice(-3)

      const zone = ZONES[zoneIdx]
      const isStamp = Math.random() > 0.38
      const data = isStamp
        ? STAMPS[Math.floor(Math.random() * STAMPS.length)]
        : FONT_LABELS[Math.floor(Math.random() * FONT_LABELS.length)]

      const el: FloatingEl = {
        id:     ++_id,
        type:   isStamp ? 'stamp' : 'font',
        data,
        left:   zone[0] + (Math.random() * 8 - 4),
        top:    zone[1] + (Math.random() * 8 - 4),
        rotate: (Math.random() * zone[2] * 2) - zone[2],
        opacity: isStamp ? 0.13 + Math.random() * 0.07 : 0.18 + Math.random() * 0.1,
      }

      setElements(prev => [...prev, el])

      /* Remove after 5-7 s */
      const lifetime = 5000 + Math.random() * 2000
      setTimeout(() => {
        if (!running) return
        setElements(prev => prev.filter(e => e.id !== el.id))
      }, lifetime)

      /* Schedule next spawn */
      setTimeout(spawn, 1800 + Math.random() * 900)
    }

    /* Seed 3 stamps right away */
    for (let i = 0; i < 3; i++) {
      setTimeout(spawn, i * 600)
    }

    /* Cycle background tint every 5 s */
    const bgTimer = setInterval(() => {
      setBgIdx(i => (i + 1) % BG_TINTS.length)
    }, 5000)

    return () => {
      running = false
      clearInterval(bgTimer)
    }
  }, [reduced])

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

      {/* ── Floating stamps & font labels ─────────────────── */}
      <AnimatePresence>
        {elements.map(el => {
          if (el.type === 'stamp') {
            const stamp = el.data as typeof STAMPS[0]
            return (
              <motion.img
                key={el.id}
                /* eslint-disable-next-line @next/next/no-img-element */
                src={stamp.src}
                alt=""
                className="absolute pointer-events-none select-none z-[1]"
                style={{
                  width:  stamp.w,
                  left:   `${el.left}%`,
                  top:    `${el.top}%`,
                }}
                initial={{ opacity: 0, rotate: el.rotate - 8, scale: 0.78 }}
                animate={{ opacity: el.opacity, rotate: el.rotate, scale: 1 }}
                exit={{    opacity: 0, rotate: el.rotate + 6, scale: 0.82 }}
                transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
              />
            )
          } else {
            const label = el.data as typeof FONT_LABELS[0]
            return (
              <motion.span
                key={el.id}
                className={`absolute pointer-events-none select-none z-[1]
                            text-taupe ${label.style}`}
                style={{
                  left:    `${el.left}%`,
                  top:     `${el.top}%`,
                  rotate:  `${el.rotate}deg`,
                  opacity: 0,
                  fontSize: label.text === 'Papelería' ? '1.6rem' : '1.1rem',
                }}
                initial={{ opacity: 0, y: 8, scale: 0.88 }}
                animate={{ opacity: el.opacity, y: 0, scale: 1 }}
                exit={{    opacity: 0, y: -8, scale: 0.9 }}
                transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
              />
            )
          }
        })}
      </AnimatePresence>

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
