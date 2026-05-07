'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '@/context/LangContext'

gsap.registerPlugin(ScrollTrigger)

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

export default function Servicios() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef   = useRef<HTMLDivElement>(null)
  const { lang, t } = useLang()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardsRef.current?.children ?? [],
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0,
          duration: 0.75,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 80%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="servicios" className="bg-cream">
      <div className="max-w-[1160px] mx-auto px-6 md:px-12 py-24 md:py-32">

        <div className="text-center max-w-lg mx-auto mb-16">
          <span className="section-label">{t('Lo que hacemos', 'What we do')}</span>
          <h2 className="section-title">
            {t('Nuestros', 'Our')} <em>{t('servicios', 'services')}</em>
          </h2>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-0.5">
          {services.map(s => (
            <div
              key={s.nameEs}
              className="group bg-parchment p-12 text-center
                         hover:bg-navy transition-colors duration-500 cursor-default"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
