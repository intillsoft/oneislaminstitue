import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuthContext } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import { progressService } from '../../../services/progressService';

// Deterministic gradient per card based on index
const gradients = [
  ['#10b981', '#059669'],   // emerald
  ['#8b5cf6', '#6d28d9'],   // violet
  ['#f59e0b', '#d97706'],   // amber
  ['#3b82f6', '#2563eb'],   // blue
  ['#ec4899', '#db2777'],   // pink
  ['#14b8a6', '#0d9488'],   // teal
];

const RecommendedCourseCard = ({ course, index }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [courseData, setCourseData] = useState(course);
  const [progress, setProgress] = useState(null);

  const [accentStart, accentEnd] = gradients[index % gradients.length];

  useEffect(() => {
    if (course) setCourseData(course);
  }, [course]);

  useEffect(() => {
    if (!course?.id || !user?.id) return;
    (async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', course.id)
        .eq('user_id', user.id)
        .maybeSingle();
      if (!error && data) setIsEnrolled(true);
    })();
  }, [course?.id, user?.id]);

  useEffect(() => {
    if (!user?.id || !course?.id || !isEnrolled) { setProgress(null); return; }
    let cancelled = false;
    (async () => {
      try {
        const p = await progressService.getByCourse(course.id);
        if (!cancelled) setProgress(p);
      } catch { if (!cancelled) setProgress(null); }
    })();
    return () => { cancelled = true; };
  }, [user?.id, course?.id, isEnrolled]);

  const handleClick = () => navigate(`/courses/detail/${course.id}`);

  const companyData = Array.isArray(course.companies) ? course.companies[0] : course.companies;
  const provider = courseData?.company || companyData?.name || 'Academy';
  const title = courseData?.title || 'Course';
  const hasThumb = !!(courseData?.thumbnail || courseData?.thumbnail_url || courseData?.image || courseData?.featured_image);
  const thumbSrc = courseData?.thumbnail || courseData?.thumbnail_url || courseData?.image || courseData?.featured_image;

  const pct = progress
    ? Math.round(((progress.lessons_completed || 0) / Math.max(progress.lessons_total || 1, 1)) * 100)
    : 0;

  return (
    <motion.div
      onClick={handleClick}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      whileHover={{ y: -4 }}
      className="group relative flex-shrink-0 w-[260px] md:w-[280px] cursor-pointer select-none"
    >
      {/* Card shell */}
      <div className="relative rounded-[1.6rem] overflow-hidden bg-white dark:bg-[#0d1025] border border-slate-100 dark:border-white/[0.06] shadow-sm group-hover:shadow-2xl transition-all duration-500 flex flex-col h-full">

        {/* Colour accent strip at top */}
        <div
          className="h-[5px] w-full flex-shrink-0"
          style={{ background: `linear-gradient(90deg, ${accentStart}, ${accentEnd})` }}
        />

        {/* Thumbnail or icon block */}
        <div className="relative w-full h-[150px] overflow-hidden bg-slate-50 dark:bg-white/[0.02] flex-shrink-0">
          {hasThumb ? (
            <img
              src={thumbSrc}
              alt={title}
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${accentStart}18, ${accentEnd}10)` }}
            >
              <BookOpen
                className="w-10 h-10 opacity-30 transition-transform group-hover:scale-110 duration-500"
                style={{ color: accentStart }}
              />
            </div>
          )}

          {/* Recommended badge */}
          <div className="absolute top-3 left-3">
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.15em] text-white shadow-lg"
              style={{ background: `linear-gradient(90deg, ${accentStart}, ${accentEnd})` }}
            >
              <Sparkles size={8} />
              Recommended
            </div>
          </div>

          {/* Enrolled badge */}
          {isEnrolled && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase tracking-widest shadow">
              <CheckCircle2 size={9} />
              Enrolled
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4 pt-3 gap-3">

          {/* Provider */}
          <span
            className="text-[9px] font-black uppercase tracking-[0.2em] truncate opacity-70"
            style={{ color: accentStart }}
          >
            {provider}
          </span>

          {/* Title */}
          <h3 className="text-[13px] font-[900] text-slate-900 dark:text-white leading-snug tracking-tight line-clamp-2 group-hover:opacity-80 transition-opacity">
            {title}
          </h3>

          {/* Progress bar (enrolled) or CTA (not enrolled) */}
          <div className="mt-auto pt-2 border-t border-slate-100 dark:border-white/[0.05]">
            {isEnrolled && progress ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Progress</span>
                  <span className="text-[9px] font-black" style={{ color: accentStart }}>{pct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-white/[0.05] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${accentStart}, ${accentEnd})` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between group/cta">
                <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 group-hover/cta:text-slate-700 dark:group-hover/cta:text-white transition-colors">
                  Explore Curriculum
                </span>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-md"
                  style={{ background: `linear-gradient(135deg, ${accentStart}, ${accentEnd})` }}
                >
                  <ArrowUpRight size={13} className="text-white" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendedCourseCard;
