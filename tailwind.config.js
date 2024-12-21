/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        secondary: '#9333EA',
        accent: '#F59E0B',
        textPrimary: '#030303',
        textPlaceholder: '#94A3B8',
        background: '#EDF0FF',
      },
      fontFamily: {
        // Custom fonts
        body: ['LexendDeca-Regular', 'sans-serif'],
        heading: ['LexendDeca-Medium', 'sans-serif'],
      },
    },
  },
  plugins: [],
}