import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Mic, X } from 'lucide-react';
import LessonTextAssistant from './LessonTextAssistant';
import LessonVoiceAssistant from './LessonVoiceAssistant';

const FloatingLessonAssistants = ({ courseId, lessonId, activeLesson }) => {
  const [activeMode, setActiveMode] = useState(null); // 'text', 'voice', or null

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-[calc(1.5rem+var(--bottom-nav-height,0px))] right-6 z-[9990] flex flex-col gap-4 transition-all duration-300">
        <AnimatePresence>
          {!activeMode && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex flex-col gap-4"
            >
              {/* Voice Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveMode('voice')}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 border border-white/10 group relative"
              >
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Mic className="w-6 h-6" />
                <span className="absolute right-full mr-4 bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none">
                  Voice Assistant
                </span>
              </motion.button>

              {/* Text Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveMode('text')}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 border border-white/10 group relative"
              >
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <MessageSquare className="w-6 h-6" />
                <span className="absolute right-full mr-4 bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none">
                  Text Assistant
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Assistant Overlays */}
      <AnimatePresence>
        {activeMode === 'text' && (
          <LessonTextAssistant
            courseId={courseId}
            lessonId={lessonId}
            activeLesson={activeLesson}
            onClose={() => setActiveMode(null)}
          />
        )}
        {activeMode === 'voice' && (
          <LessonVoiceAssistant
            courseId={courseId}
            lessonId={lessonId}
            activeLesson={activeLesson}
            onClose={() => setActiveMode(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingLessonAssistants;
