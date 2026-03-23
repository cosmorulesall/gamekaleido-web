import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Jewel-tone palette from design brief
        crimson: {
          DEFAULT: "#9B1B30",
          light: "#C62B45",
          dark: "#6B1220",
        },
        amber: {
          DEFAULT: "#D4820A",
          light: "#F0A030",
          dark: "#A06008",
        },
        teal: {
          DEFAULT: "#1A7A7A",
          light: "#2AA0A0",
          dark: "#105555",
        },
        violet: {
          DEFAULT: "#5B2D8E",
          light: "#7B45B5",
          dark: "#3D1D60",
        },
        obsidian: "#0A0A0F",

        // Interface colors
        surface: {
          DEFAULT: "rgba(18, 16, 20, 0.85)",
          solid: "#121014",
          hover: "rgba(25, 22, 30, 0.9)",
        },
        warm: {
          white: "#F5F0EB",
          muted: "#8A7E75",
          border: "rgba(245, 240, 235, 0.08)",
        },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(1.8rem, 4vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "display-md": ["clamp(1.4rem, 3vw, 2rem)", { lineHeight: "1.2" }],
      },
      backdropBlur: {
        glass: "20px",
      },
      boxShadow: {
        glass: "0 0 0 1px rgba(245, 240, 235, 0.06), 0 8px 32px rgba(0, 0, 0, 0.4)",
        "glass-hover": "0 0 0 1px rgba(245, 240, 235, 0.1), 0 12px 40px rgba(0, 0, 0, 0.5)",
        glow: "0 0 20px rgba(212, 130, 10, 0.3)",
      },
      transitionDuration: {
        panel: "500ms",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-left": "slideLeft 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideLeft: {
          from: { opacity: "0", transform: "translateX(30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
