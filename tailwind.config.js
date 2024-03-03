/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			colors: {
				"havelock-blue": {
					50: "#f1f8fd",
					100: "#e0eef9",
					200: "#c7e2f6",
					300: "#a1d0ef",
					400: "#74b6e6",
					500: "#4893db",
					600: "#3f80d1",
					700: "#366cbf",
					800: "#31589c",
					900: "#2c4b7c",
					950: "#1f2f4c",
				},
			},
			fontFamily: {
				inter: ["Inter", "sans-serif"],
			},
			spacing: {
				sidebar: "240px",
			},
		},
	},
	plugins: [],
};
