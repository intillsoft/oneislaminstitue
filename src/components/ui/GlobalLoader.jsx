import React from 'react';
import AILoader from './AILoader';

/**
 * GlobalLoader component
 * A premium, non-blocking page transition loader with a top-bar progress indicator
 * and a glassmorphic, blurred subtle backdrop.
 */
const GlobalLoader = ({ text = "Securing access..." }) => {
  return (
    <>
      <style>{`
        @keyframes loadingBarProgress {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-loading-bar {
          animation: loadingBarProgress 1.8s infinite ease-in-out;
        }
      `}</style>

      {/* Modern Top-Bar Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[10000] overflow-hidden bg-primary/10">
        <div className="h-full bg-gradient-to-r from-primary via-accent to-primary w-full animate-loading-bar origin-left" />
      </div>

      {/* Glassmorphic, non-blocking centered overlay */}
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/60 backdrop-blur-xl transition-all duration-300">
        <AILoader size="default" text={text} />
      </div>
    </>
  );
};

export default GlobalLoader;
