import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customBlack: "var(--custom-black)",
        customGreen: "var(--custom-green)",
        customRed: "var(--custom-red)",
        customWhite: "var(--custom-white)",
      },
    },
  },
  plugins: [],
} satisfies Config;
