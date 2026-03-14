import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';

const VoiceSearch = ({ onTranscript, onError, disabled = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);
        
        // Update search bar immediately with interim results
        if (onTranscript && fullTranscript) {
          onTranscript(fullTranscript.trim());
        }
        
        // Also update on final transcript
        if (finalTranscript && onTranscript) {
          onTranscript(finalTranscript.trim());
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (onError) {
          onError(event.error);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript, onError]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        if (onError) {
          onError('Failed to start voice recognition');
        }
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={isListening ? stopListening : startListening}
        disabled={disabled}
        className={`relative p-2 rounded-lg transition-all duration-200 ${
          isListening
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isListening ? 'Stop listening' : 'Start voice search'}
      >
        {isListening ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <MicOff className="w-5 h-5" />
          </motion.div>
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </motion.button>

      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/30 dark:bg-black/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4"
            onClick={stopListening}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#0A0E27] rounded-[2.5rem] p-8 max-w-sm w-full shadow-[-1px_15px_40px_rgba(0,0,0,0.1)] dark:shadow-[-5px_20px_50px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-white/5 flex flex-col items-center text-center gap-6 relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 animate-pulse" />

              {/* Pulsing Mic Ring */}
              <div className="relative flex items-center justify-center w-24 h-24">
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.4, 0.1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 rounded-full bg-emerald-500/20 dark:bg-emerald-500/10"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.6, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
                  className="absolute inset-2 rounded-full bg-emerald-500/30 dark:bg-emerald-500/20"
                />
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Mic className="w-7 h-7 text-white animate-pulse" />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-800 dark:text-white">Listening...</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest font-bold">Speak Clearly</p>
              </div>

              {transcript ? (
                <div className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-2xl p-4 text-center">
                  <p className="text-sm font-bold text-slate-800 dark:text-white leading-relaxed">
                    "{transcript}"
                  </p>
                </div>
              ) : (
                <div className="h-14 flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                </div>
              )}

              <button
                onClick={stopListening}
                className="mt-2 w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:brightness-110 active:scale-95 transition-all"
              >
                Done Speaking
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceSearch;

