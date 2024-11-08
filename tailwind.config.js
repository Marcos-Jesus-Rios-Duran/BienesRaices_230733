/** @type {import('tailwindcss').Config} */
export default {
  content: ['./views/**/*.pug'], // Escanea los archivos .pug en la carpeta views
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        verde: '#648E7F',
        azul: '#6F9CEB',
        rosa: '#ED6B86',
      },
    },
  },
  plugins: [],
}
