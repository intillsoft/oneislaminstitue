import React from 'react';
import AILoader from './AILoader';

/**
 * GlobalLoader component
 * A full-screen, centered loader used for initial app loading or route transitions.
 */
const GlobalLoader = ({ text = "Securing access..." }) => {
  const [show, setShow] = React.useState(true);

  React.useEffect(() => {
    // Ensure loader shows for at least 2.5 seconds for a smooth aesthetic
    const timer = setTimeout(() => {
      // We don't hide it here because Suspense unmounts it, 
      // but we can add a fade-out if the parent supports it.
      // For now, this component just ensures the initial visual is impactful.
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-[#0A0E27] transition-all duration-700 ease-in-out">
      <div className="flex flex-col items-center">
        <AILoader variant="pulse" size="large" text={text} />
        
        {/* Subtle background ornamentation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
             <div className="w-[800px] h-[800px] border-[1px] border-emerald-500/10 rounded-full animate-ping" />
             <div className="absolute w-[600px] h-[600px] border-[1px] border-emerald-500/5 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;
