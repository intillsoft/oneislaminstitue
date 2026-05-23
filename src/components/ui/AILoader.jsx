import React from 'react';

/**
 * Premium, clean, and ultra-professional circular page loader spinner.
 */
const AILoader = ({ size = 'default', text = 'Loading...', variant = 'pulse' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-10 h-10',
    large: 'w-14 h-14',
  };

  const textSizeClasses = {
    small: 'text-[10px]',
    default: 'text-[11px]',
    large: 'text-xs',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3.5">
      <div className="relative">
        {/* Dynamic Minimalist Premium Spinner */}
        <div className={`${sizeClasses[size]} rounded-full border-[2px] border-primary/10 border-t-primary animate-spin`} style={{ animationDuration: '0.85s' }} />
      </div>
      {text && (
        <p className={`${textSizeClasses[size]} text-muted-foreground font-semibold uppercase tracking-[0.18em] animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default AILoader;