/**
 * Theme utility for dark mode management
 */

export const initTheme = () => {
  if (typeof window === 'undefined') return;

  // Check localStorage first
  const savedTheme = localStorage.getItem('theme');

  // Default to dark mode for Elite Metamorphosis
  const shouldBeDark = savedTheme !== 'light';

  if (shouldBeDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  return shouldBeDark;
};

export const setTheme = (isDark) => {
  if (typeof window === 'undefined') return;

  if (isDark) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

export const toggleTheme = () => {
  if (typeof window === 'undefined') return false;

  const isDark = document.documentElement.classList.contains('dark');
  setTheme(!isDark);
  return !isDark;
};

export const getTheme = () => {
  if (typeof window === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
};

