import type { Config } from 'tailwindcss';

const ink = '#211f1c';

const config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        // mobile layout up to 768px, 2×2 tablet layout up to 1200px,
        // then the 3-column desktop mockup (it needs ~1200px)
        // `sm` = `md`: below 768 px the mobile page is zoomed from 384 px, so a
        // 640 px breakpoint would never match what the user sees
        sm: '48rem',
        md: '48rem',
        lg: '75rem',
      },
      colors: {
        ink: {
          DEFAULT: ink,
          soft: '#4a4640',
          muted: '#7a7368',
        },
        paper: {
          DEFAULT: '#f8f5e3',
          muted: '#e9ddc0',
          deep: '#e6d9b9',
          shade: '#d9c9a3',
        },
        navy: {
          DEFAULT: '#34497e',
          dark: '#273962',
          light: '#5f74ad',
          muted: '#6f7c8c',
        },
        terracotta: {
          DEFAULT: '#c9663d',
          dark: '#a7502c',
          light: '#e08b63',
        },
        fern: {
          DEFAULT: '#3f8b6c',
          dark: '#2e6c53',
          light: '#76b096',
        },
        mustard: {
          DEFAULT: '#d8a936',
          dark: '#b48a22',
          light: '#ecc96b',
        },
        traffic: {
          red: '#df6352',
          amber: '#e5b03d',
          green: '#4ea86f',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Arial Narrow', 'Arial', 'sans-serif'],
        display: ['var(--font-display)', 'Impact', 'Arial Black', 'sans-serif'],
      },
      maxWidth: {
        frame: '86rem',
      },
      borderRadius: {
        frame: '1.25rem',
      },
      boxShadow: {
        frame: '0 30px 80px -40px rgb(33 31 28 / 0.55)',
        press: `2px 2px 0 0 ${ink}`,
        tile: '0 6px 14px -6px rgb(33 31 28 / 0.45)',
      },
      backgroundImage: {
        ruled: `repeating-linear-gradient(to bottom, transparent 0, transparent calc(2rem - 1.5px), ${ink} calc(2rem - 1.5px), ${ink} 2rem)`,
      },
    },
  },
} satisfies Config;

export default config;
