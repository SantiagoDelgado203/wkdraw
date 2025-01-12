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
      }
    },
  },
  plugins: [
    flowbite.plugin()
  ],
}

