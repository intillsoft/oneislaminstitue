import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Logo Component - Displays the Workflow AI logo
 * 
 * @param {string} variant - Logo variant: 'full', 'icon', 'horizontal', 'text'
 * @param {string} size - Size: 'sm', 'md', 'lg', 'xl'
 * @param {string} className - Additional CSS classes
 */
const Logo = ({ 
  variant = 'full', 
  size = 'md',
  className = '',
  darkMode = null // null = auto-detect, true/false = force
}) => {
  const { theme } = useTheme();
  const isDark = darkMode !== null ? darkMode : theme === 'dark';
  
  const sizeClasses = {
    sm: {
      full: 'h-8',
      icon: 'h-6 w-6',
      horizontal: 'h-6',
      text: 'text-lg'
    },
    md: {
      full: 'h-10',
      icon: 'h-8 w-8',
      horizontal: 'h-8',
      text: 'text-xl'
    },
    lg: {
      full: 'h-14',
      icon: 'h-12 w-12',
      horizontal: 'h-12',
      text: 'text-2xl'
    },
    xl: {
      full: 'h-20',
      icon: 'h-16 w-16',
      horizontal: 'h-16',
      text: 'text-4xl'
    }
  };

  const getLogoSrc = () => {
    if (variant === 'icon') {
      return isDark ? '/assets/images/logo-icon-dark.svg' : '/assets/images/logo-icon.svg';
    }
    if (variant === 'horizontal') {
      return isDark ? '/assets/images/logo-dark.svg' : '/assets/images/logo-horizontal.svg';
    }
    if (variant === 'text') {
      return null; // Text-only variant
    }
    // Default: full logo
    return isDark ? '/assets/images/logo-dark.svg' : '/assets/images/logo.svg';
  };

  const logoSrc = getLogoSrc();

  if (variant === 'text') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className={`font-bold ${sizeClasses[size].text} text-workflow-primary dark:text-purple-400`}>
          Workflow
        </span>
        <span className={`font-semibold ${sizeClasses[size].text === 'text-lg' ? 'text-xs' : sizeClasses[size].text === 'text-xl' ? 'text-sm' : 'text-base'} text-purple-600 dark:text-purple-400 opacity-80`}>
          AI
        </span>
      </div>
    );
  }

  return (
    <img
      src={logoSrc}
      alt="Workflow AI Logo"
      className={`${sizeClasses[size][variant]} ${className}`}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default Logo;

