import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Sparkles, ArrowRight, Trash2, BookOpen, Clock, MapPin } from 'lucide-react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { motion, AnimatePresence } from 'framer-motion';
import { courseService } from '../../../services/jobService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';

const SavedCourses = ({ limit, showViewAll = false, setActiveTab }) => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const [savedCourses, setSavedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSavedCourses();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadSavedCourses = async () => {
    try {
      setLoading(true);
      const saved = await courseService.getSavedCourses();
      setSavedCourses(saved || []);
    } catch (error) {
      console.error('Error loading saved courses:', error);
      showError('Failed to load your collection');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await courseService.unsaveCourse(id);
      setSavedCourses(prev => prev.filter(item => (item.course?.id || item.job?.id || item.id) !== id));
      success('Removed from collection');
    } catch (error) {
      showError('Failed to remove course');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-48 bg-white/5 rounded-3xl animate-pulse border border-emerald-500/20"></div>
        ))}
      </div>
    );
  }

  if (savedCourses.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-32 px-6 bg-slate-900/40 rounded-[3rem] border border-dashed border-emerald-500/20 backdrop-blur-sm"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-500/5 flex items-center justify-center mx-auto mb-8 border border-emerald-500/10">
          <Bookmark className="w-8 h-8 text-emerald-500/40" strokeWidth={1} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Your Library is Empty</h3>
        <p className="text-slate-400 mb-10 max-w-sm mx-auto font-medium leading-relaxed">
          Curate a personalized repository of sacred knowledge that resonates with your academic journey.
        </p>
        <Link to="/courses" className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl transition-all font-bold text-sm shadow-xl shadow-emerald-500/20">
          Explore Courses
        </Link>
      </motion.div>
    );
  }

  const displayCourses = limit ? savedCourses.slice(0, limit) : savedCourses;

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            Academic Collection
            <span className="text-emerald-500 text-sm font-black bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{savedCourses.length}</span>
          </h2>
          <p className="text-slate-400 mt-2 font-medium">Your personally curated repository of sacred knowledge</p>
        </div>
        {showViewAll && (
          <button 
            onClick={() => setActiveTab?.('saved')}
            className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-emerald-500/20 text-xs font-bold text-slate-300 hover:text-white hover:border-emerald-500/40 transition-all"
          >
            Full Library
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatePresence>
          {displayCourses.map((item, idx) => {
            const course = item.course || item.job || item;
            const courseId = course.id;

            return (
              <motion.div
                key={item.id || courseId}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.05] transition-all duration-500 backdrop-blur-md overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-emerald-500/10 transition-colors" />

                <div className="relative flex gap-6">
                  {/* Course Identity */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl group-hover:scale-105 transition-transform duration-500 bg-slate-800">
                      <Image 
                        src={course.logo || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80'} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/10">
                         {course.job_type || 'Curriculum'}
                       </span>
                       <button 
                        onClick={(e) => handleRemove(e, courseId)}
                        className="p-2 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                        title="Remove from collection"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>

                    <h3 className="text-xl font-bold text-white tracking-tight leading-snug group-hover:text-emerald-400 transition-colors truncate mb-1">
                      {course.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-slate-400 text-xs font-medium">
                      <span className="flex items-center gap-1.5"><BookOpen size={12} className="text-emerald-500/50"/> {course.company}</span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                       <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                         <span className="flex items-center gap-1"><Clock size={10} /> {new Date(item.saved_at).toLocaleDateString()}</span>
                       </div>
                       
                       <Link 
                        to={`/courses/detail/${courseId}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-lg active:scale-95"
                       >
                         Open <ArrowRight size={12} />
                       </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SavedCourses;

