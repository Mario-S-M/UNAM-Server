const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{jsx,tsx}",
  ],
  darkMode: "class",
  theme_authenticated: {
    extend: {
      letterSpacing: {
        normal: "0em",
        wide: "0.1em",
        wider: "0.2em",
        widest: "0.3em",
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        bold: 700,
      },
      boxShadow: {
        soft: "0 4px 6px rgba(0, 0, 0, 0.1)",
        medium: "0 10px 15px rgba(0, 0, 0, 0.15)",
      },
      borderRadius: {
        DEFAULT: "8px",
      },
      transitionProperty: {
        "colors-opacity": "color, background-color, border-color, opacity",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        "unam-light-theme": {
          extend: "light",
          colors: {
            background: "#ffffff", // Blanco puro
            foreground: "#16090d", // Texto oscuro
            default: {
              50: "#fceff2",
              100: "#ddd8d9",
              200: "#bfbfc1",
              300: "#a5a5a6",
              400: "#8c8c8c",
              500: "#727272",
              600: "#59595a",
              700: "#3f3f41",
              800: "#292526",
              900: "#16090d",
              DEFAULT: "#5e5e5f",
              foreground: "#ffffff",
            },
            primary: {
              50: "#e6f3ff",
              100: "#c5d8ee",
              200: "#a2bedc",
              300: "#7fa4cd",
              400: "#5c8abe",
              500: "#4271a4",
              600: "#325880",
              700: "#223f5d",
              800: "#10263a",
              900: "#000e19",
              DEFAULT: "#2c4d71", // Azul UNAM
              foreground: "#ffffff",
            },
            warning: {
              50: "#fff5dd",
              100: "#f9e2b4",
              200: "#f3cf89",
              300: "#edbc5e",
              400: "#e8a931",
              500: "#ce9017",
              600: "#a0700f",
              700: "#745009",
              800: "#463001",
              900: "#1b0f00",
              DEFAULT: "#e9ae3c", // Dorado UNAM
              foreground: "#16090d",
            },
            focus: "#2c4d71", // Azul UNAM
          },
        },
        "unam-dark-theme": {
          extend: "dark",
          colors: {
            background: "#1f2526", // Gris oscuro (corregido)
            foreground: "#e6e9ef", // Texto claro
            default: {
              50: "#e6f3ff",
              100: "#c5d8ee",
              200: "#a2bedc",
              300: "#7fa4cd",
              400: "#5c8abe",
              500: "#4271a4",
              600: "#325880",
              700: "#223f5d",
              800: "#10263a",
              900: "#000e19",
              DEFAULT: "#2c4d71", // Azul UNAM para botones
              foreground: "#ffffff",
            },
            primary: {
              50: "#e6f3ff",
              100: "#c5d8ee",
              200: "#a2bedc",
              300: "#7fa4cd",
              400: "#5c8abe",
              500: "#4271a4",
              600: "#325880",
              700: "#223f5d",
              800: "#10263a",
              900: "#000e19",
              DEFAULT: "#2c4d71", // Azul UNAM
              foreground: "#ffffff",
            },
            warning: {
              50: "#fff5dd",
              100: "#f9e2b4",
              200: "#f3cf89",
              300: "#edbc5e",
              400: "#e8a931",
              500: "#ce9017",
              600: "#a0700f",
              700: "#745009",
              800: "#463001",
              900: "#1b0f00",
              DEFAULT: "#e9ae3c", // Dorado UNAM
              foreground: "#1f2526",
            },
            focus: "#e9ae3c", // Dorado UNAM
          },
        },
        "contraste": {
          extend: "dark",
          colors: {
            background: "#000000", // Negro puro para alto contraste
            foreground: "#ffffff", // Texto blanco puro
            default: {
              50: "#ffffff",
              100: "#e6e6e6",
              200: "#cccccc",
              300: "#b3b3b3",
              400: "#999999",
              500: "#808080",
              600: "#666666",
              700: "#4d4d4d",
              800: "#333333",
              900: "#1a1a1a",
              DEFAULT: "#ffffff", // Blanco para botones
              foreground: "#000000",
            },
            primary: {
              50: "#ffffb3",
              100: "#ffff80",
              200: "#ffff4d",
              300: "#ffff1a",
              400: "#e6e600",
              500: "#cccc00",
              600: "#b3b300",
              700: "#999900",
              800: "#808000",
              900: "#666600",
              DEFAULT: "#ffff00", // Amarillo brillante para accesibilidad
              foreground: "#000000",
            },
            warning: {
              50: "#ffffff",
              100: "#e6e6e6",
              200: "#cccccc",
              300: "#b3b3b3",
              400: "#999999",
              500: "#808080",
              600: "#666666",
              700: "#4d4d4d",
              800: "#333333",
              900: "#1a1a1a",
              DEFAULT: "#ffffff", // Blanco para advertencias
              foreground: "#000000",
            },
            focus: "#ffff00", // Amarillo brillante
          },
        },
      },
    }),
    function ({ addBase, addUtilities }) {
      addBase({
        "html.letter-spacing-normal *": { letterSpacing: "normal !important" },
        "html.letter-spacing-wide *": { letterSpacing: "0.1em !important" },
        "html.letter-spacing-wider *": { letterSpacing: "0.2em !important" },
      });
      addUtilities({
        ".text-spacing-normal": { letterSpacing: "normal" },
        ".text-spacing-wide": { letterSpacing: "0.1em" },
        ".text-spacing-wider": { letterSpacing: "0.2em" },
      });
    },
  ],
};