'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/context/LangContext'

const links = [
  { href: '#nosotras',  es: 'Nosotras',  en: 'About'    },
  { href: '#productos', es: 'Productos',  en: 'Products' },
  { href: '#servicios', es: 'Servicios',  en: 'Services' },
  { href: '#contacto',  es: 'Contacto',  en: 'Contact'  },
]

export default function Navigation() {
  const { lang, toggle, t } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between overflow-visible
                    transition-all duration-500
                    ${scrolled
                      ? 'bg-navy/95 backdrop-blur-md py-2 px-6 md:px-12'
                      : 'bg-transparent py-3 px-6 md:px-12'}`}
      >
        <a href="#hero" className="absolute top-0 left-6 md:left-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logo-main.png"
            alt="Studio G.D."
            className="h-40 w-auto logo-invert transition-opacity hover:opacity-100"
            style={{ opacity: 0.95 }}
          />
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-9 list-none">
          {links.map(l => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-cream/75 hover:text-cream text-[11px] tracking-[0.22em]
                           uppercase font-sans transition-colors duration-200"
              >
                {lang === 'es' ? l.es : l.en}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: lang toggle + hamburger */}
        <div className="flex items-center gap-4 ml-auto">
          <button
            onClick={toggle}
            className="flex items-center gap-0 border border-cream/25 hover:border-cream/50
                       text-[10px] tracking-[0.18em] uppercase font-sans
                       transition-all duration-200 overflow-hidden"
            aria-label="Cambiar idioma / Switch language"
          >
            <span className={`px-3 py-1.5 transition-all duration-200
              ${lang === 'es'
                ? 'bg-cream/20 text-cream'
                : 'text-cream/40 hover:text-cream/70'}`}>
              ES
            </span>
            <span className="text-cream/25 select-none">|</span>
            <span className={`px-3 py-1.5 transition-all duration-200
              ${lang === 'en'
                ? 'bg-cream/20 text-cream'
                : 'text-cream/40 hover:text-cream/70'}`}>
              EN
            </span>
          </button>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-1"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={t('Menú', 'Menu')}
          >
            <span className={`block w-6 h-px bg-cream transition-transform duration-300
                              ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
            <span className={`block w-6 h-px bg-cream transition-opacity duration-300
                              ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-cream transition-transform duration-300
                              ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-navy flex flex-col items-center justify-center gap-10"
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={closeMenu}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: i * 0.07, duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-cream/75 hover:text-cream text-[13px] tracking-[0.28em]
                           uppercase font-sans transition-colors"
              >
                {lang === 'es' ? l.es : l.en}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
