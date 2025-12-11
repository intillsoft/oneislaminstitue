import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const FloatingActionButton = ({ onClick, icon: Icon = Plus, label, className = '' }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`fab ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={label || 'Action'}
    >
      <Icon className="w-6 h-6" />
      <motion.div
        className="absolute inset-0 rounded-full bg-white/20"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 2, opacity: [0, 0.5, 0] }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  );
};

export default FloatingActionButton;

