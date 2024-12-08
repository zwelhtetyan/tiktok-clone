/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },

      colors: {
        primary: 'rgb(254 44 85)',
        dark: '#121212',
        darkSecondary: '#2F2F2F',
        darkBorder: 'rgb(255,255,255,.12)',
        darkBtn: 'rgba(255,255,255,0.08)',
        darkBtnHover: 'rgb(255,255,255,.04)',
      },

      backgroundImage: {
        'img-blur-light': 'url(/blur-img-light.jpg)',
        'img-blur-dark': 'url(/blur-img-dark.jpeg)',
      },

      gridTemplateColumns: {
        'auto-fill-180': 'repeat(auto-fill, minmax(180px, 1fr))',
        'auto-fill-200': 'repeat(auto-fill, minmax(200px, 1fr))',
      },
    },
  },
};
