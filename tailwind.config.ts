import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      keyframes: {
        'digit-in': {
          from: { opacity: '0', transform: 'translateY(-10px) scale(0.96)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'modal-in': {
          from: { opacity: '0', transform: 'scale(0.96) translateY(10px)' },
          to:   { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'modal-out': {
          from: { opacity: '1', transform: 'scale(1) translateY(0)' },
          to:   { opacity: '0', transform: 'scale(0.96) translateY(10px)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(10px) scale(0.97)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-10px) scale(0.97)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.88)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0.5' },
        },
      },
      animation: {
        'digit-in':  'digit-in 0.14s cubic-bezier(0.22,1,0.36,1) forwards',
        'modal-in':  'modal-in 0.28s cubic-bezier(0.22,1,0.36,1) forwards',
        'modal-out': 'modal-out 0.18s ease-in forwards',
        'slide-up':  'slide-up 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
        'slide-down':'slide-down 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':   'fade-in 0.4s ease-out both',
        'scale-in':  'scale-in 0.22s cubic-bezier(0.22,1,0.36,1) forwards',
        'pulse-glow':'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
