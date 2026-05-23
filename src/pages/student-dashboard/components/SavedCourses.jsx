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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-48 bg-[var(--card)] rounded-xl animate-pulse border border-[var(--border)]"></div>
        ))}
      </div>
    );
  }

  if (savedCourses.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-32 px-6 bg-[var(--secondary)] rounded-2xl border border-dashed border-[var(--border)]"
      >
        <div className="w-20 h-20 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-8 border border-[var(--border)]">
          <Bookmark className="w-8 h-8 text-[var(--muted-foreground)]" strokeWidth={1} />
        </div>
        <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3 tracking-tight">Your Library is Empty</h3>
        <p className="text-[var(--muted-foreground)] mb-10 max-w-sm mx-auto font-medium leading-relaxed">
          Curate a personalized repository of sacred knowledge that resonates with your academic journey.
        </p>
        <Link to="/courses" className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-xl transition-all font-bold text-sm shadow-lg">
          Explore Courses
        </Link>
      </motion.div>
    );
  }

  const displayCourses = limit ? savedCourses.slice(0, limit) : savedCourses;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight flex items-center gap-3">
            Academic Collection
            <span className="text-[var(--primary)] text-sm font-bold bg-[var(--primary)]/10 px-3 py-1 rounded-full border border-[var(--border)]">{savedCourses.length}</span>
          </h2>
          <p className="text-[var(--muted-foreground)] mt-2 font-medium">Your personally curated repository of sacred knowledge</p>
        </div>
        {showViewAll && (
          <button 
            onClick={() => setActiveTab?.('saved')}
            className="group flex items-center gap-2 px-6 py-3 rounded-md bg-[var(--card)] border border-[var(--border)] text-xs font-bold text-[var(--foreground)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all"
          >
            Full Library
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                className="group relative p-6 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)] transition-all duration-150 overflow-hidden"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <div className="relative flex gap-5">
                  {/* Course Identity */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--secondary)]">
                      <Image 
                        src={course.logo || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80'} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest bg-[var(--primary)]/10 px-2 py-0.5 rounded border border-[var(--border)]">
                         {course.job_type || 'Curriculum'}
                       </span>
                       <button 
                        onClick={(e) => handleRemove(e, courseId)}
                        className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-500/10 transition-all"
                        title="Remove from collection"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>

                    <h3 className="text-lg font-bold text-[var(--foreground)] tracking-tight leading-snug group-hover:text-[var(--primary)] transition-colors truncate mb-1">
                      {course.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-[var(--muted-foreground)] text-xs font-medium">
                      <span className="flex items-center gap-1.5"><BookOpen size={12} className="text-[var(--primary)]" /> {course.company}</span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                       <div className="flex items-center gap-3 text-[10px] text-[var(--muted-foreground)] font-medium uppercase tracking-wider">
                         <span className="flex items-center gap-1"><Clock size={10} /> {new Date(item.saved_at).toLocaleDateString()}</span>
                       </div>
                       
                       <Link 
                        to={`/courses/detail/${courseId}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[var(--primary)]/90 transition-all active:scale-95 shadow-md"
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
