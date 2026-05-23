import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Logo Component - Displays the Hope Dawah Institute logo
 * Automatically adapts and remains perfectly clear on both light and dark themes.
 * 
 * @param {string} size - Size: 'sm', 'md', 'lg', 'xl'
 * @param {string} className - Additional CSS classes
 * @param {boolean} link - Whether to wrap in a Link to /
 * @param {boolean} horizontal - Force horizontal layout for tight spaces
 */
const Logo = ({ 
  size = 'md',
  className = '',
  link = true,
  horizontal = false
}) => {
  const sizeMap = {
    sm: {
      top: 'text-lg',
      bottom: 'text-lg',
      spacing: 'tracking-tight',
      bottomSpacing: 'tracking-tight',
      hSize: 'text-base'
    },
    md: {
      top: 'text-xl',
      bottom: 'text-xl',
      spacing: 'tracking-tight',
      bottomSpacing: 'tracking-tight',
      hSize: 'text-lg'
    },
    lg: {
      top: 'text-4xl',
      bottom: 'text-4xl',
      spacing: 'tracking-tight',
      bottomSpacing: 'tracking-tight',
      hSize: 'text-2xl'
    },
    xl: {
      top: 'text-6xl',
      bottom: 'text-6xl',
      spacing: 'tracking-tight',
      bottomSpacing: 'tracking-tight',
      hSize: 'text-4xl'
    }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const logoContent = horizontal ? (
    <div className={`flex items-center gap-2 leading-none font-display ${className}`}>
      <div className={`flex items-baseline font-black ${currentSize.hSize} tracking-tighter`}>
        <span className="text-[var(--color-primary)]">HOPE</span>
        <span className="text-slate-800 dark:text-white ml-1 transition-colors duration-200">DAWAH</span>
      </div>
      <div className={`text-slate-900 dark:text-slate-100 font-black uppercase ${currentSize.hSize} tracking-tighter border-l border-slate-200 dark:border-white/20 pl-2 ml-1 transition-colors duration-200`}>
        INSTITUTE
      </div>
    </div>
  ) : (
    <div className={`flex flex-col items-center leading-[0.9] font-display ${className}`}>
      <div className={`flex items-baseline font-black ${currentSize.top} ${currentSize.spacing}`}>
        <span className="text-[var(--color-primary)]">HOPE</span>
        <span className="text-slate-800 dark:text-white ml-1.5 transition-colors duration-200">DAWAH</span>
      </div>
      <div className={`text-slate-900 dark:text-slate-100 font-black uppercase ${currentSize.bottom} ${currentSize.bottomSpacing} mt-1 text-center w-full transition-colors duration-200`}>
        INSTITUTE
      </div>
    </div>
  );

  if (!link) return <div className="inline-block">{logoContent}</div>;

  return (
    <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
      {logoContent}
    </Link>
  );
};

export default Logo;
