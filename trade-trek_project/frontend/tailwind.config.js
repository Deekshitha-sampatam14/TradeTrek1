module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./public/index.html" 
  ],
  theme: {
    extend: {
      backgroundImage: {
        'service': "url('../public/service.jpg')",
      }
    },
  },
  plugins: [],
}


