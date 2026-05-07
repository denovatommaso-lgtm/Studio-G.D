'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProductCard, { type ProductData } from './ProductCard'
import { useLang } from '@/context/LangContext'

gsap.registerPlugin(ScrollTrigger)

const PRODUCTS: ProductData[] = [
  {
    number: '01',
    nameEs: 'Tarjetas de Papelería',
    nameEn: 'Stationery Cards',
    descEs: 'Tarjetas elegantes para toda ocasión. Diseñadas con materiales de la más alta calidad, personalizadas con tu mensaje, nombre o logo.',
    descEn: 'Elegant cards for every occasion. Crafted with the finest materials, personalized with your message, name, or logo.',
    stamp: '/assets/stamp-cream.png',
    bgClass: 'bg-cream',
    panelBg: 'bg-[#dedad4]',
    fields: [
      { name: 'ocasion', labelEs: 'Ocasión', labelEn: 'Occasion', type: 'select',
        options: ['Cumpleaños / Birthday', 'Agradecimiento / Thank You', 'Navidad / Holiday', 'Bienvenida / Welcome', 'Otra / Other'] },
      { name: 'cantidad', labelEs: 'Cantidad', labelEn: 'Quantity', type: 'select',
        options: ['10–25', '25–50', '50–100', '100+'] },
      { name: 'texto', labelEs: 'Texto a imprimir', labelEn: 'Text to print', type: 'text',
        placeholderEs: 'Ej: Gracias por estar aquí', placeholderEn: 'E.g.: Thank you for being here', fullWidth: true },
      { name: 'colores', labelEs: 'Paleta de colores', labelEn: 'Color palette', type: 'select',
        options: ['Neutros / Neutrals', 'Azul marino / Navy', 'Verde salvia / Sage', 'Dorado / Gold', 'Rosa / Blush', 'Sorpréndame / Surprise me'] },
      { name: 'nombre', labelEs: 'Tu nombre', labelEn: 'Your name', type: 'text',
        placeholderEs: 'Mariana', placeholderEn: 'Mariana' },
      { name: 'notas', labelEs: 'Notas adicionales', labelEn: 'Additional notes', type: 'textarea',
        placeholderEs: 'Cuéntanos más sobre lo que imaginas...', placeholderEn: 'Tell us more about what you have in mind...', fullWidth: true },
    ],
  },
  {
    number: '02',
    nameEs: 'Tarjetas Artesanales',
    nameEn: 'Handmade Cards',
    descEs: 'Elaboradas a mano con amor y detalle. Cada tarjeta es única, con papeles texturizados, sellos de cera, listones y elementos irrepetibles.',
    descEn: 'Handcrafted with love and detail. Each card is one-of-a-kind — textured papers, wax seals, ribbons, and elements that make it truly unique.',
    stamp: '/assets/stamp-sage.png',
    bgClass: 'bg-[#e4e1db]',
    panelBg: 'bg-[#d8d5cf]',
    fields: [
      { name: 'ocasion', labelEs: 'Ocasión', labelEn: 'Occasion', type: 'select',
        options: ['Cumpleaños / Birthday', 'Boda / Wedding', 'Baby shower', 'Aniversario / Anniversary', 'Otra / Other'] },
      { name: 'cantidad', labelEs: 'Cantidad', labelEn: 'Quantity', type: 'select',
        options: ['1–5', '5–15', '15–30', '30+'] },
      { name: 'mensaje', labelEs: 'Mensaje a incluir', labelEn: 'Message to include', type: 'text',
        placeholderEs: 'Ej: Con todo mi amor', placeholderEn: 'E.g.: With all my love', fullWidth: true },
      { name: 'elementos', labelEs: 'Elementos decorativos', labelEn: 'Decorative elements', type: 'select',
        options: ['Sello de cera / Wax seal', 'Listón / Ribbon', 'Flores secas / Dried flowers', 'Sorpréndame / Surprise me'] },
      { name: 'papel', labelEs: 'Estilo de papel', labelEn: 'Paper style', type: 'select',
        options: ['Crema / Cream', 'Blanco / White', 'Kraft', 'Negro / Black'] },
      { name: 'nombre', labelEs: 'Tu nombre', labelEn: 'Your name', type: 'text',
        placeholderEs: 'Lorena', placeholderEn: 'Lorena' },
      { name: 'notas', labelEs: 'Notas adicionales', labelEn: 'Additional notes', type: 'textarea',
        placeholderEs: 'Cuéntanos más...', placeholderEn: 'Tell us more...', fullWidth: true },
    ],
  },
  {
    number: '03',
    nameEs: 'Paquete Familiar',
    nameEn: 'Family Stationery Package',
    descEs: 'Un conjunto completo con el nombre de tu familia. Tarjetas, sobres y etiquetas de dirección que dan un toque especial a cada correspondencia.',
    descEn: 'A complete set bearing your family name. Notecards, envelopes, and address labels that add an elegant touch to every correspondence.',
    stamp: '/assets/stamp-taupe.png',
    bgClass: 'bg-[#e6e3dd]',
    panelBg: 'bg-[#dad7d1]',
    fields: [
      { name: 'familia', labelEs: 'Nombre de la familia', labelEn: 'Family name', type: 'text',
        placeholderEs: 'Familia García', placeholderEn: 'The García Family', required: true },
      { name: 'direccion', labelEs: 'Dirección de retorno', labelEn: 'Return address', type: 'text',
        placeholderEs: 'Ciudad, Estado', placeholderEn: 'City, State' },
      { name: 'incluir', labelEs: 'Incluir en el paquete', labelEn: 'Package contents', type: 'select',
        options: ['Tarjetas + Sobres / Cards + Envelopes', 'Tarjetas + Sobres + Etiquetas', 'Paquete completo / Full package', 'A definir / To be defined'] },
      { name: 'papel', labelEs: 'Papel preferido', labelEn: 'Paper preference', type: 'select',
        options: ['Crema / Cream', 'Blanco / White', 'Kraft'] },
      { name: 'sets', labelEs: 'Cantidad de sets', labelEn: 'Number of sets', type: 'select',
        options: ['1', '2–3', '4+'] },
      { name: 'nombre', labelEs: 'Tu nombre', labelEn: 'Your name', type: 'text',
        placeholderEs: 'Mariana', placeholderEn: 'Mariana' },
      { name: 'notas', labelEs: 'Notas adicionales', labelEn: 'Additional notes', type: 'textarea',
        placeholderEs: '¿Algo especial que quieras incluir?', placeholderEn: 'Anything special to include?', fullWidth: true },
    ],
  },
  {
    number: '04',
    nameEs: 'Paquete de Boda',
    nameEn: 'Wedding Stationery Package',
    descEs: 'Papelería completa para tu gran día. Invitaciones, tarjetas de respuesta, menús, programas, lugares y tarjetas de agradecimiento.',
    descEn: 'Complete stationery for your big day. Invitations, RSVP cards, menus, programs, place cards, and thank you notes.',
    stamp: '/assets/stamp-navy.png',
    bgClass: 'bg-cream',
    panelBg: 'bg-[#dedad4]',
    fields: [
      { name: 'novios', labelEs: 'Nombres de los novios', labelEn: 'Names of the couple', type: 'text',
        placeholderEs: 'Mariana & Diego', placeholderEn: 'Mariana & Diego', required: true },
      { name: 'fecha', labelEs: 'Fecha de la boda', labelEn: 'Wedding date', type: 'text',
        placeholderEs: 'Ej: 15 de noviembre, 2025', placeholderEn: 'E.g.: November 15, 2025' },
      { name: 'invitados', labelEs: 'Número de invitados', labelEn: 'Guest count', type: 'select',
        options: ['Menos de 50 / Under 50', '50–100', '100–200', '200+'] },
      { name: 'estilo', labelEs: 'Estilo de boda', labelEn: 'Wedding style', type: 'select',
        options: ['Clásico / Classic', 'Romántico / Romantic', 'Rústico / Rustic', 'Moderno / Modern', 'Bohemio / Boho', 'Jardín / Garden'] },
      { name: 'elementos', labelEs: 'Elementos del paquete', labelEn: 'Package items', type: 'select',
        options: ['Invitaciones + RSVPs', 'Invitaciones + RSVPs + Programas', 'Paquete completo / Full package', 'A definir / To be defined'] },
      { name: 'colores', labelEs: 'Paleta de colores', labelEn: 'Color palette', type: 'text',
        placeholderEs: 'Ej: Neutros y verde salvia', placeholderEn: 'E.g.: Neutrals and sage green' },
      { name: 'nombre', labelEs: 'Tu nombre', labelEn: 'Your name', type: 'text',
        placeholderEs: 'Mariana', placeholderEn: 'Mariana' },
      { name: 'telefono', labelEs: 'Tu WhatsApp', labelEn: 'Your WhatsApp', type: 'tel',
        placeholderEs: '+52 55 0000 0000', placeholderEn: '+52 55 0000 0000' },
      { name: 'vision', labelEs: 'Cuéntanos tu visión', labelEn: 'Tell us your vision', type: 'textarea',
        placeholderEs: 'Describe el estilo, colores, referencias o detalles especiales de tu boda...',
        placeholderEn: 'Describe the style, colors, references, or special details of your wedding...', fullWidth: true },
    ],
  },
]

export default function Products() {
  const sectionRef  = useRef<HTMLElement>(null)
  const introRef    = useRef<HTMLDivElement>(null)
  const gridRef     = useRef<HTMLDivElement>(null)
  const { t }       = useLang()

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro text reveals
      gsap.fromTo(introRef.current?.children ?? [],
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: introRef.current,
            start: 'top 80%',
          },
        }
      )

      // Cards stagger in
      gsap.fromTo(gridRef.current?.children ?? [],
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 78%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="productos" className="bg-parchment">
      <div className="max-w-[1160px] mx-auto px-6 md:px-12 py-24 md:py-32">

        {/* Intro */}
        <div ref={introRef}
             className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 mb-20 items-end">
          <div>
            <span className="section-label">{t('Nuestros productos', 'Our products')}</span>
            <h2 className="section-title">
              {t('Cada pieza,', 'Every piece,')} <em>{t('única para ti', 'unique for you')}</em>
            </h2>
            <div className="flex items-center gap-4 mt-6 mb-0">
              <div className="flex-1 h-px bg-cream" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/isotipo.png" alt="" className="h-7 logo-taupe" />
              <div className="flex-1 h-px bg-cream" />
            </div>
          </div>
          <p className="text-[15px] leading-[1.85] text-navy/55 font-light">
            {t(
              'Diseñamos y elaboramos papelería personalizada que cuenta tu historia. Cada producto es completamente personalizable — completa el formulario y nos ponemos en contacto contigo para hacerlo realidad.',
              'We design and craft custom stationery that tells your story. Every product is fully personalizable — fill out the form and we\'ll reach out to bring it to life together.'
            )}
          </p>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-0.5"
        >
          {PRODUCTS.map(p => (
            <ProductCard key={p.number} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
