import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, BookOpen, ArrowUpRight, Sparkles, Star } from 'lucide-react';
import { useAuthContext } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import { progressService } from '../../../services/progressService';

const FeaturedCourseCard = ({ job, index }) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [courseData, setCourseData] = useState(job);
  const [progress, setProgress] = useState(null);

  // Still using accents for the top line and progress bar to keep them distinct
  const accentsArr = ['#10b981', '#8b5cf6', '#f59e0b', '#3b82f6', '#ec4899', '#14b8a6'];
  const accent = accentsArr[index % accentsArr.length];

  useEffect(() => {
    if (job) setCourseData(job);
  }, [job]);

  useEffect(() => {
    if (!job?.id) return;
    const fetchFreshCourseData = async () => {
      try {
        const { data, error } = await supabase.from('jobs').select('*').eq('id', job.id).single();
        if (!error && data) setCourseData(data);
      } catch (err) {}
    };
    fetchFreshCourseData();
  }, [job?.id]);

  useEffect(() => {
    if (!job?.id || !user?.id) return;
    (async () => {
      const { data } = await supabase.from('applications').select('id').eq('job_id', job.id).eq('user_id', user.id).maybeSingle();
      if (data) setIsEnrolled(true);
    })();
  }, [job?.id, user?.id]);

  useEffect(() => {
    if (!user?.id || !job?.id || !isEnrolled) return;
    (async () => {
      try {
        const p = await progressService.getByCourse(job.id);
        setProgress(p);
      } catch {}
    })();
  }, [user?.id, job?.id, isEnrolled]);

  const handleCardClick = () => {
    if (isEnrolled) {
        navigate(`/courses/${job?.id}/learn`);
    } else {
        navigate(`/courses/detail/${job?.id}`);
    }
  };

  const title = courseData?.title || 'Course';
  const provider = courseData?.company || 'One Islam Institute';
  const thumbSrc = courseData?.thumbnail || courseData?.thumbnail_url || courseData?.image || courseData?.featured_image || courseData?.logo;
  const pct = progress ? Math.round(((progress.lessons_completed || 0) / Math.max(progress.lessons_total || 1, 1)) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      whileHover={{ y: -4 }}
      className="group relative h-full cursor-pointer select-none w-full max-w-[400px] mx-auto sm:max-w-none"
      onClick={handleCardClick}
    >
      <div className="relative flex flex-col h-full rounded-[1.2rem] bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/[0.05] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] dark:shadow-none hover:shadow-xl transition-all duration-500 overflow-hidden">
        
        {/* Top Accent Line */}
        <div className="h-[2px] w-full" style={{ backgroundColor: accent }} />

        {/* Media Block - High Vibrancy */}
        <div className="relative w-full h-32 sm:h-36 overflow-hidden bg-slate-50 dark:bg-slate-900/50">
          {thumbSrc ? (
            <img 
              src={thumbSrc} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-emerald-50/30 dark:bg-emerald-500/5">
              <BookOpen className="w-8 h-8 text-emerald-500/20" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-100 dark:border-white/5 text-[8px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 shadow-sm">
              <Sparkles size={10} className="text-emerald-500" />
              Recommended
            </div>
            {courseData.featured && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-100 dark:border-white/5 text-[8px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 shadow-sm">
                <Star size={10} className="text-amber-500" />
                Trending
              </div>
            )}
          </div>

          {isEnrolled && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[8px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20">
              <CheckCircle2 size={10} />
              Enrolled
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 p-5 pt-4">
          <div className="mb-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1.5 block">
              {provider}
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight tracking-tight line-clamp-2">
              {title}
            </h3>
          </div>

          {/* Action Row - Emerald Green Button */}
          <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/[0.04]">
            {isEnrolled && progress ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-widest text-slate-400">
                  <span>Current Progress</span>
                  <span className="text-emerald-600">{pct}%</span>
                </div>
                <div className="w-full h-1 rounded-full bg-slate-100 dark:bg-white/[0.05] overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-full rounded-full bg-emerald-600" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 group/btn">
                <div className="flex-1 flex items-center justify-between py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/20 group/action">
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                    View Course Details
                  </span>
                  <ArrowUpRight size={14} className="text-white group-hover/action:translate-x-0.5 group-hover/action:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedCourseCard;
