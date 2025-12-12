/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rfid': {
          'connected': '#10b981',
          'unstable': '#f59e0b',
          'disconnected': '#ef4444'
        },
        'priority': {
          'high': '#ef4444',
          'medium': '#f59e0b',
          'low': '#10b981'
        }
      }
    },
  },
  plugins: [],
}
