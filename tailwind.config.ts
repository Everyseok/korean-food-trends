import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Apple-inspired design tokens
        bg: {
          base: '#F5F5F7',
          surface: '#FFFFFF',
          elevated: '#FAFAFA',
        },
        gray: {
          50: '#F5F5F7',
          100: '#F2F2F7',
          200: '#E5E5EA',
          300: '#D1D1D6',
          400: '#C7C7CC',
          500: '#AEAEB2',
          600: '#8E8E93',
          700: '#6E6E73',
          800: '#3A3A3C',
          900: '#1D1D1F',
        },
        accent: {
          DEFAULT: '#0071E3',
          hover: '#0077ED',
          light: '#E8F0FB',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Pretendard Variable"',
          'Pretendard',
          '"Noto Sans KR"',
          'sans-serif',
        ],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.10)',
        modal: '0 20px 60px rgba(0,0,0,0.15)',
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
};

export default config;
