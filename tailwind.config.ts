import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy:      '#1e2535',
        taupe:     '#b5aa96',
        cream:     '#e8e4d8',
        sage:      '#8fa0a0',
        olive:     '#8a7a35',
        parchment: '#f9f7f3',
        dark:      '#141820',
      },
      fontFamily: {
        serif:  ['var(--font-cormorant)', 'Georgia', 'serif'],
        script: ['var(--font-greatvibes)', 'cursive'],
        sans:   ['var(--font-jost)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
