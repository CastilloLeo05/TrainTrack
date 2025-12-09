// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2196F3",
        secondary: "#00E5FF",

        // Background colors
        background: {
          DEFAULT: "#0A192F",
          light: "#112240",
          dark: "#07101d",
        },

        // Text colors
        text: {
          DEFAULT: "#F5F5F5",
          light: "#E2E8F0",
          dim: "#94A3B8",
        },
      },

      fontFamily: {
        poppins: ["Poppins", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
