import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B1F3B",
          50: "#E8EBF0",
          100: "#D1D7E1",
          200: "#A3AFC3",
          300: "#7587A5",
          400: "#475F87",
          500: "#0B1F3B",
          600: "#091930",
          700: "#071324",
          800: "#050D18",
          900: "#02070C",
        },
      },
      animation: {
        "bounce-delay-0": "bounce 1s infinite 0ms",
        "bounce-delay-100": "bounce 1s infinite 100ms",
        "bounce-delay-200": "bounce 1s infinite 200ms",
      },
    },
  },
  plugins: [],
};
export default config;


