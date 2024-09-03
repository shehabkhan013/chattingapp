/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {},
    fontFamily: {
      fontReguler: ['roboto-reguler'],
      fontBold: ['roboto-bold'],
      fontMedium: ['roboto-medium'],
      fontLight: ['roboto-light'],
      fontThin: ['roboto-thin'],
      fontBlack: ['roboto-black']
    }
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-thin": {
          scrollbarWidth: "thin",
          scrollbarColor: "rgb(31,29,29) white",
        },

        ".scrollbar-webkit": {
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "white",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgb(31,41,55)",
            borderRadius: "20px",
            border: "1px solid white",
          }
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover', 'focus'])
    },
  ],
}

