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
            background: "#ffffff", // Blanco puro
            foreground: "#16090d", // Texto oscuro
            default: {
              50: "#fceff2",
              100: "#ddd8d9",
              200: "#bfbfc1",
              300: "#8a8a8b", // Mejorado para mejor contraste en texto inactivo
              400: "#6c6c6c", // Más oscuro para mejor legibilidad
              500: "#5a5a5a", // Texto más fuerte
              600: "#454545",
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
            divider: "#e5e7eb", // Para bordes y separadores
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
            divider: "#374151", // Para bordes y separadores en tema oscuro
          },
        },
        contraste: {
          extend: "dark",
          colors: {
            background: "#000000", // Negro puro para alto contraste
            foreground: "#ffff00", // AMARILLO PURO para texto - Contraste 19.56:1 (WCAG AAA)
            content1: "#1a1a1a", // Gris muy oscuro para paneles - Contraste 12.63:1
            content2: "#262626", // Gris oscuro para contenido secundario - Contraste 9.74:1
            content3: "#333333", // Gris medio oscuro - Contraste 7.54:1
            content4: "#404040", // Gris medio - Contraste 5.74:1
            default: {
              50: "#ffffff", // Blanco puro
              100: "#f2f2f2", // Gris muy claro - Contraste 18.77:1
              200: "#e6e6e6", // Gris claro - Contraste 16.75:1
              300: "#cccccc", // Gris claro medio - Contraste 12.63:1
              400: "#b3b3b3", // Gris medio claro - Contraste 9.74:1
              500: "#808080", // Gris medio - Contraste 5.31:1 (WCAG AA)
              600: "#666666", // Gris medio oscuro - Contraste 7.54:1
              700: "#4d4d4d", // Gris oscuro - Contraste 11.59:1
              800: "#333333", // Gris muy oscuro - Contraste 7.54:1
              900: "#1a1a1a", // Casi negro - Contraste 12.63:1
              DEFAULT: "#e6e6e6", // Gris claro para elementos neutros - Contraste 16.75:1
              foreground: "#000000", // Negro sobre elementos default
            },
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
            secondary: {
              50: "#ffffff",
              100: "#f2f2f2",
              200: "#e6e6e6",
              300: "#cccccc",
              400: "#b3b3b3",
              500: "#999999",
              600: "#808080",
              700: "#666666",
              800: "#4d4d4d",
              900: "#333333",
              DEFAULT: "#e6e6e6", // Gris claro para elementos secundarios
              foreground: "#000000", // Negro sobre gris claro
            },
            success: {
              50: "#e8f5e8",
              100: "#c8e6c9",
              200: "#a5d6a7",
              300: "#81c784",
              400: "#66bb6a",
              500: "#4caf50", // Verde estándar más suave
              600: "#43a047",
              700: "#388e3c",
              800: "#2e7d32",
              900: "#1b5e20",
              DEFAULT: "#ffffff", // Fondo blanco para success
              foreground: "#1b5e20", // Verde oscuro sobre blanco
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
            divider: "#666666", // Gris medio para divisores - Contraste 7.54:1 (WCAG AA)
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
      });
    },
  ],
};
