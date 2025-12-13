import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, TrendingUp, RefreshCw, ArrowRightLeft } from 'lucide-react';

const AIContextToolbar = ({ visible, position, onAction, onClose }) => {
    if (!visible) return null;

    const tools = [
        { id: 'actionize', icon: Zap, label: 'Actionize', color: 'text-yellow-500' },
        { id: 'quantify', icon: TrendingUp, label: 'Quantify', color: 'text-emerald-500' },
        { id: 'tone', icon: ArrowRightLeft, label: 'Tone Shift', color: 'text-purple-500' },
        { id: 'rewrite', icon: RefreshCw, label: 'Rewrite', color: 'text-blue-500' },
    ];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="fixed z-50 bg-slate-900 dark:bg-slate-800 text-white rounded-xl shadow-2xl border border-slate-700 p-2 flex items-center gap-1 backdrop-blur-xl"
                style={{
                    top: position.top - 60, // Position above selection
                    left: position.left,
                    transform: 'translateX(-50%)'
                }}
            >
                <div className="flex items-center gap-1 border-r border-slate-700 pr-2 mr-2">
                    <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                    <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">AI Edit</span>
                </div>

                {tools.map((tool) => (
                    <button
                        key={tool.id}
                        onClick={(e) => { e.stopPropagation(); onAction(tool.id); }}
                        className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-700 rounded-lg transition-colors text-xs font-medium group"
                    >
                        <tool.icon className={`w-3.5 h-3.5 ${tool.color} group-hover:scale-110 transition-transform`} />
                        {tool.label}
                    </button>
                ))}

                {/* Close Button (Invisible overlay handles outside click, but explicit close is good UX) */}
            </motion.div>
        </AnimatePresence>
    );
};

export default AIContextToolbar;
