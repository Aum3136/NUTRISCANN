/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#22c55e",
        accent: "#4ade80",
        darkbg: "#0f172a",
        card: "rgba(255,255,255,0.05)",
        borderColor: "rgba(255,255,255,0.1)",
        textmain: "#e5e7eb",
        subtext: "#9ca3af",
      },
    },
  },
  plugins: [],
};