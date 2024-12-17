/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  screens: {
    xs: "480px", // Extra small devices
    sm: "640px", // Small devices (tablets)
    md: "768px", // Medium devices (small laptops)
    lg: "1024px", // Large devices (laptops)
    xl: "1280px", // Extra large devices
    "2xl": "1536px", // 2x extra large devices
  },
  plugins: [],
};
