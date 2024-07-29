import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/_components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/_common/*.{js.ts,jsx,tsx,mdx}",
    "./src/(view)/(auth)/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        secondary: "#020617",
        error: "#ED0D00",
        success: "#3BAE2B",
        "primary-100": "#FFDAC4",
        "primary-200": "#FFD0B5",
        "primary-300": "#FFC4A2",
        "primary-400": "#FFB78F",
        "primary-500": "#FFA069",
        "primary-600": "#FA8F52",
        "primary-700": "#FF823C",
        "primary-800": "#FF651F",
        "primary-900": "#E95D0E",
        "cool-grayscale-50": "#F5F9FC",
        "cool-grayscale-100": "#F1F5F9",
        "cool-grayscale-200": "#E2E8F0",
        "cool-grayscale-300": "#CBD5E1",
        "cool-grayscale-400": "#94A3B8",
        "cool-grayscale-500": "#64748B",
        "cool-grayscale-600": "#475569",
        "cool-grayscale-700": "#334155",
        "cool-grayscale-800": "#1E293B",
        "cool-grayscale-900": "#020617",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
export default config;
