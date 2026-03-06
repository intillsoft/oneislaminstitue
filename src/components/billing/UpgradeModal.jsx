import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UpgradeModal = ({ isOpen, onClose, featureName, requiredPlan = 'Professional' }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10"
                >
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-workflow-primary to-workflow-accent opacity-20" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors z-20"
                    >
                        <X size={20} className="text-slate-500" />
                    </button>

                    <div className="relative p-8 pt-10 text-center z-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-workflow-primary to-workflow-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
                            <Crown size={32} className="text-white" />
                        </div>

                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                            Unlock {featureName}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">
                            You've reached the limit for your current plan. Upgrade to
                            <span className="font-bold text-workflow-primary"> {requiredPlan} </span>
                            to continue using this advanced AI tool.
                        </p>

                        <div className="space-y-3 mb-8 text-left bg-slate-50 dark:bg-white/5 p-6 rounded-xl border border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-3">
                                <Check size={16} className="text-green-500" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Unlimited Career Simulations</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Check size={16} className="text-green-500" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Advanced AI Resume Analysis</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Check size={16} className="text-green-500" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority 24/7 Support</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                            >
                                Maybe Later
                            </button>
                            <button
                                onClick={() => navigate('/billing')}
                                className="flex-[2] py-3 rounded-xl font-bold bg-workflow-primary text-white shadow-lg shadow-workflow-primary/25 hover:shadow-xl hover:scale-[1.02] transition-all"
                            >
                                View Plans & Upgrade
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default UpgradeModal;
