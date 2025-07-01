/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
        inter: ['Inter', '-apple-system', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        blink: 'blink 1s infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { boxShadow: '0 0 20px 1px rgba(350, 0, 0, 0.8)' },
          '50%': { boxShadow: '0 0 20px 7px rgba(350, 0, 0, 1)' },
        },
      },
      keyframes: {
        vibrate: {
          "0%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(-2px, 2px)" },
          "50%": { transform: "translate(2px, -2px)" },
          "75%": { transform: "translate(-2px, -2px)" },
          "100%": { transform: "translate(0, 0)" },
        },
      },


         keyframes: {
        burst: {
          '0%': {
            transform: 'scale(0.8) rotate(0deg)',
            opacity: '0.2',
          },
          '50%': {
            transform: 'scale(1.3) rotate(20deg)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(1) rotate(0deg)',
            opacity: '0',
          },
        },
      },

      
      animation: {
        vibrate: "vibrate 0.1s linear infinite",

              burst: 'burst 0.6s ease-out',
      },

    },
  },
  plugins: [],
};



