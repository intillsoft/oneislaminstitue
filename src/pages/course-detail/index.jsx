import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { courseService } from '../../services/jobService';
import { progressService } from '../../services/progressService';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../lib/supabase';
import EnrollmentSuccessModal from './components/EnrollmentSuccessModal';
import {
  Clock,
  Bookmark,
  CheckCircle,
  Sparkles,
  BookOpen,
  Star,
  Award,
  ArrowRight,
  MapPin,
  Lock,
  ArrowLeft,
  Users,
  Play,
  Globe,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import { formatRequirements, formatBenefits } from '../../utils/jobDataFormatter';

import RelatedCourses from './components/RelatedCourses';
import CourseFAQ from './components/CourseFAQ';
import CourseCurriculum from './components/CourseCurriculum';
import { Helmet } from 'react-helmet';

const CourseDetail = () => {
  const { id: courseId } = useParams();
  const { user, profile, userRole } = useAuthContext();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [course, setCourse] = useState(null);
  const [isCourseSaved, setIsCourseSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [progressData, setProgressData] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (courseId) {
      loadCourse();
      checkIfSaved();
      checkIfEnrolled();
    } else {
      navigate('/courses');
    }
  }, [courseId, user]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const data = await courseService.getById(courseId);
      if (!data) throw new Error('Course not found');
      setCourse(data);
    } catch (error) {
      showError(`Failed to load course: ${error.message}`);
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    if (!user) return;
    try {
      const saved = await courseService.getSavedCourses();
      setIsCourseSaved(saved.some(sj => (sj.course?.id || sj.job?.id) === courseId));
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleSaveCourse = async () => {
    if (!user) {
      showError('Please sign in to save');
      navigate('/login', { state: { from: location } });
      return;
    }

    try {
      if (isCourseSaved) {
        await courseService.unsaveCourse(courseId);
        setIsCourseSaved(false);
        success('Removed from saved items');
      } else {
        await courseService.saveCourse(courseId);
        setIsCourseSaved(true);
        success('Saved successfully');
      }
    } catch (error) {
      showError('Failed to save');
    }
  };

  const checkIfEnrolled = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('id')
        // Backend stores enrollments on applications.job_id, so we need
        // to check against that field to correctly detect enrollment.
        .eq('job_id', courseId)
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) {
        console.warn('checkIfEnrolled error (non-fatal):', error.message);
        return;
      }
      if (data) {
        setIsAlreadyEnrolled(true);
        try {
          const prog = await progressService.getByCourse(courseId);
          setProgressData(prog);
        } catch(e) { console.warn('No progress found for course yet.'); }
      }
    } catch (err) {
      console.error('Error checking enrollment:', err);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      showError('Please sign in to enroll');
      navigate('/login', { state: { from: location } });
      return;
    }

    if (isAlreadyEnrolled) {
      // Navigate to the course classroom if they have progress, otherwise show onboarding
      const hasStarted = progressData && progressData.lessons_completed > 0;
      if (hasStarted) {
        navigate(`/courses/${courseId}/learn`);
      } else {
        navigate(`/courses/${courseId}/onboarding`);
      }
      return;
    }

    setIsEnrolling(true);
    try {
      const isPaid = (course.salary_min > 0) && 
                     userRole !== 'admin' && 
                     userRole !== 'instructor';

      if (isPaid) {
        success('Redirecting to secure payment for access...');
        const actualMinAmount = course.salary_min || 0;
        const maxParam = course.salary_max > 0 ? `&maxAmount=${course.salary_max}` : '';
        setTimeout(() => navigate(`/checkout?courseId=${courseId}&title=${encodeURIComponent(course.title)}&minAmount=${actualMinAmount}${maxParam}`), 1000);
        return;
      }

      const { enrollmentService } = await import('../../services/applicationService');
      await enrollmentService.create(courseId, {
        notes: 'Course enrollment via detailed curriculum page'
      });

      // Send enrollment welcome notification
      try {
        const { sendEnrollmentWelcomeNotification } = await import('../../services/notificationTriggers');
        const userName = profile?.name || profile?.first_name || 'Student';
        await sendEnrollmentWelcomeNotification(
          user.id,
          userName,
          course.title,
          courseId,
          course.instructor_id
        );
      } catch (notifError) {
        console.log('Enrollment notification sent or skipped');
      }

      setIsAlreadyEnrolled(true);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Enrollment error:', error);
      showError(error.message || 'Enrollment failed. Please try again.');
    } finally {
      setIsEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0A1120] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-slate-200 dark:border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) return null;

  const requirements = formatRequirements(course.requirements);
  const outcomes = formatBenefits(course.benefits);

  const courseHighlights = [
    { icon: Play, label: 'Self-Paced', desc: 'Learn on your own schedule' },
    { icon: Globe, label: 'Online Access', desc: 'Study from anywhere in the world' },
    { icon: Award, label: 'Certificate', desc: 'Earn a verified certificate' },
    { icon: Users, label: 'Community', desc: 'Join a global learning community' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A1120] selection:bg-emerald-500/30">
      {/* Subtle Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
          <div className="absolute top-[10%] left-[-5%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 sm:pt-[calc(var(--header-height)+2rem)] pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8"
          >
            <Link 
              to="/courses" 
              className="p-1.5 sm:p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"
            >
              <ArrowLeft size={16} className="text-slate-500 dark:text-slate-400" />
            </Link>
            <span className="px-2.5 sm:px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20">
              {course.industry || 'Course'}
            </span>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr,380px] gap-8 lg:gap-16">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 sm:mb-6 leading-tight tracking-tight"
              >
                {course.title}
              </motion.h1>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 mb-2 sm:mb-0">
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">{course.company || 'One Islam Institute'}</span>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 px-2 border-l border-slate-200 dark:border-slate-700">
                  {course.experience_level || 'All Levels'}
                </span>
                <span className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 px-2 border-l border-slate-200 dark:border-slate-700">
                  <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {course.location || 'Online'}
                </span>
              </div>

              <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                {course.description || 'A comprehensive learning experience designed to deepen your understanding.'}
              </p>
            </div>

            {/* Sidebar / Mobile Action Card */}
            <aside className="lg:block">
              <div className="lg:sticky lg:top-28 space-y-6">
                {/* Intro Course Video Plate layout flawslessly Cinematic Cinematic */}
                {course.preview_video_url && (
                    <div className="rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/5 aspect-video relative group shadow-2xl shadow-emerald-500/10 bg-black">
                        <video 
                            src={course.preview_video_url} 
                            controls 
                            className="w-full h-full object-cover"
                            poster={course.thumbnail_url}
                            playsInline
                            disablePictureInPicture={false}
                            controlsList="nodownload"
                        />
                    </div>
                )}
                
                <div className="bg-white dark:bg-[#0f1429] rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-7 shadow-2xl shadow-emerald-500/5 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-8 -mt-8" />
                                    <div className="mb-8 flex items-end justify-between lg:block relative z-10">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Access Type</p>
                      <div className="flex items-baseline gap-2 flex-wrap">
                        {course.salary_min > 0 ? (
                          <>
                            <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                              ${course.salary_min}{course.salary_max > 0 ? ` – $${course.salary_max}` : '+'}
                            </span>
                            <span className="text-[10px] font-black text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded border border-amber-100 dark:border-amber-500/20 uppercase tracking-widest">
                              Donation
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                              Scholarly Access
                            </span>
                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-500/20 uppercase tracking-widest">
                              Free
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="lg:hidden">
                       <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-500 uppercase tracking-[0.1em]">
                         Active Enrollment
                       </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 relative z-10">
                    <button 
                      onClick={handleEnroll}
                      disabled={isEnrolling}
                      className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 active:scale-95 disabled:opacity-50"
                    >
                      {isEnrolling ? 'Processing...' : (isAlreadyEnrolled ? 'Continue Class' : 'Enroll Now')} {isAlreadyEnrolled && <ArrowRight size={14} />}
                    </button>
                    {isAlreadyEnrolled && progressData && (
                        <div className="w-full pt-2">
                            <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                <span>Mastery Progress</span>
                                <span className="text-emerald-500">{Math.round(progressData.completion_percentage || 0)}%</span>
                            </div>
                            <div className="w-full h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressData.completion_percentage || 0}%` }}
                                    className="h-full bg-emerald-500 rounded-full"
                                />
                            </div>
                        </div>
                    )}
                    <button 
                      onClick={handleSaveCourse}
                      className="w-full py-4 bg-slate-50 dark:bg-white/[0.03] text-slate-500 dark:text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-slate-100 dark:border-white/5 transition-all flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                      {isCourseSaved ? <ShieldCheck size={14} className="text-emerald-500" /> : <Bookmark size={14} />}
                      {isCourseSaved ? 'Saved to Path' : 'Bookmark'}
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Fixed Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 pb-[max(var(--safe-area-bottom,env(safe-area-inset-bottom)),16px)] bg-white/90 dark:bg-[#0A1120]/90 backdrop-blur-2xl border-t border-slate-200 dark:border-white/5 flex items-center gap-3">
        <button 
          onClick={handleEnroll}
          disabled={isEnrolling}
          className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isEnrolling ? 'Loading...' : (isAlreadyEnrolled ? 'Open Classroom' : 'Enroll Now')} {isAlreadyEnrolled && <ArrowRight size={14} />}
        </button>
         <button 
          onClick={handleSaveCourse}
          className="w-[52px] h-[52px] sm:w-14 sm:h-14 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95 transition-all shadow-sm"
        >
          <Bookmark size={20} className={isCourseSaved ? "text-emerald-500" : ""} fill={isCourseSaved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Content Sections */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1fr,380px] gap-12 lg:gap-16">
            <div className="space-y-16">
              {/* Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courseHighlights.map((item, i) => (
                  <div key={i} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <item.icon size={20} className="text-emerald-500 mb-4" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{item.label}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Curriculum Component */}
              <CourseCurriculum courseId={courseId} />

              {/* Outcomes */}
              {outcomes.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">What You'll Learn</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {outcomes.map((outcome, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <CheckCircle size={16} className="text-emerald-500 mt-1 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{typeof outcome === 'string' ? outcome : outcome.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <CourseFAQ />
      <RelatedCourses currentCourseId={courseId} />
      
      <EnrollmentSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        course={course}
        courseId={courseId}
      />
    </div>
  );
};

export default CourseDetail;
