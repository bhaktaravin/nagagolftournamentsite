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
        fairway: "#1a472a",
        green: "#2d5a3d",
        sand: "#e8dcc4",
        tee: "#f5f0e6",
      },
    },
  },
  plugins: [],
};

export default config;
