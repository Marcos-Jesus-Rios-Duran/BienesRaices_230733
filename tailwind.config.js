/** @type {import('tailwindcss').Config} */
export default {
  content: ['./views/**/*.pug'], // Escanea los archivos .pug en la carpeta views
  theme: {
    extend: {},
    colors: {
      'black': '#000000',
      'white': '#FFFFFF',
      'greenish': '#6A8E7F',
      'light_blue': '#6F9CEB',
      'pink': '#ED6B86'
    },
  },
  plugins: [],
}
