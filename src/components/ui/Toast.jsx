import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Return a no-op implementation if used outside provider
    return {
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {},
    };
  }
  return context;
};

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toast = { id, message, type, duration };
    
    setToasts((prev) => [...prev, toast]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
  const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
  const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);
  const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);

  return (
    <ToastContext.Provider value={{ success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-8 right-8 z-[9999] space-y-4 pointer-events-none min-w-[320px] max-w-md">
      <AnimatePresence mode='popLayout'>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const Toast = React.forwardRef(({ toast, onRemove }, ref) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-white/90 dark:bg-emerald-950/40',
          border: 'border-emerald-500/30',
          icon: 'text-emerald-500',
          shadow: 'shadow-emerald-500/10'
        };
      case 'error':
        return {
          bg: 'bg-white/90 dark:bg-rose-950/40',
          border: 'border-rose-500/30',
          icon: 'text-rose-500',
          shadow: 'shadow-rose-500/10'
        };
      case 'warning':
        return {
          bg: 'bg-white/90 dark:bg-amber-950/40',
          border: 'border-amber-500/30',
          icon: 'text-amber-500',
          shadow: 'shadow-amber-500/10'
        };
      default: // info
        return {
          bg: 'bg-white/90 dark:bg-slate-900/60',
          border: 'border-slate-500/20',
          icon: 'text-workflow-primary',
          shadow: 'shadow-workflow-primary/10'
        };
    }
  };

  const style = getStyle();
  const Icon = icons[toast.type] || Info;

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={`pointer-events-auto backdrop-blur-xl border ${style.bg} ${style.border} ${style.shadow} p-4 rounded-2xl shadow-2xl flex items-center gap-4 relative overflow-hidden group`}
    >
      {/* Progress Bar Background */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-slate-200 dark:bg-white/5" />
      
      {/* Dynamic Icon with Glow */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${style.bg} border ${style.border}`}>
         <Icon className={`w-5 h-5 ${style.icon}`} />
      </div>

      <div className="flex-1 pr-6">
        <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-0.5">{toast.type}</p>
        <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">{toast.message}</p>
      </div>

      <button
        onClick={() => onRemove(toast.id)}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
      >
        <X size={16} />
      </button>

      {/* Glass Glimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
    </motion.div>
  );
});

export default ToastProvider;

