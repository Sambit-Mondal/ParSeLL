import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'body-bg': '#E3E6E6',
        'navbar-bg': '#046D48',
        'auth-bg': '#12826e'
      }
    },
  },
  plugins: [],
} satisfies Config;
