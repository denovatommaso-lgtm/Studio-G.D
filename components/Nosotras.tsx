'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '@/context/LangContext'

gsap.registerPlugin(ScrollTrigger)

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

export default function Nosotras() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef    = useRef<HTMLDivElement>(null)
  const imgRef     = useRef<HTMLDivElement>(null)
  const { lang, t } = useLang()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(textRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )
      gsap.fromTo(imgRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="nosotras" className="bg-navy">
      <div className="max-w-[1160px] mx-auto px-6 md:px-12 py-24 md:py-32
                      grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">

        {/* Text */}
        <div ref={textRef} className="opacity-0">
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

          <ul className="flex flex-col gap-5">
            {values.map((v, i) => (
              <li key={i} className="flex gap-4 items-start">
                <div className="w-1 h-1 rounded-full bg-taupe mt-[9px] flex-shrink-0" />
                <p className="text-[13px] leading-[1.75] text-cream/55 font-light">
                  {lang === 'es' ? v.es : v.en}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Photo placeholder */}
        <div ref={imgRef} className="opacity-0 flex justify-center">
          <div className="w-full max-w-[360px] aspect-[3/4] border border-taupe/20
                          bg-taupe/5 flex flex-col items-center justify-center gap-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/isotipo.png" alt="" className="w-14 logo-invert-dim" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-taupe/40 text-center px-6">
              {t('Foto de Mariana y Lor', 'Photo of Mariana & Lor')}
            </span>
          </div>
        </div>

      </div>
    </section>
  )
}
