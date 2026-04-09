/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f3f7ff",
          100: "#dfe8ff",
          500: "#355df5",
          600: "#294ad0",
          700: "#1c349b",
        },
        slate: {
          950: "#08111f",
        },
        accent: "#12b886",
        warm: "#ffb454",
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 60px rgba(8, 17, 31, 0.12)",
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at 20% 10%, rgba(53, 93, 245, 0.15), transparent 30%), radial-gradient(circle at 80% 0%, rgba(18, 184, 134, 0.15), transparent 25%), linear-gradient(135deg, #f8fbff 0%, #eef4ff 100%)",
      },
    },
  },
  plugins: [],
};
