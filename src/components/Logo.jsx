import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Logo Component - Displays the One Islam Institute logo
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
  const donateGreen = '#059669'; // Official Brand Green

  const logoContent = horizontal ? (
    <div className={`flex items-center gap-2 leading-none font-display ${className}`}>
      <div className={`flex items-baseline font-black ${currentSize.hSize} tracking-tighter`}>
        <span style={{ color: donateGreen }}>ONE</span>
        <span className="text-white ml-1">ISLAM</span>
      </div>
      <div className={`text-white font-black uppercase ${currentSize.hSize} tracking-tighter border-l border-white/20 pl-2 ml-1`}>
        INSTITUTE
      </div>
    </div>
  ) : (
    <div className={`flex flex-col items-center leading-[0.9] font-display ${className}`}>
      <div className={`flex items-baseline font-black ${currentSize.top} ${currentSize.spacing}`}>
        <span style={{ color: donateGreen }}>ONE</span>
        <span className="text-white ml-1.5">ISLAM</span>
      </div>
      <div className={`text-white font-black uppercase ${currentSize.bottom} ${currentSize.bottomSpacing} mt-1 text-center w-full`}>
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
