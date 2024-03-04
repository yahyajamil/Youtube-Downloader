/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      'display': ['Oswald'],
      'newTimes': ['"Times New Roman", Times, serif'],
      'sans': ['sans', 'system-ui', 'sans-serif'],
      'serif': ['sans-serif', 'serif'],
      'mono': ['monospace'],
    }
  },
  plugins: [],
}

