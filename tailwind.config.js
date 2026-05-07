/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brofind: {
          red: '#c9152f',
          blue: '#0b4f8a',
          navy: '#102a43',
          mist: '#f3f7fb',
          cyan: '#0ea5e9',
          green: '#138a60',
          amber: '#f59e0b'
        }
      },
      boxShadow: {
        soft: '0 16px 50px rgba(15, 23, 42, 0.10)'
      }
    }
  },
  plugins: []
};
