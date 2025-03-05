import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mainbackground:"#F2F2F2",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#F4FF47",
        textPrimary:"#071015",
        selectedButton: "#272D2D",
      },
      fontSize: {
        '32px':'32px',
        
      },
      fontFamily: {
        sans: ['Inter'], // Set Inter as the default sans font
      },
      fontWeight: {
        'semi-bold': '600', // Define your super bold weight
        'normal': '400', // Define your normal weight
      },
    },
  },
  plugins: [],
};
export default config;
