/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: '#F0F9FF',
        surface: {
          light: '#FFFFFF',
          dark: '#1F2937',
        },
        primary: {
          light: '#8B5CF6',
          dark: '#EC4899',
        },
        accent: {
          light: '#06B6D4',
          dark: '#14B8A6',
        },
        text: {
          primary: {
            light: '#1E293B',
            dark: '#F3F4F6',
          },
          secondary: {
            light: '#64748B',
            dark: '#D1D5DB',
          },
        },
        obsidian: '#0F172A',
      },
      boxShadow: {
        'card-light': '0 4px 20px rgba(0,0,0,0.05)',
        'card-dark': '0 4px 25px rgba(0,0,0,0.4)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
