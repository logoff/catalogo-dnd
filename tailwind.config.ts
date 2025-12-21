import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'
import forms from '@tailwindcss/forms'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dnd: {
          red: {
            DEFAULT: '#e10303',
            light: '#e61720',
            dark: '#9e0b0f',
          },
          gold: {
            DEFAULT: '#c9a227',
            light: '#d4b94f',
            dark: '#a68b1f',
          },
          stone: {
            DEFAULT: '#2d2d2d',
            light: '#3d3d3d',
            dark: '#1a1a1a',
          },
        },
        language: {
          english: '#1e40af',
          castellano: '#b91c1c',
        },
        productType: {
          book: '#065f46',
          boxed_set: '#7c2d12',
          accessory: '#4338ca',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'Georgia', 'serif'],
        body: ['Lato', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [typography, forms],
}

export default config
