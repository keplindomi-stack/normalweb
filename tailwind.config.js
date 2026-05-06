/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./App.js",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          cyan: "#00ffff",
          pink: "#ff00a0",
          purple: "#7000ff",
          dark: "#0a0a0f",
        },
      },
      backdropBlur: {
        glass: "20px",
      },
      animation: {
        "glitch": "glitch 5s infinite",
        "float": "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        glitch: {
          "0%, 100%": { transform: "translate(0)", textShadow: "0 0 10px rgba(0,255,255,0.5)" },
          "92%": { transform: "translate(0)", textShadow: "0 0 10px rgba(0,255,255,0.5)" },
          "93%": { transform: "translate(-2px, 2px)", textShadow: "2px 0 #00ffff, -2px 0 #ff00a0" },
          "94%": { transform: "translate(2px, -2px)", textShadow: "-2px 0 #00ffff, 2px 0 #ff00a0" },
          "95%": { transform: "translate(0)", textShadow: "0 0 10px rgba(0,255,255,0.5)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};
