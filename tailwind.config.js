/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates/*.html", "./static/js/*.js"],
  theme: {
    extend: {
      animation: {
        loader: "loaderAnimation 675ms ease-in-out infinite",
      },
      keyframes: {
        loaderAnimation: {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
      },
    },
  },
  plugins: [],
};
