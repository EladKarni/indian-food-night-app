import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  daisyui: {
    themes: [
      "light",
      "dark",
      "dim",
      {
        mytheme: {
          primary: "#ea00ff",
          "primary-content": "#130016",
          secondary: "#00a2ff",
          "secondary-content": "#000a16",
          accent: "#ff0000",
          "accent-content": "#160000",
          neutral: "#17080f",
          "neutral-content": "#cbc6c8",
          "base-100": "#efefef",
          "base-200": "#1f200b",
          "base-300": "#191907",
          "base-content": "#cecfc9",
          info: "#007cf2",
          "info-content": "#000514",
          success: "#00ae7b",
          "success-content": "#000b05",
          warning: "#ac5d00",
          "warning-content": "#f0ded1",
          error: "#da0023",
          "error-content": "#ffd7d3",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
export default config;
