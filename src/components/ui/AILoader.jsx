import React from 'react';

/**
 * Unique AI-themed loader with cutting-edge effects
 */
const AILoader = ({ size = 'default', text = 'Loading...', variant = 'pulse' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  const textSizeClasses = {
    small: 'text-xs',
    default: 'text-sm',
    large: 'text-base',
  };

  if (variant === 'pulse') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          {/* Outer pulsing ring */}
          <div className={`${sizeClasses[size]} rounded-full border-4 border-workflow-primary/20 absolute animate-ping`}></div>
          {/* Middle pulsing ring */}
          <div className={`${sizeClasses[size]} rounded-full border-4 border-workflow-primary/40 absolute animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
          {/* Inner core with gradient */}
          <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-workflow-primary via-workflow-primary-600 to-workflow-primary-800 relative flex items-center justify-center`}>
            <div className="w-1/2 h-1/2 rounded-full bg-white/30 animate-pulse"></div>
          </div>
        </div>
        {text && (
          <p className={`${textSizeClasses[size]} text-text-secondary dark:text-[#8B92A3] font-medium animate-pulse`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'sparkles') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          {/* Rotating sparkles */}
          <div className={`${sizeClasses[size]} relative`}>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-workflow-primary rounded-full animate-pulse"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 45}deg) translateY(-${size === 'small' ? '16px' : size === 'large' ? '32px' : '24px'})`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1.5s',
                }}
              ></div>
            ))}
            {/* Center core */}
            <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-workflow-primary to-workflow-primary-600 absolute top-0 left-0 animate-spin`} style={{ animationDuration: '2s' }}>
              <div className="w-full h-full rounded-full bg-workflow-primary-900/50"></div>
            </div>
          </div>
        </div>
        {text && (
          <p className={`${textSizeClasses[size]} text-text-secondary dark:text-[#8B92A3] font-medium`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'neural') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          {/* Neural network nodes */}
          <svg className={`${sizeClasses[size]} animate-spin`} style={{ animationDuration: '3s' }} viewBox="0 0 48 48">
            <circle cx="24" cy="8" r="3" fill="currentColor" className="text-workflow-primary animate-pulse" style={{ animationDelay: '0s' }} />
            <circle cx="8" cy="24" r="3" fill="currentColor" className="text-workflow-primary animate-pulse" style={{ animationDelay: '0.3s' }} />
            <circle cx="40" cy="24" r="3" fill="currentColor" className="text-workflow-primary animate-pulse" style={{ animationDelay: '0.6s' }} />
            <circle cx="24" cy="40" r="3" fill="currentColor" className="text-workflow-primary animate-pulse" style={{ animationDelay: '0.9s' }} />
            {/* Connecting lines */}
            <line x1="24" y1="8" x2="8" y2="24" stroke="currentColor" strokeWidth="1" className="text-workflow-primary/30" />
            <line x1="24" y1="8" x2="40" y2="24" stroke="currentColor" strokeWidth="1" className="text-workflow-primary/30" />
            <line x1="8" y1="24" x2="24" y2="40" stroke="currentColor" strokeWidth="1" className="text-workflow-primary/30" />
            <line x1="40" y1="24" x2="24" y2="40" stroke="currentColor" strokeWidth="1" className="text-workflow-primary/30" />
          </svg>
        </div>
        {text && (
          <p className={`${textSizeClasses[size]} text-text-secondary dark:text-[#8B92A3] font-medium`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  // Default: Orbiting particles
  const translateDistance = size === 'small' ? '14px' : size === 'large' ? '28px' : '20px';
  
  return (
    <>
      <style>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateY(-${translateDistance}) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateY(-${translateDistance}) rotate(-360deg);
          }
        }
      `}</style>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          {/* Orbiting particles */}
          <div className={`${sizeClasses[size]} relative`}>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 bg-workflow-primary rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0',
                  transform: `rotate(${i * 60}deg) translateY(-${translateDistance})`,
                  animation: `orbit 2s linear infinite`,
                  animationDelay: `${i * 0.33}s`,
                }}
              ></div>
            ))}
            {/* Center core */}
            <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-workflow-primary via-workflow-primary-600 to-workflow-primary-800 absolute top-0 left-0 flex items-center justify-center`}>
              <div className="w-1/3 h-1/3 rounded-full bg-white/40"></div>
            </div>
          </div>
        </div>
        {text && (
          <p className={`${textSizeClasses[size]} text-text-secondary dark:text-[#8B92A3] font-medium`}>
            {text}
          </p>
        )}
      </div>
    </>
  );
};

export default AILoader;