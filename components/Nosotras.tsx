'use client'
import { motion } from 'framer-motion'
import { useLang } from '@/context/LangContext'

const values = [
  {
    es: 'Cada diseño es colaborativo — trabajamos contigo para reflejar exactamente lo que imaginas.',
    en: 'Every design is collaborative — we work with you to reflect exactly what you envision.',
  },
  {
    es: 'Usamos materiales de la más alta calidad, seleccionados con cuidado para que cada pieza se sienta especial.',
    en: 'We use the finest quality materials, carefully selected so every piece feels truly special.',
  },
  {
    es: 'Creemos que la papelería bien hecha es un regalo en sí mismo.',
    en: 'We believe that well-crafted stationery is a gift in itself.',
  },
]

const slideLeft = {
  hidden: { opacity: 0, x: -32 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.25, 0.1, 0.25, 1] as const } },
}

const slideRight = {
  hidden: { opacity: 0, x: 32 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.25, 0.1, 0.25, 1] as const } },
}

const listContainer = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1, delayChildren: 0.25 } },
}

const listItem = {
  hidden: { opacity: 0, x: -16 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
}

export default function Nosotras() {
  const { lang, t } = useLang()

  return (
    <section id="nosotras" className="bg-navy">
      <div className="max-w-[1160px] mx-auto px-6 md:px-12 py-24 md:py-32
                      grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">

        {/* Text */}
        <motion.div
          variants={slideLeft}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <span className="section-label !text-taupe">{t('Nosotras', 'About us')}</span>
          <h2 className="section-title !text-cream">
            {t('Detrás de cada', 'Behind every')} <em>{t('pieza', 'piece')}</em>
          </h2>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-taupe/20" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/isotipo.png" alt="" className="h-6 logo-invert-dim" />
            <div className="flex-1 h-px bg-taupe/20" />
          </div>

          <p className="text-[15px] leading-[1.85] text-cream/60 font-light mb-8">
            {t(
              'Somos Mariana y Lorenza, dos hermanas unidas por la pasión por el diseño, el papel y los detalles que hacen la diferencia. Studio G.D. nació de nuestra convicción de que cada celebración merece papelería que cuente su propia historia.',
              'We are Mariana and Lorenza, two sisters united by a passion for design, paper, and the details that make all the difference. Studio G.D. was born from our belief that every celebration deserves stationery that tells its own story.'
            )}
          </p>

          <span className="font-script text-4xl text-taupe block mb-8">
            Mariana &amp; Lorenza
          </span>

          <motion.ul
            variants={listContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col gap-5"
          >
            {values.map((v, i) => (
              <motion.li key={i} variants={listItem} className="flex gap-4 items-start">
                <div className="w-1 h-1 rounded-full bg-taupe mt-[9px] flex-shrink-0" />
                <p className="text-[13px] leading-[1.75] text-cream/55 font-light">
                  {lang === 'es' ? v.es : v.en}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Photo — Polaroid */}
        <motion.div
          variants={slideRight}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="flex justify-center items-center relative"
        >
          {/* Decorative estampa — top right corner */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src="/assets/estampa2.png"
            alt=""
            className="absolute pointer-events-none select-none z-10"
            style={{ width: 130, top: -32, right: -16, opacity: 0.15 }}
            initial={{ opacity: 0, rotate: 14, scale: 0.88 }}
            whileInView={{ opacity: 0.15, rotate: 14, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          />

          {/* Polaroid */}
          <div
            style={{
              background: 'linear-gradient(160deg, #f0e9dc 0%, #e4ddd0 100%)',
              padding: '13px 13px 88px 13px',
              transform: 'rotate(-2deg)',
              maxWidth: 360,
              width: '100%',
              boxShadow: `
                0 1px 2px rgba(0,0,0,0.25),
                0 4px 8px rgba(0,0,0,0.20),
                0 12px 24px rgba(0,0,0,0.16),
                0 32px 56px rgba(0,0,0,0.10),
                inset 0 1px 0 rgba(255,255,255,0.55)
              `,
            }}
          >
            {/* Photo area */}
            <div className="relative w-full overflow-hidden aspect-[3/4]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/nosotras.jpg"
                alt="Mariana y Lorenza"
                className="w-full h-full object-cover object-center"
                style={{ filter: 'sepia(38%) contrast(92%) brightness(0.96) saturate(0.70) hue-rotate(4deg)' }}
              />
              {/* Grain overlay for vintage texture */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
                  backgroundSize: '180px 180px',
                  mixBlendMode: 'overlay',
                  opacity: 0.6,
                }}
              />
              {/* Faded edges vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 28px rgba(60,40,20,0.28)',
                }}
              />
            </div>

            {/* Studio G.D logo in polaroid tab */}
            <div className="flex justify-center items-center" style={{ marginTop: '12px', height: '68px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/logo-main.png"
                alt="Studio G.D."
                style={{ height: '64px', width: 'auto', filter: 'brightness(0) sepia(1) saturate(3) hue-rotate(340deg) brightness(0.55)', opacity: 0.70 }}
              />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
