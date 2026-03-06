import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, Star, ArrowUpRight, CheckCircle2, BookOpen, 
  MapPin, GraduationCap, Laptop, Sparkles, Play
} from 'lucide-react';
import { useAuthContext } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import { progressService } from '../../../services/progressService';

const CourseCard = ({ job: course, isSaved, onSave, index = 0 }) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [courseData, setCourseData] = useState(course);
  const [progress, setProgress] = useState(null);

  const accentsArr = ['#10b981', '#8b5cf6', '#f59e0b', '#3b82f6', '#ec4899', '#14b8a6'];
  const accent = accentsArr[index % accentsArr.length];

  useEffect(() => {
    if (course) setCourseData(course);
  }, [course]);

  useEffect(() => {
    if (!course?.id || !user?.id) return;
    (async () => {
      const { data } = await supabase.from('applications').select('id').eq('job_id', course.id).eq('user_id', user.id).maybeSingle();
      if (data) setIsEnrolled(true);
    })();
  }, [course?.id, user?.id]);

  useEffect(() => {
    if (!user?.id || !course?.id || !isEnrolled) return;
    (async () => {
      try {
        const p = await progressService.getByCourse(course.id);
        setProgress(p);
      } catch {}
    })();
  }, [user?.id, course?.id, isEnrolled]);

  const handleCardClick = () => {
    if (isEnrolled) {
        navigate(`/courses/${course?.id}/learn`);
    } else {
        navigate(`/courses/detail/${course?.id}`);
    }
  };

  const title = courseData?.title || 'Course';
  const provider = courseData?.company || 'One Islam Institute';
  const thumbSrc = courseData?.thumbnail || courseData?.thumbnail_url || courseData?.image || courseData?.featured_image || courseData?.logo;
  const pct = progress ? Math.round(((progress.lessons_completed || 0) / Math.max(progress.lessons_total || 1, 1)) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 10) * 0.05 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col h-full cursor-pointer select-none w-full max-w-[400px] mx-auto sm:max-w-none"
      onClick={handleCardClick}
    >
      <div className="relative flex flex-col h-full rounded-[1.2rem] overflow-hidden bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/[0.05] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] dark:shadow-none hover:shadow-xl transition-all duration-500">
        
        {/* Top Accent line */}
        <div className="h-[2px] w-full" style={{ backgroundColor: accent }} />

        {/* Media Block */}
        <div className="relative w-full h-40 overflow-hidden bg-slate-50 dark:bg-slate-900/50">
          {thumbSrc ? (
            <img 
              src={thumbSrc} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-emerald-50/20 dark:bg-emerald-500/5">
              <BookOpen className="w-8 h-8 text-emerald-500/20" />
            </div>
          )}

          {/* Floating Labels */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {courseData.featured && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-100 dark:border-white/5 text-[8px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 shadow-sm">
                <Sparkles size={8} className="text-emerald-500" />
                Featured
              </div>
            )}
            {courseData.matchScore && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-100 dark:border-white/5 text-[8px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 shadow-sm">
                <Star size={8} className="text-emerald-500 fill-emerald-500" />
                {courseData.matchScore}% Match
              </div>
            )}
          </div>

          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
            {isEnrolled && (
              <div className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[8px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1">
                <CheckCircle2 size={9} />
                Enrolled
              </div>
            )}
            {!isEnrolled && courseData.salary_min > 0 && (
              <div className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[8px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                <Sparkles size={9} />
                ${courseData.salary_min} Donation
              </div>
            )}
            {!isEnrolled && courseData.salary_min <= 0 && courseData.is_paid && (
              <div className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-[8px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1">
                <Sparkles size={9} />
                Donation
              </div>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onSave(); }}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${isSaved ? 'bg-rose-500 text-white shadow-lg' : 'bg-white/80 dark:bg-black/40 text-slate-400 hover:text-rose-500 backdrop-blur-sm shadow-sm'}`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 p-5">
          <div className="mb-4">
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1 block">
              {provider}
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug tracking-tight line-clamp-2">
              {title}
            </h3>
          </div>

          {/* Progress / Status row */}
          <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/[0.04]">
            {isEnrolled && progress ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[8px] font-bold uppercase text-slate-400 tracking-widest">
                  <span>Progress</span>
                  <span className="text-emerald-600">{pct}%</span>
                </div>
                <div className="w-full h-[2px] rounded-full bg-slate-100 dark:bg-white/[0.05] overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-full rounded-full bg-emerald-600" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-emerald-600 hover:bg-emerald-700 py-1.5 px-4 rounded-xl transition-all group/cta shadow-lg shadow-emerald-600/10">
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                  {isEnrolled ? 'Open Course' : 'Enroll Now'}
                </span>
                <ArrowUpRight size={13} className="text-white group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
