/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#60A5FA', // Blue 400
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#CBD5E1', // Slate 300
          foreground: '#1E293B', // Slate 800
        },
        destructive: {
          DEFAULT: '#dc2626',
          foreground: '#fff',
        },
        muted: {
          DEFAULT: '#334155', // Slate 700
          foreground: '#94A3B8', // Slate 400
        },
        accent: {
          DEFAULT: '#1E293B', // Slate 800
          foreground: '#F8FAFC' // Slate 50
        },
        card: {
          DEFAULT: '#1E293B', // Slate 800
          foreground: '#F8FAFC' // Slate 50
        },
        border: '#334155', // Slate 700
        input: '#1E293B', // Slate 800
      },
      borderRadius: {
        md: '0.375rem', // 6px
        lg: '0.5rem',   // 8px
        xl: '0.75rem'   // 12px
      }
    },
  },
  plugins: [],
}
