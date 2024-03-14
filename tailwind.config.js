/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      boxShadow: {
        border: "rgba(242, 242, 242, 0.1) 0px 0px 0px 1px",
        "border-t": "rgba(242, 242, 242, 0.1) 0px 1px 0px 0px",
        "border-b": "rgba(242, 242, 242, 0.1) 0px -1px 0px 0px",
        "border-l": "rgba(242, 242, 242, 0.1) 1px 0px 0px 0px",
        "border-r": "rgba(242, 242, 242, 0.1) -1px 0px 0px 0px",
        "border-inner": "rgba(242, 242, 242, 0.1) 0px 0px 0px 1px inset",
        "border-inner-t": "rgba(242, 242, 242, 0.1) 0px 1px 0px 0px inset",
        "border-inner-b": "rgba(242, 242, 242, 0.1) 0px -1px 0px 0px inset",
        "border-inner-br": "rgba(242, 242, 242, 0.1) -1px -1px 0px 0px inset",
        "border-inner-l": "rgba(242, 242, 242, 0.1) 1px 0px 0px 0px inset",
        "border-inner-r": "rgba(242, 242, 242, 0.1) -1px 0px 0px 0px inset",
      },
      colors: {
        "havelock-blue": {
          50: "#E1EDF9", // hsl(209, 67, 93)
          100: "#D0E3F6", // hsl(209, 67, 89)
          200: "#AECFEF", // hsl(209, 67, 81)
          300: "#8CBBE8", // hsl(209, 67, 73)
          400: "#6AA7E2", // hsl(209, 67, 65)
          500: "#4893DB", // hsl(209, 67, 57)
          600: "#2674C0", // hsl(209, 67, 45)
          700: "#1C558D", // hsl(209, 67, 33)
          800: "#123659", // hsl(209, 67, 21)
          900: "#081726", // hsl(209, 67, 9)
          950: "#03080D", // hsl(209, 67, 3)
        },
        accent: {
          50: "#0D0D0D",
          100: "#1A1A1A",
          200: "#333333",
          300: "#4D4D4D",
          400: "#666666",
          500: "#808080",
          600: "#999999",
          700: "#B3B3B3",
          800: "#CCCCCC",
          900: "#E6E6E6",
          950: "#F2F2F2",
        },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      screens: {
        "mobile-s": "20rem",
        "mobile-m": "23.438rem",
        "mobile-l": "26.563rem",
        tablet: "48rem",
        laptop: "64rem",
        desktop: "90rem",
        hoverable: {
          raw: "(hover: hover) and (pointer: fine)",
        },
      },
      spacing: {
        sidebar: "15rem",
      },
    },
  },
  plugins: [],
};
