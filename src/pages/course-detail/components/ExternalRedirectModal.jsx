import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    ExternalLink,
    ShieldCheck,
    ArrowRight,
    Info,
    Building2,
    Globe
} from 'lucide-react';

const ExternalRedirectModal = ({ isOpen, onClose, course, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-surface-elevated dark:bg-[#13182E] rounded-3xl shadow-premium border border-border dark:border-[#1E2640] overflow-hidden"
                >
                    {/* Header Accent */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400" />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-8">
                        {/* Icon Header */}
                        <div className="mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-600/10 flex items-center justify-center mb-4">
                                <Globe className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight text-text-primary leading-tight uppercase">
                                External Enrollment
                            </h2>
                            <p className="text-text-muted mt-2 text-sm font-medium">
                                You're leaving the Institute to complete your enrollment on an external academic platform.
                            </p>
                        </div>

                        {/* Course Summary Card */}
                        <div className="bg-surface-elevated dark:bg-white/[0.03] rounded-2xl p-4 border border-border dark:border-white/5 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-surface dark:bg-slate-900 flex items-center justify-center border border-border dark:border-slate-800 flex-shrink-0">
                                    <Building2 className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-sm font-black text-text-primary truncate uppercase tracking-tight">
                                        {course?.title}
                                    </h3>
                                    <p className="text-[10px] text-text-muted font-black uppercase tracking-widest truncate">
                                        {course?.company || course?.companies?.name}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Information Points */}
                        <div className="space-y-4 mb-8">
                            <div className="flex gap-4">
                                <div className="mt-1 w-8 h-8 rounded-lg bg-emerald-600/10 flex items-center justify-center flex-shrink-0">
                                    <ExternalLink className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-text-primary uppercase tracking-widest">
                                        Enroll via {(!course?.source || course.source.toLowerCase().includes('jsearch')) ? 'External Portal' : course.source}
                                    </h4>
                                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                                        We've secured this curriculum link. The enrollment process will be completed on the department's primary site.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="mt-1 w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-text-primary uppercase tracking-widest">
                                        Academic Tracking Enabled
                                    </h4>
                                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                                        This course will remain in your learning dashboard so you can manage your scholarship path in one place.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-4 rounded-xl border border-border text-text-muted font-black text-[10px] uppercase tracking-widest hover:bg-surface-elevated transition-all"
                            >
                                Remain Here
                            </button>
                            <button
                                onClick={onConfirm}
                                className="flex-[1.5] px-6 py-4 rounded-xl bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2 group transition-all active:scale-[0.98]"
                            >
                                Go to Enrollment Portal
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Bottom Banner */}
                    <div className="bg-surface px-8 py-4 border-t border-border">
                        <div className="flex items-center gap-2 text-[8px] text-text-muted font-black uppercase tracking-[0.3em]">
                            <Info className="w-3 h-3 text-emerald-500" />
                            Verified Scholar Resource
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ExternalRedirectModal;
