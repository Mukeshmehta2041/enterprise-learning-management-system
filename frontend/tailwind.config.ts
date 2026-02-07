import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Colors are now managed in src/index.css using Tailwind 4 @theme
    },
  },
  plugins: [],
}

export default config

