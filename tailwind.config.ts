import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors:{
        'primary-color': 'var(--primary-color)',
        'text-color': 'var(--text-color)',
        'nav-text': 'var(--nav-text)',
        'nav-bg': 'var(--nav-bg)',
        'nav-item-bg': 'var(--nav-item-bg)',
        'nav-item-hover-bg': 'var(--nav-item-hover-bg)',
        'nav-subitem-bg' : 'var(--nav-subitem-bg)',
        'nav-subitem-hover-bg': 'var(--nav-subitem-hover-bg)',
        'nav-subitem-header-separator': 'var(--nav-subitem-header-separator)'
      }
    },
  },
  plugins: [],
};
export default config;
