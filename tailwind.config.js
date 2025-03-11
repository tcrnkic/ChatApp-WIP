/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: '#09182F',
        maindark: '#041023',
      },
      fontFamily:{
        body: ['Karla']
      }
    },
  },
  plugins: [],
}

