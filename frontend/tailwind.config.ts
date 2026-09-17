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
        midnight: {
          950: "#070913",
          900: "#0b0f19",
          850: "#101625",
          800: "#161e31",
          700: "#1f2a44",
          600: "#2d3c5e",
        },
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        accent: {
          cyan: "#06b6d4",
          violet: "#8b5cf6",
          pink: "#ec4899",
          emerald: "#10b981",
          amber: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "Outfit", "Inter", "sans-serif"],
      },
      boxShadow: {
        "glass-sm": "0 4px 16px 0 rgba(0, 0, 0, 0.05)",
        "glass-md": "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        "glass-lg": "0 12px 48px 0 rgba(31, 38, 135, 0.12)",
        "neon-indigo": "0 0 25px -5px rgba(99, 102, 241, 0.5)",
        "neon-cyan": "0 0 25px -5px rgba(6, 182, 212, 0.5)",
        "neon-purple": "0 0 25px -5px rgba(139, 92, 246, 0.5)",
        "neon-glow": "0 0 40px -10px rgba(99, 102, 241, 0.35)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2.5s infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
        "spin-slow": "spin 12s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        glow: {
          "0%": { opacity: "0.4", filter: "brightness(1)" },
          "100%": { opacity: "1", filter: "brightness(1.2)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-dark": "radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(6, 182, 212, 0.12) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(139, 92, 246, 0.12) 0px, transparent 50%)",
        "mesh-light": "radial-gradient(at 10% 10%, rgba(99, 102, 241, 0.08) 0px, transparent 40%), radial-gradient(at 90% 10%, rgba(6, 182, 212, 0.07) 0px, transparent 40%), radial-gradient(at 50% 90%, rgba(139, 92, 246, 0.06) 0px, transparent 40%)",
      },
    },
  },
  plugins: [],
};

export default config;
