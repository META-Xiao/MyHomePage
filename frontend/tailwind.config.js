/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#0a0e27',
        'accent': {
          DEFAULT: '#00d4ff',
          secondary: '#00ff87'
        }
      },
      fontFamily: {
        sans: ['Noto Sans SC', 'Microsoft YaHei', 'sans-serif'],
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["dark"],
  },
}

