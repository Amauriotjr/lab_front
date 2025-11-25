/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'banese-green': '#024A24',
        'banese-green-light': '#046830',
      },
    },
  },
  plugins: [],
};
