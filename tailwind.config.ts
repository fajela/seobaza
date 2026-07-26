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
        primary: {
          DEFAULT: '#0043a4',
          hover: '#0056b3',
        },
        accent: {
          DEFAULT: '#7CFF3D',
          light: '#9FFF6B',
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        'seo-gray': '#f2f2f2',
        'text-primary': '#323232',
      },
      fontFamily: {
        sans: ['var(--font-open-sans)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-proza-libre)', 'serif'],
      },
      borderRadius: {
        'seo': '12px',
      },
      spacing: {
        '1': '8px',
        '2': '12px',
        '3': '16px',
        '4': '24px',
      },
    },
  },
  plugins: [],
} satisfies Config;
