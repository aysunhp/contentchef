/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: '#FDF6E3',
        surface: {
          light: '#FFFFFF',
          dark: '#18181C',
        },
        primary: {
          light: '#A7C7E7',
          dark: '#C3B1E1',
        },
        accent: {
          light: '#B5EAD7',
          dark: '#98FFD9',
        },
        text: {
          primary: {
            light: '#333333',
            dark: '#F5F5F7',
          },
          secondary: {
            light: '#7F8C8D',
            dark: '#A1A1AA',
          },
        },
        obsidian: '#0F0F12',
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
