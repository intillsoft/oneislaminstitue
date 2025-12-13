import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const templates = [
    {
        id: 'modern',
        name: 'Modern Tech',
        description: 'Clean, two-column layout perfect for tech roles.',
        color: 'bg-slate-900',
        stats: 'Most Popular'
    },
    {
        id: 'professional',
        name: 'Executive',
        description: 'Traditional, elegant serif layout for leadership.',
        color: 'bg-indigo-900',
        stats: 'Best for Management'
    },
    {
        id: 'creative',
        name: 'Creative Portfolio',
        description: 'Bold typography and color use for designers.',
        color: 'bg-pink-600',
        stats: 'High Impact'
    },
    {
        id: 'technical',
        name: 'Developer',
        description: 'Focus on skills and projects. Git-inspired theme.',
        color: 'bg-gray-800',
        stats: 'ATS Optimized'
    },
    {
        id: 'minimal',
        name: 'Minimalist',
        description: 'Maximum whitespace, purely content-focused.',
        color: 'bg-gray-200 text-gray-800', // Example different style
        stats: 'Clean Look'
    }
];

const TemplateSelector = ({ currentTemplate, onSelect }) => {
    return (
        <div className="mb-8">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Choose Template</h3>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {templates.map((template) => (
                    <motion.button
                        key={template.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelect(template.id)}
                        className={`relative group text-left rounded-xl border-2 transition-all overflow-hidden ${currentTemplate === template.id
                                ? 'border-workflow-primary ring-2 ring-workflow-primary ring-offset-2 dark:ring-offset-gray-900'
                                : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                            }`}
                    >
                        {/* Template Preview (Abstract) */}
                        <div className={`h-24 ${template.color} relative p-3 flex flex-col justify-end`}>
                            <div className="w-12 h-1 bg-white/30 rounded mb-1" />
                            <div className="w-8 h-1 bg-white/20 rounded" />

                            {currentTemplate === template.id && (
                                <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-workflow-primary shadow-sm">
                                    <Check className="w-4 h-4" />
                                </div>
                            )}
                        </div>

                        <div className="p-3 bg-white dark:bg-gray-800">
                            <div className="font-medium text-sm text-gray-900 dark:text-white truncate">{template.name}</div>
                            <div className="text-[10px] text-gray-500 mt-1 truncate">{template.stats}</div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default TemplateSelector;
