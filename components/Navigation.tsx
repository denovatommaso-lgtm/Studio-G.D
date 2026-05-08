'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useLang } from '@/context/LangContext'

const links = [
  { href: '#nosotras',  es: 'Nosotras',  en: 'About'    },
  { href: '#productos', es: 'Productos',  en: 'Products' },
  { href: '#servicios', es: 'Servicios',  en: 'Services' },
  { href: '#contacto',  es: 'Contacto',  en: 'Contact'  },
]

interface Props {
  introReady?: boolean
}

export default function Navigation ({ introReady }: Props) {
  const { lang, toggle, t } = useLang()
  const navRef              = useRef<HTMLElement>(null)
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  // Scroll-based nav style
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // GSAP entrance — waits for intro to complete
  useEffect(() => {
    if (!introReady) return
    gsap.fromTo(navRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.45 }
    )
  }, [introReady])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between
                    transition-all duration-500 opacity-0
                    ${scrolled
                      ? 'bg-navy/95 backdrop-blur-md py-3 px-6 md:px-12'
                      : 'bg-transparent py-5 px-6 md:px-12'}`}
      >
        {/* Logo */}
        <a href="#hero" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/isotipo.png"
            alt="Studio G.D."
            className="h-10 w-auto logo-invert transition-opacity hover:opacity-100"
            style={{ opacity: 0.85 }}
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

        {/* Right: lang + hamburger */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            className="border border-cream/25 text-cream/70 hover:text-cream hover:border-cream/50
                       text-[10px] tracking-[0.18em] uppercase px-3 py-1.5
                       transition-all duration-200 font-sans"
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-1"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            <span className={`block w-6 h-px bg-cream transition-transform duration-300
                              ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
            <span className={`block w-6 h-px bg-cream transition-opacity duration-300
                              ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-cream transition-transform duration-300
                              ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-navy flex flex-col items-center justify-center
                    gap-10 transition-opacity duration-300
                    ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {links.map(l => (
          <a
            key={l.href}
            href={l.href}
            onClick={closeMenu}
            className="text-cream/75 hover:text-cream text-[13px] tracking-[0.28em]
                       uppercase font-sans transition-colors"
          >
            {lang === 'es' ? l.es : l.en}
          </a>
        ))}
      </div>
    </>
  )
}
