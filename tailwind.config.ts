import type { Config } from "tailwindcss";

export default {
  content: ["./src/entrypoints/**/*.{ts,tsx,html}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {}
  },
  plugins: []
} satisfies Config;
