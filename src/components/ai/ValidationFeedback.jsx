
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Wand2, X } from 'lucide-react';

export const ValidationFeedback = ({ result, onApplyFix, onDismiss }) => {
    if (!result || (result.issues.length === 0 && !result.improvedContent)) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                className="mb-6 overflow-hidden"
            >
                <div className={`rounded-xl border p-4 ${result.isValid
                    ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800'
                    : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                    }`}>
                    <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${result.isValid
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-600'
                            }`}>
                            <AlertTriangle className="w-5 h-5" />
                        </div>

                        <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                                <h4 className={`font-bold text-sm ${result.isValid ? 'text-amber-800 dark:text-amber-200' : 'text-red-800 dark:text-red-200'
                                    }`}>
                                    {result.isValid ? 'AI Suggestions' : 'Critical Issues Detect'}
                                </h4>
                                <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <ul className="space-y-1">
                                {result.issues.map((issue, idx) => (
                                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                                        <span className="mt-1.5 w-1 h-1 rounded-full bg-current opacity-50" />
                                        {issue}
                                    </li>
                                ))}
                                {result.suggestions.map((suggestion, idx) => (
                                    <li key={`s-${idx}`} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                                        <span className="mt-1.5 w-1 h-1 rounded-full bg-current opacity-50" />
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>

                            {result.improvedContent && (
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50">
                                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">AI Suggested Improvement</p>
                                    <div className="text-sm bg-white dark:bg-black/20 p-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 italic mb-3">
                                        "{result.improvedContent}"
                                    </div>
                                    <button
                                        onClick={() => onApplyFix(result.improvedContent)}
                                        className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 hover:underline"
                                    >
                                        <Wand2 className="w-4 h-4" />
                                        Apply Auto-Fix
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
