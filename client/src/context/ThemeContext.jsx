import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { THEME } from '../constants/theme';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('contentchef-theme');
    return stored === THEME.DARK ? THEME.DARK : THEME.LIGHT;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === THEME.DARK) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('contentchef-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT));
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
