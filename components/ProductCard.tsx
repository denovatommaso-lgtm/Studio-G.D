'use client'
import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { insertOrder } from '@/lib/supabase'
import { useLang } from '@/context/LangContext'

export interface ProductField {
  name: string
  labelEs: string
  labelEn: string
  type: 'text' | 'tel' | 'select' | 'textarea'
  placeholderEs?: string
  placeholderEn?: string
  options?: string[]
  required?: boolean
  fullWidth?: boolean
}

export interface ProductData {
  number: string
  nameEs: string
  nameEn: string
  descEs: string
  descEn: string
  stamp: string
  bgClass: string
  panelBg: string
  fields: ProductField[]
}

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER  ?? '521XXXXXXXXXX'
const IG_HANDLE = process.env.NEXT_PUBLIC_IG_HANDLE ?? 'studiogd.stationery'

function buildWhatsAppMessage(
  productName: string,
  data: Record<string, string>,
  lang: 'es' | 'en'
) {
  const intro = lang === 'es'
    ? `¡Hola Studio G.D.! Me gustaría personalizar: *${productName}*\n\n`
    : `Hello Studio G.D.! I'd like to customize: *${productName}*\n\n`

  const body = Object.entries(data)
    .filter(([, v]) => v.trim())
    .map(([k, v]) => `*${k.charAt(0).toUpperCase() + k.slice(1)}:* ${v}`)
    .join('\n')

  const outro = lang === 'es'
    ? `\n\n¡Quedo en espera de su respuesta!`
    : `\n\nLooking forward to hearing from you!`

  return encodeURIComponent(intro + body + outro)
}

interface Props { product: ProductData }

export default function ProductCard({ product }: Props) {
  const { lang, t }         = useLang()
  const [open, setOpen]     = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const formRef             = useRef<HTMLFormElement>(null)

  const name = lang === 'es' ? product.nameEs : product.nameEn
  const desc = lang === 'es' ? product.descEs : product.descEn

  const togglePanel = () => {
    setOpen(o => !o)
    if (!open) {
      setTimeout(() => {
        document.getElementById(`panel-${product.number}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 120)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')

    const fd   = new FormData(e.currentTarget)
    const data: Record<string, string> = {}
    fd.forEach((v, k) => { if (String(v).trim()) data[k] = String(v) })

    const productName = lang === 'es' ? product.nameEs : product.nameEn

    try {
      await insertOrder({ product_name: productName, form_data: data, lang })
      setStatus('success')
      const msg = buildWhatsAppMessage(productName, data, lang)
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank')
      setTimeout(() => { formRef.current?.reset(); setStatus('idle') }, 2000)
    } catch {
      const msg = buildWhatsAppMessage(productName, data, lang)
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <div className={product.bgClass}>

      {/* ── Row ────────────────────────────────────────────────────────────── */}
      <div className="max-w-[1160px] mx-auto px-6 md:px-12 py-12 md:py-16
                      flex flex-col md:flex-row md:items-center gap-6 md:gap-14">

        {/* Ghost number — desktop */}
        <span
          className="hidden md:block font-serif text-[100px] leading-none
                     text-navy/[0.055] select-none w-[110px] text-right flex-shrink-0"
        >
          {product.number}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.stamp} alt="" className="w-[18px] h-auto opacity-35" />
            <span className="text-[9px] tracking-[0.32em] uppercase text-taupe">
              {product.number}
            </span>
          </div>
          <h3 className="font-serif text-[26px] md:text-[30px] font-normal text-navy
                         leading-tight mb-3">
            {name}
          </h3>
          <p className="text-[13px] leading-[1.85] text-navy/50 font-light max-w-[540px]">
            {desc}
          </p>
        </div>

        {/* CTA */}
        <div className="flex-shrink-0">
          <button
            onClick={togglePanel}
            className="group inline-flex items-center gap-2.5
                       text-[10px] tracking-[0.25em] uppercase font-sans text-navy"
          >
            <span className="border-b border-navy/35 pb-px
                             group-hover:border-navy transition-colors duration-200">
              {open ? t('Cerrar', 'Close') : t('Personalizar', 'Customize')}
            </span>
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
              className="leading-none"
            >
              ↓
            </motion.span>
          </button>
        </div>
      </div>

      {/* ── Form panel ─────────────────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`panel-${product.number}`}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className={`${product.panelBg} overflow-hidden`}
          >
            <div className="max-w-[1160px] mx-auto px-6 md:px-12 py-10 md:py-12">

              {/* Panel header */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-navy/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.stamp} alt="" className="w-9 h-auto opacity-40" />
                <div>
                  <p className="text-[9px] tracking-[0.3em] uppercase text-taupe mb-1">
                    {t('Personaliza tu pedido', 'Customize your order')}
                  </p>
                  <p className="font-serif text-[18px] text-navy font-normal leading-tight">
                    {name}
                  </p>
                </div>
              </div>

              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                {product.fields.map((field) => (
                  <div key={field.name} className={field.fullWidth ? 'md:col-span-2' : ''}>
                    <label className="section-label !mb-1.5">
                      {lang === 'es' ? field.labelEs : field.labelEn}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        name={field.name}
                        className="form-input resize-none min-h-[68px]"
                        placeholder={lang === 'es' ? field.placeholderEs : field.placeholderEn}
                        required={field.required}
                      />
                    ) : field.type === 'select' ? (
                      <select name={field.name} className="form-input cursor-pointer"
                              required={field.required}>
                        {field.options?.map(o => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        className="form-input"
                        placeholder={lang === 'es' ? field.placeholderEs : field.placeholderEn}
                        required={field.required}
                      />
                    )}
                  </div>
                ))}

                {/* Actions */}
                <div className="md:col-span-2 flex flex-wrap items-center gap-5 mt-3
                                pt-5 border-t border-navy/10">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="inline-flex items-center gap-2.5 bg-navy text-cream
                               text-[10px] tracking-[0.22em] uppercase px-8 py-3.5
                               hover:bg-navy/80 transition-colors duration-300 font-sans
                               disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.118.554 4.103 1.523 5.826L.057 23.856a.5.5 0 00.609.609l6.03-1.466A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.648-.52-5.152-1.426l-.369-.22-3.827.93.93-3.827-.22-.37A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                    </svg>
                    {status === 'loading'
                      ? t('Enviando…', 'Sending…')
                      : status === 'success'
                      ? t('¡Enviado! ✓', 'Sent! ✓')
                      : t('Enviar por WhatsApp', 'Send via WhatsApp')}
                  </button>

                  <button
                    type="button"
                    onClick={() => window.open(`https://instagram.com/${IG_HANDLE}`, '_blank')}
                    className="text-[11px] text-taupe underline underline-offset-4
                               hover:text-navy transition-colors duration-200 font-sans"
                  >
                    {t('¿Algo más específico? Escríbenos', 'Something more specific? Message us')}
                  </button>
                </div>

                {status === 'error' && (
                  <p className="md:col-span-2 text-[11px] text-taupe/70">
                    {t(
                      'WhatsApp abierto. Si Supabase falla, tu pedido igual fue enviado.',
                      'WhatsApp opened. If Supabase fails, your order was still sent.'
                    )}
                  </p>
                )}
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
