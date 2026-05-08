'use client'
import { motion } from 'framer-motion'
import { useLang } from '@/context/LangContext'

const services = [
  {
    stamp: '/assets/stamp-cream.png',
    nameEs: 'Papelería Personalizada',
    nameEn: 'Custom Stationery',
    descEs: 'Tarjetas, sobres, papeles membretados y etiquetas diseñadas completamente a tu medida, con tu nombre, logo o mensaje.',
    descEn: 'Cards, envelopes, letterheads, and labels designed entirely to your spec — your name, logo, or message.',
  },
  {
    stamp: '/assets/stamp-sage.png',
    nameEs: 'Invitaciones y Eventos',
    nameEn: 'Invitations & Events',
    descEs: 'Bodas, baby showers, cumpleaños, graduaciones — creamos invitaciones que preparan el ambiente perfecto para tu celebración.',
    descEn: 'Weddings, baby showers, birthdays, graduations — we create invitations that set the perfect tone for your celebration.',
  },
  {
    stamp: '/assets/stamp-olive.png',
    nameEs: 'Paquetes Completos',
    nameEn: 'Complete Packages',
    descEs: 'Desde el diseño inicial hasta la entrega. Coordinamos todo para que tu papelería sea coherente, elegante y perfecta.',
    descEn: 'From initial design to final delivery. We coordinate everything so your stationery is cohesive, elegant, and perfect.',
  },
]

const cardVariant = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.25, 0.1, 0.25, 1] as const } },
}

const containerVariant = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.13 } },
}

export default function Servicios() {
  const { lang, t } = useLang()

  return (
    <section id="servicios" className="bg-taupe">
      <div className="max-w-[1160px] mx-auto px-6 md:px-12 py-24 md:py-32">

        <motion.div
          className="text-center max-w-lg mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="section-label !text-navy/55">{t('Lo que hacemos', 'What we do')}</span>
          <h2 className="section-title">
            {t('Nuestros', 'Our')} <em className="!text-navy/50">{t('servicios', 'services')}</em>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-0.5"
        >
          {services.map(s => (
            <motion.div
              key={s.nameEs}
              variants={cardVariant}
              className="group bg-parchment p-12 text-center
                         hover:bg-navy transition-colors duration-500 cursor-default"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.stamp}
                alt=""
                className="w-14 mx-auto mb-6 opacity-45
                           group-hover:opacity-20 group-hover:invert transition-all duration-500"
              />
              <h3 className="font-serif text-[20px] font-normal text-navy mb-4
                             group-hover:text-cream transition-colors duration-500">
                {lang === 'es' ? s.nameEs : s.nameEn}
              </h3>
              <p className="text-[12px] leading-[1.85] text-navy/55 font-light
                            group-hover:text-cream/55 transition-colors duration-500">
                {lang === 'es' ? s.descEs : s.descEn}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
