/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-space-purple': '#2D1B69',
        'dark-matter': '#13073A',
        'electric-lavender': '#C376FF',
        'cosmic-glow': '#8449FF',
        'neon-violet': '#9921E8',
        'cyberpunk-pink': '#FF5EFC',
        'holographic-silver': '#E9EAFF',
        'quantum-blue': '#3B1DFF',
      },
    },
  },
  plugins: [],
}
