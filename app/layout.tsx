import type { Metadata } from 'next'
import { Cormorant_Garamond, Great_Vibes, Jost } from 'next/font/google'
import './globals.css'
import { LangProvider } from '@/context/LangContext'

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const greatVibes = Great_Vibes({
  variable: '--font-greatvibes',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

const jost = Jost({
  variable: '--font-jost',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Studio G.D. — Crafted with Intention',
  description: 'Papelería personalizada diseñada con intención. Custom stationery crafted with care.',
  keywords: ['papelería personalizada', 'stationery', 'invitaciones de boda', 'wedding stationery', 'Studio GD'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${greatVibes.variable} ${jost.variable}`}
    >
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  )
}
