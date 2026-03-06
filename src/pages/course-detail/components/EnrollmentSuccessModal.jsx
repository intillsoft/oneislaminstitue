/**
 * EnrollmentSuccessModal
 * Beautiful animated modal shown after successful course enrollment
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Sparkles, ArrowRight, LayoutDashboard, BookOpen, Star } from 'lucide-react';

// Floating particle component
const Particle = ({ delay, x, size, color }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ 
      width: size, 
      height: size, 
      backgroundColor: color,
      left: `${x}%`,
      bottom: 0 
    }}
    initial={{ y: 0, opacity: 0, scale: 0 }}
    animate={{ 
      y: [0, -200, -400],
      opacity: [0, 1, 0],
      scale: [0, 1.2, 0.5],
      x: [0, (Math.random() - 0.5) * 100]
    }}
    transition={{ 
      duration: 2.5 + Math.random(), 
      delay: delay, 
      ease: 'easeOut',
      repeat: Infinity,
      repeatDelay: 1
    }}
  />
);

const EnrollmentSuccessModal = ({ isOpen, onClose, course, courseId }) => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timer);
    }
    setShowContent(false);
  }, [isOpen]);

  const particles = Array.from({ length: 20 }, (_, i) => ({
    delay: i * 0.1,
    x: Math.random() * 100,
    size: 4 + Math.random() * 8,
    color: [
      'rgba(16, 185, 129, 0.6)',   // emerald
      'rgba(59, 130, 246, 0.5)',    // blue  
      'rgba(168, 85, 247, 0.4)',    // purple
      'rgba(251, 191, 36, 0.5)',    // amber
      'rgba(236, 72, 153, 0.4)',    // pink
    ][i % 5]
  }));

  const handleStartCourse = () => {
    onClose();
    // Navigate to the course onboarding flow
    navigate(`/courses/${courseId}/onboarding`);
  };

  const handleGoToDashboard = () => {
    onClose();
    navigate('/dashboard/enrollments');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleGoToDashboard}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md overflow-hidden"
          >
            {/* Card */}
            <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl">
              
              {/* Particle field */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                {particles.map((p, i) => (
                  <Particle key={i} {...p} />
                ))}
              </div>

              {/* Top Gradient Banner */}
              <div className="relative h-32 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent)]" />
                
                {/* Success checkmark */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                  className="relative"
                >
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
                    </motion.div>
                  </div>
                  
                  {/* Pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/40"
                    animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                  />
                </motion.div>
              </div>

              {/* Content */}
              <div className="relative px-8 pb-8 pt-6">
                <AnimatePresence>
                  {showContent && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {/* Title */}
                      <div className="text-center mb-6">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 mb-3"
                        >
                          <Sparkles size={12} className="text-emerald-600 dark:text-emerald-400" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Enrollment Confirmed</span>
                        </motion.div>

                        <motion.h2
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2"
                        >
                          You're In! 🎉
                        </motion.h2>
                        
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="text-sm text-slate-500 dark:text-slate-400"
                        >
                          You've successfully enrolled in
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.45 }}
                          className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-1"
                        >
                          {course?.title || 'this course'}
                        </motion.p>
                      </div>

                      {/* Quick Stats */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="grid grid-cols-3 gap-3 mb-6"
                      >
                        {[
                          { icon: BookOpen, label: 'Self-Paced', desc: 'Learning' },
                          { icon: Star, label: 'Certificate', desc: 'Included' },
                          { icon: Sparkles, label: 'Full Access', desc: 'Granted' },
                        ].map((item, i) => (
                          <div key={i} className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                            <item.icon size={16} className="mx-auto text-emerald-500 mb-1.5" />
                            <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{item.label}</p>
                            <p className="text-[9px] text-slate-400 dark:text-slate-500">{item.desc}</p>
                          </div>
                        ))}
                      </motion.div>

                      {/* CTA Buttons */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-3"
                      >
                        <button
                          onClick={handleStartCourse}
                          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/25 active:scale-[0.98] flex items-center justify-center gap-2 text-sm group"
                        >
                          Start Learning
                          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                        
                        <button
                          onClick={handleGoToDashboard}
                          className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 text-sm"
                        >
                          <LayoutDashboard size={15} />
                          Go to Dashboard
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnrollmentSuccessModal;
