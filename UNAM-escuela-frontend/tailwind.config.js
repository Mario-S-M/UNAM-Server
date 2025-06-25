const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{jsx,tsx}",
    "./components/**/*.{jsx,tsx}",
    "./lib/**/*.{jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
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
            background: "#ffffff", // Blanco puro - HeroUI generará content1-4 automáticamente
            foreground: "#16090d", // Texto oscuro
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
            background: "#1f2526", // Gris oscuro - HeroUI generará content1-4 automáticamente
            foreground: "#e6e9ef", // Texto claro
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
        contraste: {
          extend: "dark",
          colors: {
            background: "#000000", // Negro puro - HeroUI generará content1-4 automáticamente
            foreground: "#ffff00", // AMARILLO PURO para texto - Contraste 19.56:1 (WCAG AAA)
            primary: {
              50: "#ffffff", // Blanco puro
              100: "#f5f5f5", // Gris muy claro
              200: "#eeeeee", // Gris claro
              300: "#e0e0e0", // Gris claro medio
              400: "#bdbdbd", // Gris medio
              500: "#9e9e9e", // Gris
              600: "#757575", // Gris oscuro
              700: "#616161", // Gris muy oscuro
              800: "#424242", // Gris casi negro
              900: "#212121", // Gris muy oscuro
              DEFAULT: "#ffffff", // Blanco para botones - Contraste 21:1 con negro
              foreground: "#000000", // Negro sobre blanco - Contraste 21:1
            },
            warning: {
              50: "#fff8e1",
              100: "#ffecb3",
              200: "#ffe082",
              300: "#ffd54f",
              400: "#ffca28",
              500: "#ffc107", // Amarillo más suave
              600: "#ffb300",
              700: "#ffa000",
              800: "#ff8f00",
              900: "#ff6f00",
              DEFAULT: "#ffffff", // Fondo blanco para warning
              foreground: "#e65100", // Naranja oscuro sobre blanco
            },
            danger: {
              50: "#ffebee",
              100: "#ffcdd2",
              200: "#ef9a9a",
              300: "#e57373",
              400: "#ef5350",
              500: "#f44336", // Rojo más suave
              600: "#e53935",
              700: "#d32f2f",
              800: "#c62828",
              900: "#b71c1c",
              DEFAULT: "#ffffff", // Fondo blanco para danger
              foreground: "#b71c1c", // Rojo oscuro sobre blanco
            },
            focus: "#ffff00", // AMARILLO PURO para focus - máximo contraste
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

        // Utilidades adicionales para colores de tema
        ".bg-theme-primary": {
          backgroundColor: "hsl(var(--heroui-primary) / 1)",
        },
        ".bg-theme-secondary": {
          backgroundColor: "hsl(var(--heroui-secondary) / 1)",
        },
        ".bg-theme-background": {
          backgroundColor: "hsl(var(--heroui-background) / 1)",
        },
        ".bg-theme-foreground": {
          backgroundColor: "hsl(var(--heroui-foreground) / 1)",
        },
        ".text-theme-primary": { color: "hsl(var(--heroui-primary) / 1)" },
        ".text-theme-secondary": { color: "hsl(var(--heroui-secondary) / 1)" },
        ".text-theme-background": {
          color: "hsl(var(--heroui-background) / 1)",
        },
        ".text-theme-foreground": {
          color: "hsl(var(--heroui-foreground) / 1)",
        },
        ".border-theme-divider": {
          borderColor: "hsl(var(--heroui-divider) / 1)",
        },
        // Clases para iconos con colores de tema
        ".text-theme-default": {
          color: "hsl(var(--heroui-default-500) / 1)",
        },
        ".text-theme-icon": {
          color: "hsl(var(--heroui-default-600) / 1)",
        },
        // Clase para iconos de avatar que se adapta al tema
        ".text-avatar-icon": {
          color: "hsl(var(--heroui-default-600) / 1)", // Gris oscuro en tema claro
        },
        ".dark .text-avatar-icon": {
          color: "#ffffff", // Blanco en tema oscuro
        },
        // Clase para borde hover del avatar que se adapta al tema
        ".avatar-hover-border": {
          borderColor: "hsl(var(--heroui-divider) / 1)",
        },
        ".avatar-hover-border:hover": {
          borderColor: "hsl(var(--heroui-default-400) / 1)", // Tema claro
        },
        ".dark .avatar-hover-border:hover": {
          borderColor: "hsl(var(--heroui-default-500) / 1)", // Tema oscuro - más suave
        },
      });
    },
  ],
};
