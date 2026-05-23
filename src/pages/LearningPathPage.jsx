import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import ApplicationTracker from './student-dashboard/components/ApplicationTracker';
import { Zap, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const LearningPathPage = () => {
    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-3"
                    >
                        <div className="flex items-center gap-2">
                            <Zap size={16} className="text-[var(--color-primary)]" />
                            <span className="text-sm font-semibold text-[var(--color-text-tertiary)] uppercase tracking-widest">Enrollments</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-[var(--color-text-primary)] uppercase tracking-tighter leading-none">
                            My Enrollments
                        </h1>
                        <p className="text-[var(--color-text-tertiary)] text-sm max-w-lg font-medium mb-6">
                            Track your enrolled courses and application status.
                        </p>
                    </motion.div>
                </div>

                {/* Content Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <ApplicationTracker />
                </motion.div>
            </div>
        </div>
    );
};

export default LearningPathPage;
