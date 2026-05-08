'use client'
import { motion } from 'framer-motion'
import { useLang } from '@/context/LangContext'

export default function Footer() {
  const { t } = useLang()
  return (
    <motion.footer
      className="bg-dark py-12 flex flex-col items-center gap-5 px-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/logo-main.png"
        alt="Studio G.D."
        className="w-28 logo-invert-dim"
      />
      <div className="w-10 h-px bg-cream/10" />
      <p className="text-[10px] tracking-[0.15em] text-cream/25 text-center leading-6">
        © {new Date().getFullYear()} Studio G.D. · Crafted with Intention · Stationery<br />
        {t('Todos los derechos reservados', 'All rights reserved')}
      </p>
    </motion.footer>
  )
}
