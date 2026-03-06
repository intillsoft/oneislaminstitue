import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAIPanel } from '../../contexts/AIPanelContext';

const placeholders = [
  "Search for Fiqh, Aqeedah, Arabic...",
  "Find Fiqh of Transactions...",
  "Explore beginner Arabic courses...",
  "Learn about Seerah...",
  "Ask the Academic Assistant..."
];

const AISearchBox = ({ value, onChange, onSearch, navigateToChat = true }) => {
  const navigate = useNavigate();
  const { openPanel } = useAIPanel();
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    let interval;
    if (!isFocused && !value) {
      interval = setInterval(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isFocused, value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (navigateToChat && value) {
        openPanel(value);
      } else {
        onSearch();
      }
    }
  };

  const handleSearch = () => {
    if (navigateToChat && value) {
      openPanel(value);
    } else {
      onSearch();
    }
  };

  // Gemini-style animation variants
  const geminiGlowVariants = {
    initial: { opacity: 0.3 },
    animate: {
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const geminiRotateVariants = {
    animate: {
      background: [
        "linear-gradient(45deg, #10B981 0%, #3B82F6 50%, #06B6D4 100%)",
        "linear-gradient(135deg, #3B82F6 0%, #06B6D4 50%, #10B981 100%)",
        "linear-gradient(225deg, #06B6D4 0%, #10B981 50%, #3B82F6 100%)",
        "linear-gradient(315deg, #10B981 0%, #3B82F6 50%, #06B6D4 100%)",
        "linear-gradient(45deg, #10B981 0%, #3B82F6 50%, #06B6D4 100%)"
      ],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto group z-20 my-8">
      {/* Gemini-style Animated Glowing Background */}
      <motion.div 
        variants={geminiRotateVariants}
        animate="animate"
        className="absolute -inset-1.5 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-all duration-700"
      ></motion.div>
      
      {/* Secondary glow layer */}
      <motion.div 
        variants={geminiGlowVariants}
        initial="initial"
        animate="animate"
        className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400 rounded-3xl blur-md opacity-20 group-hover:opacity-40"
      ></motion.div>
      
      {/* Search Input Container */}
      <div 
        className={`relative flex items-center bg-white/95 dark:bg-[#0B1221]/95 backdrop-blur-xl border-2 rounded-3xl transition-all duration-300 overflow-hidden ${
          isFocused 
            ? 'border-emerald-500/50 shadow-[0_0_40px_-5px_rgba(16,185,129,0.3)]' 
            : 'border-white/50 dark:border-slate-800 shadow-xl'
        }`}
      >
        {/* Sparkle Icon */}
        <div className="pl-6 pr-4 py-5 flex items-center justify-center bg-transparent">
          <motion.div
            animate={{ rotate: isFocused ? [0, 15, -15, 0] : 0, scale: isFocused ? 1.1 : 1 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-7 h-7 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </motion.div>
        </div>

        {/* Input Area + Animated Placeholders */}
        <div className="relative flex-1 flex items-center h-20">
          <AnimatePresence mode="wait">
            {!value && !isFocused && (
              <motion.div
                key={currentPlaceholder}
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -5, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute left-0 right-0 pointer-events-none text-slate-400 dark:text-slate-500 text-lg sm:text-xl font-medium truncate pr-4"
              >
                {placeholders[currentPlaceholder]}
              </motion.div>
            )}
          </AnimatePresence>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full h-full bg-transparent border-none outline-none text-slate-900 dark:text-white text-lg sm:text-xl font-medium placeholder-transparent focus:ring-0 px-0 relative z-10"
            placeholder="Ask anything..."
            autoComplete="off"
          />
        </div>

        {/* Action Button */}
        <div className="pr-3 pl-2 py-3 flex items-center">
          <button
            onClick={onSearch}
            className={`flex items-center justify-center gap-3 h-14 px-8 rounded-2xl font-bold transition-all duration-300 ${
              value.trim() || isFocused
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-600/30 scale-100' 
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 scale-95'
            }`}
          >
            <span className="hidden sm:inline text-lg">{value.trim() ? "Search" : "Ask AI"}</span>
            <ArrowRight className={`w-6 h-6 ${value.trim() ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Keyboard Hint */}
      <div className="absolute -bottom-10 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          Press <kbd className="font-mono text-emerald-600 dark:text-emerald-400 mx-1">Enter</kbd> to explore
        </span>
      </div>
    </div>
  );
};

export default AISearchBox;
