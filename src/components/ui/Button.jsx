import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  className,
  type = 'button',
  ...props
}) => {
  const variants = {
    primary: 'elite-button-primary',
    secondary: 'elite-button-secondary',
    ghost: 'btn-ghost',
  };

  const sizes = {
    sm: 'px-6 py-2.5 text-[9px]',
    md: 'px-8 py-3.5 text-[10px]',
    lg: 'px-12 py-5 text-[11px]',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        variants[variant],
        sizes[size],
        'flex items-center justify-center font-black uppercase tracking-widest transition-all duration-300',
        className
      )}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.05, y: -2 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
