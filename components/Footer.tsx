'use client'
import { useLang } from '@/context/LangContext'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="bg-dark py-6 flex flex-col items-center gap-3 px-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/logo-main.png"
        alt="Studio G.D."
        className="w-36 logo-invert-dim"
      />
      <p className="text-[9px] tracking-[0.15em] text-cream/20 text-center leading-5">
        © {new Date().getFullYear()} Studio G.D. · Crafted with Intention ·{' '}
        {t('Todos los derechos reservados', 'All rights reserved')}
      </p>
    </footer>
  )
}
