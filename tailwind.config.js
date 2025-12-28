/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enable dark mode via class
  darkMode: 'class',
  
  // Content paths for Tailwind to scan
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  theme: {
    extend: {
      // Custom color palette matching the Stitch designs
      colors: {
        // Primary brand color
        primary: {
          DEFAULT: '#137fec',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#137fec',
          600: '#0b6dd4',
          700: '#0a5db5',
          800: '#0b4e92',
          900: '#0f3d72',
        },
        // Background colors
        background: {
          light: '#f6f7f8',
          dark: '#101922',
        },
        // Surface colors for cards etc
        surface: {
          light: '#ffffff',
          dark: '#1a2633',
        },
      },
      
      // Custom font family
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      
      // Custom border radius matching designs
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      
      // Custom animations
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'typing': 'typing 1.5s steps(40, end), blink-caret 0.75s step-end infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      
      // Custom shadows
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'primary': '0 4px 14px 0 rgba(19, 127, 236, 0.25)',
      },
    },
  },
  
  plugins: [
    // Add forms plugin for better form styling
    require('@tailwindcss/forms'),
  ],
};
