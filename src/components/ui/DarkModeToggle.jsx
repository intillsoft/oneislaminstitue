import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { initTheme, toggleTheme as toggleThemeUtil, getTheme } from '../../utils/theme';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return getTheme();
    }
    return false;
  });

  React.useEffect(() => {
    // Initialize theme on mount
    const initialTheme = initTheme();
    setIsDark(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = toggleThemeUtil();
    setIsDark(newTheme);
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-11 h-6 rounded-full bg-gray-200 dark:bg-gray-700 p-0.5 focus:outline-none focus:ring-2 focus:ring-workflow-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle dark mode"
    >
      <motion.div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-md border border-gray-200 dark:border-gray-700"
        animate={{
          x: isDark ? 20 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-gray-600 dark:text-gray-300" />
        ) : (
          <Sun className="w-3 h-3 text-yellow-500" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default DarkModeToggle;

