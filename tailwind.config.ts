// tailwind.config.ts
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2196F3",
        secondary: "#00E5FF",
        background: "#0A192F",
        text: "#F5F5F5",
      },
      fontFamily: {
        poppins: ["Poppins", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
