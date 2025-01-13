/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", "./public/index.html",
    flowbite.content(),
    
  ],
  theme: {
    extend: {
      boxShadow: {
        'wk': 'rgba(0, 0, 0, 0.2) 0px -3px 0px inset, rgba(255, 255, 255, 0.5) 0px 0px 10px',
        'canvas': '0 0 20px rgb(0 0 0 / 0.05)'
      },
      dropShadow: {
        glow: [
          "0 0px 20px rgba(255,255, 255, 0.35)",
          "0 0px 65px rgba(255, 255,255, 0.2)"
        ]
      }
    
    },
  },
  plugins: [
    flowbite.plugin()
  ],
}

