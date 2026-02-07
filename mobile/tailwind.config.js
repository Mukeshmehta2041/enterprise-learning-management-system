/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4f46e5",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#0f172a",
          foreground: "#ffffff",
        },
        background: "#f8fafc", // slate-50
        foreground: "#0f172a", // slate-900
        muted: {
          DEFAULT: "#f1f5f9", // slate-100
          foreground: "#64748b", // slate-500
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#0f172a",
        },
      },
    },
  },
  plugins: [],
}

