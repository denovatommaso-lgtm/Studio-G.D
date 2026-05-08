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
              'Somos Mariana y Lor, dos hermanas unidas por la pasión por el diseño, el papel y los detalles que hacen la diferencia. Studio G.D. nació de nuestra convicción de que cada celebración merece papelería que cuente su propia historia.',
              'We are Mariana and Lor, two sisters united by a passion for design, paper, and the details that make all the difference. Studio G.D. was born from our belief that every celebration deserves stationery that tells its own story.'
            )}
          </p>

          <span className="font-script text-4xl text-taupe block mb-8">
            Mariana &amp; Lor
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

        {/* Photo */}
        <motion.div
          variants={slideRight}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col gap-4 relative"
        >
          {/* Decorative estampa — top right corner */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src="/assets/estampa2.png"
            alt=""
            className="absolute pointer-events-none select-none z-10"
            style={{ width: 140, top: -28, right: -24, opacity: 0.18 }}
            initial={{ opacity: 0, rotate: 14, scale: 0.88 }}
            whileInView={{ opacity: 0.18, rotate: 14, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          />

          <div className="relative w-full overflow-hidden aspect-[4/3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/9799b8cc-5832-4c4d-bea0-814debca2250.jpg"
              alt="Mariana y Lor"
              className="w-full h-full object-cover object-top"
              style={{ filter: 'sepia(18%) contrast(105%) brightness(0.92)' }}
            />
            {/* Navy vignette — bottom blends into dark section */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to bottom, transparent 55%, rgba(20,24,32,0.45) 100%)',
              }}
            />
          </div>
          <p className="text-[9px] tracking-[0.25em] uppercase text-taupe/40 text-center">
            Mariana &amp; Lor
          </p>
        </motion.div>

      </div>
    </section>
  )
}
