import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import SavedCourses from './student-dashboard/components/SavedCourses';
import { Bookmark, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const SavedCoursesPage = () => {
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
                            <Bookmark size={16} className="text-emerald-500" />
                            <span className="text-sm font-semibold text-slate-400">Bookmarked Courses</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl text-white uppercase font-black tracking-tighter leading-none">
                            Your Bookmarks
                        </h1>
                        <p className="text-slate-400 text-sm max-w-lg font-normal mb-6">
                            Courses you've saved for later. Review and continue your learning journey.
                        </p>
                    </motion.div>
                </div>

                {/* Content Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <SavedCourses />
                </motion.div>
            </div>
        </div>
    );
};

export default SavedCoursesPage;
