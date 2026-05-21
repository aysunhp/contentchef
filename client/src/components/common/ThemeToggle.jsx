import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { THEME } from '../../constants/theme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === THEME.DARK;

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className="flex h-9 w-9 items-center justify-center rounded-xl text-text-secondary-light transition-all duration-200 hover:bg-gray-100 dark:text-text-secondary-dark dark:hover:bg-white/5"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
