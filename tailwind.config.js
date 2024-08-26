/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Poppins', 'sans-serif'],
      },
      height: {
        '790': '790px',
      },
      screens: {
        'custom': '830px',
      },
      colors: {
        elqui: {
          DEFAULT: '#433b24',
        },
        elqui2: {
          DEFAULT: '#82673B'
        }
      },
    },
  },
  plugins: [],
}