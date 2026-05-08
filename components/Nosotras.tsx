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
              background: 'linear-gradient(160deg, #f7f2ea 0%, #ede8df 100%)',
              padding: '14px 14px 64px 14px',
              transform: 'rotate(-2deg)',
              maxWidth: 360,
              width: '100%',
              boxShadow: `
                0 1px 1px rgba(0,0,0,0.22),
                0 3px 5px rgba(0,0,0,0.18),
                0 8px 16px rgba(0,0,0,0.14),
                0 24px 48px rgba(0,0,0,0.10),
                inset 0 1px 0 rgba(255,255,255,0.6)
              `,
            }}
          >
            {/* Photo area */}
            <div className="relative w-full overflow-hidden aspect-[3/4]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/nosotras.jpg"
                alt="Mariana y Lorenza"
                className="w-full h-full object-cover object-top"
                style={{ filter: 'sepia(10%) contrast(104%) brightness(0.97) saturate(0.88)' }}
              />
              {/* Subtle inner shadow to make photo feel inset */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 12px rgba(0,0,0,0.18)',
                }}
              />
            </div>

            {/* Polaroid caption tab */}
            <p
              className="font-script text-center"
              style={{
                fontSize: '22px',
                color: '#7a6a58',
                marginTop: '14px',
                letterSpacing: '0.01em',
              }}
            >
              Mariana &amp; Lorenza
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
