'use client'
import { createContext, useContext, useState, useCallback } from 'react'

type Lang = 'es' | 'en'

interface LangContextType {
  lang: Lang
  toggle: () => void
  t: (es: string, en: string) => string
}

const LangContext = createContext<LangContextType>({
  lang: 'es',
  toggle: () => {},
  t: (es) => es,
})

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('es')

  const toggle = useCallback(() => {
    setLang(prev => (prev === 'es' ? 'en' : 'es'))
  }, [])

  const t = useCallback(
    (es: string, en: string) => (lang === 'es' ? es : en),
    [lang]
  )

  return (
    <LangContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
