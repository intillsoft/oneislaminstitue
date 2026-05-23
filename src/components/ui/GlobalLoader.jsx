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
      <div className="fixed top-0 left-0 right-0 h-1 z-[10000] overflow-hidden bg-primary/10">
        <div className="h-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] w-full animate-loading-bar origin-left" />
      </div>

      {/* Glassmorphic, non-blocking centered overlay */}
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/20 backdrop-blur-md transition-all duration-300">
        <div className="flex flex-col items-center p-6 rounded-2xl bg-card/40 border border-border/20 shadow-xl backdrop-blur-xl">
          <AILoader variant="neural" size="default" text={text} />
        </div>
      </div>
    </>
  );
};

export default GlobalLoader;
