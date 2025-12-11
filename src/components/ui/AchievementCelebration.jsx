import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Award, Sparkles, CheckCircle2, Flower2 } from 'lucide-react';

/**
 * Achievement Celebration Component
 * Shows beautiful celebration animations when users accomplish tasks
 */
const AchievementCelebration = ({ achievement, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showFlowers, setShowFlowers] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      setShowFlowers(true);
      
      // Hide after animation
      const timer = setTimeout(() => {
        setIsVisible(false);
        setShowFlowers(false);
        if (onComplete) onComplete();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [achievement, onComplete]);

  if (!achievement || !isVisible) return null;

  const achievementConfig = {
    'resume_created': {
      icon: Trophy,
      title: 'Resume Created!',
      message: 'Your professional resume is ready!',
      color: 'from-yellow-400 to-orange-500',
      flowers: true,
    },
    'job_applied': {
      icon: CheckCircle2,
      title: 'Application Sent!',
      message: 'Your application has been submitted successfully!',
      color: 'from-green-400 to-emerald-500',
      flowers: true,
    },
    'profile_complete': {
      icon: Star,
      title: 'Profile Complete!',
      message: 'Your profile is now 100% complete!',
      color: 'from-blue-400 to-indigo-500',
      flowers: true,
    },
    'first_match': {
      icon: Sparkles,
      title: 'First Match Found!',
      message: 'We found your first perfect job match!',
      color: 'from-purple-400 to-pink-500',
      flowers: true,
    },
    'job_saved': {
      icon: Award,
      title: 'Job Saved!',
      message: 'This job has been added to your saved list!',
      color: 'from-cyan-400 to-blue-500',
      flowers: true,
    },
  };

  const config = achievementConfig[achievement.type] || {
    icon: Trophy,
    title: 'Achievement Unlocked!',
    message: achievement.message || 'Great job!',
    color: 'from-workflow-primary to-workflow-primary-600',
    flowers: true,
  };

  const IconComponent = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
          />

          {/* Main Celebration Card */}
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative z-10 bg-white dark:bg-[#13182E] rounded-2xl shadow-2xl p-8 max-w-md mx-4 border-2 border-workflow-primary"
          >
            {/* Confetti/Flowers Background */}
            {showFlowers && (
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      x: '50%',
                      y: '50%',
                      scale: 0,
                      rotate: 0,
                    }}
                    animate={{
                      x: `${50 + (Math.random() - 0.5) * 200}%`,
                      y: `${50 + (Math.random() - 0.5) * 200}%`,
                      scale: [0, 1, 0.8, 0],
                      rotate: 360,
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      ease: 'easeOut',
                    }}
                    className="absolute"
                  >
                    <Flower2 
                      className={`w-6 h-6 text-${['yellow', 'pink', 'purple', 'blue', 'green'][i % 5]}-400`}
                      style={{
                        filter: 'drop-shadow(0 0 4px currentColor)',
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.2, type: 'spring' }}
              className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center shadow-lg relative z-10`}
            >
              <IconComponent className="w-10 h-10 text-white" />
            </motion.div>

            {/* Title */}
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-center text-text-primary dark:text-[#E8EAED] mb-2 relative z-10"
            >
              {config.title}
            </motion.h3>

            {/* Message */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-text-secondary dark:text-[#8B92A3] mb-4 relative z-10"
            >
              {config.message}
            </motion.p>

            {/* Sparkles Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 1] }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="flex justify-center gap-2 relative z-10"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  <Sparkles className="w-5 h-5 text-workflow-primary" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Floating Particles */}
          {showFlowers && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: '50%',
                    y: '50%',
                    scale: 0,
                  }}
                  animate={{
                    x: `${50 + (Math.random() - 0.5) * 100}vw`,
                    y: `${50 + (Math.random() - 0.5) * 100}vh`,
                    scale: [0, 1, 0],
                    rotate: 360,
                  }}
                  transition={{
                    duration: 2.5,
                    delay: i * 0.05,
                    ease: 'easeOut',
                  }}
                  className="absolute"
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-gradient-to-br ${
                      ['from-yellow-400 to-orange-500', 'from-pink-400 to-rose-500', 'from-purple-400 to-indigo-500', 'from-blue-400 to-cyan-500', 'from-green-400 to-emerald-500'][i % 5]
                    }`}
                    style={{
                      boxShadow: '0 0 10px currentColor',
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
};

export default AchievementCelebration;
