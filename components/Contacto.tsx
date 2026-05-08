'use client'
import { motion } from 'framer-motion'
import { useLang } from '@/context/LangContext'

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER  ?? '521XXXXXXXXXX'
const IG_HANDLE = process.env.NEXT_PUBLIC_IG_HANDLE ?? 'studiogd.stationery'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
}

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
}

export default function Contacto() {
  const { t } = useLang()

  return (
    <section
      id="contacto"
      className="bg-cream"
      style={{ backgroundImage: "url('/assets/patron.png')", backgroundSize: '320px' }}
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-[700px] mx-auto px-6 md:px-12 py-24 md:py-32
                   text-center flex flex-col items-center gap-0"
      >
        <motion.span variants={fadeUp} className="section-label">
          {t('Hablemos', "Let's talk")}
        </motion.span>

        <motion.h2 variants={fadeUp} className="section-title">
          {t('¿Listo para crear', 'Ready to create')}{' '}
          <em>{t('algo especial?', 'something special?')}</em>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="text-[15px] leading-[1.85] text-navy/55 font-light mt-2 mb-12"
        >
          {t(
            'Cuéntanos tu idea y la hacemos realidad. Escríbenos directamente por WhatsApp o Instagram — respondemos en menos de 24 horas.',
            "Tell us your idea and we'll bring it to life together. Reach out via WhatsApp or Instagram — we respond in under 24 hours."
          )}
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] text-white
                       text-[11px] tracking-[0.2em] uppercase px-8 py-4
                       hover:bg-[#1da851] transition-colors duration-300 font-sans"
          >
            <svg className="w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.118.554 4.103 1.523 5.826L.057 23.856a.5.5 0 00.609.609l6.03-1.466A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.648-.52-5.152-1.426l-.369-.22-3.827.93.93-3.827-.22-.37A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            WhatsApp
          </a>

          {/* Instagram */}
          <a
            href={`https://instagram.com/${IG_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border border-navy/30 text-navy
                       text-[11px] tracking-[0.2em] uppercase px-8 py-4
                       hover:bg-navy/6 hover:border-navy/55
                       transition-all duration-300 font-sans"
          >
            <svg className="w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Instagram
          </a>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-10 text-[11px] text-navy/35 tracking-[0.1em]"
        >
          {t(
            'También puedes escribirnos directamente desde cada producto ↑',
            'You can also reach out directly from each product above ↑'
          )}
        </motion.p>
      </motion.div>
    </section>
  )
}
