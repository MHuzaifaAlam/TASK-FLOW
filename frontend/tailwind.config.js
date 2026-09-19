/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#F4F5F7",
          100: "#E7E8EC",
          200: "#C7C9D3",
          300: "#9A9EAD",
          400: "#6C7185",
          500: "#4B4F63",
          600: "#363A4C",
          700: "#262939",
          800: "#1A1C28",
          900: "#12131C",
          950: "#0B0C13",
        },
        canvas: "#F7F6F3",
        panel: "#FFFFFF",
        line: "#E4E2DC",
        teal: {
          50: "#EAF6F5",
          100: "#CFEBE9",
          400: "#1E9D99",
          500: "#0E7C7B",
          600: "#0A6564",
          700: "#084F4F",
        },
        amber: {
          50: "#FDF3E2",
          400: "#E4A317",
          500: "#C98A0B",
        },
        danger: {
          50: "#FBEAEA",
          400: "#DC5B5B",
          500: "#C53030",
          600: "#9E2626",
        },
        success: {
          50: "#E9F5EE",
          400: "#3FA772",
          500: "#2F855A",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        panel: "0 1px 2px rgba(18, 19, 28, 0.04), 0 1px 0 rgba(18,19,28,0.03)",
        pop: "0 8px 24px -8px rgba(18, 19, 28, 0.18)",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
      },
    },
  },
  plugins: [],
};
