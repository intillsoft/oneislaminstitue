import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import ApplicationTracker from './student-dashboard/components/ApplicationTracker';
import { Zap, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const LearningPathPage = () => {
    return (
        <div className="min-h-screen bg-bg text-white pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-3"
                    >
                        <div className="flex items-center gap-2">
                            <Zap size={16} className="text-emerald-500" />
                            <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Enrollments</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none">
                            My Enrollments
                        </h1>
                        <p className="text-slate-400 text-sm max-w-lg font-medium mb-6">
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
