/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        halo: {
          bg: '#F4F6F8',
          surface: '#FFFFFF',
          border: '#E1E6EB',
          ink: '#0B1B2B',
          navy: '#0B1B2B',
          muted: '#5B6B7A',
          accent: '#7FD6D0',
          teal: '#2E9E96',
          success: '#2E9E6B',
          warning: '#D9962B',
          error: '#D14B4B',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        pill: '999px',
      },
      boxShadow: {
        'halo-card': '0 2px 10px rgba(11, 27, 43, 0.04), 0 1px 3px rgba(11, 27, 43, 0.02)',
        'halo-glow': '0 4px 20px -2px rgba(127, 214, 208, 0.35)',
        'halo-subtle': '0 8px 30px rgba(11, 27, 43, 0.06)',
        'halo-drawer': '-8px 0 32px rgba(11, 27, 43, 0.08)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(0.96)' },
        },
      },
      animation: {
        marquee: 'marquee 36s linear infinite',
        pulseSlow: 'pulseSlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
