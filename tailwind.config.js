const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        archivo: ["var(--font-archivo)", ...fontFamily.sans],
        inter: ["var(--font-inter)", ...fontFamily.sans],
        moments: ["var(--font-moments)", ...fontFamily.sans],
        geist: ["var(--font-geist-sans)", ...fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
      },
      opacity: {
        10: "0.10",
        15: "0.15",
        20: "0.20",
        25: "0.25",
        35: "0.35",
        40: "0.40",
        50: "0.50",
        60: "0.60",
        65: "0.65",
        70: "0.70",
        80: "0.80",
        90: "0.90",
      },
    },
  },
  plugins: [],
};
