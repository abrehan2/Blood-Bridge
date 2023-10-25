// SHADCN/UI TOOLKIT
const { Colors } = require('./globals/colors');
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        LatoRegular: ['LatoRegular', 'sans'],
        LatoMedium: ['LatoMedium', 'sans'],
        LatoBold: ['LatoBold', 'sans'],
        RobotoRegular: ['RobotoRegular', 'sans'],
        RobotoMedium: ['RobotoMedium', 'sans'],
        RobotoBold: ['RobotoBold', 'sans'],
        PlayfairDisplayRegular: ['PlayfairDisplayRegular', 'sans'],
        PlayfairDisplayMedium: ['PlayfairDisplayMedium', 'sans'],
        PlayfairDisplayBold: ['PlayfairDisplayBold', 'sans'],
        PlayfairDisplaySemiBold: ['PlayfairDisplaySemiBold', 'sans'],
        DMSansRegular: ['DMSansRegular', 'sans'],
        DMSansMedium: ['DMSansMedium', 'sans'],
        DMSansBold: ['DMSansBold', 'sans'],
        DMSansSemiBold: ['DMSansSemiBold', 'sans'],
        BarlowRegular: ['BarlowRegular', 'sans'],
        BarlowMedium: ['BarlowMedium', 'sans'],
        BarlowBold: ['BarlowBold', 'sans'],
        BarlowSemiBold: ['BarlowSemiBold', 'sans'],
        LateefRegular: ['LateefRegular', 'sans'],
        LateefMedium: ['LateefMedium', 'sans'],
      },
      colors: {
        darkRed: Colors.darkRed,
        bloodBankNavRed: Colors.bloodBankNavRed,
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "right-to-left": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "left-to-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "right-to-left": "right-to-left 0.2s ease-out forwards",
        "left-to-right": "left-to-right 0.2s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
