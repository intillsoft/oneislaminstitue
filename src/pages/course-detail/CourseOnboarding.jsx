/**
 * CourseOnboarding
 * Multi-step onboarding wizard shown after enrollment.
 * Steps: Welcome → Learning Goals → Study Schedule → Ready to Learn
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { courseService } from '../../services/jobService';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import {
  BookOpen, Target, Calendar, Rocket, ArrowRight, ArrowLeft,
  CheckCircle, Sparkles, Clock, Users, Award, Star, Play,
  Flame, Zap, Coffee
} from 'lucide-react';

const STEPS = [
  { id: 'welcome', label: 'Welcome', icon: Sparkles },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'ready', label: 'Ready', icon: Rocket },
];

const LEARNING_GOALS = [
  { id: 'deepen-knowledge', label: 'Deepen my knowledge', icon: BookOpen, desc: 'Build a stronger foundation in this subject' },
  { id: 'practical-skills', label: 'Gain practical skills', icon: Zap, desc: 'Apply learning to real-world scenarios' },
  { id: 'certification', label: 'Earn a certificate', icon: Award, desc: 'Add a verified credential to my profile' },
  { id: 'career-growth', label: 'Professional development', icon: Star, desc: 'Advance my career or ministry' },
  { id: 'personal-growth', label: 'Personal enrichment', icon: Sparkles, desc: 'Grow personally and spiritually' },
  { id: 'community', label: 'Join a community', icon: Users, desc: 'Connect with fellow learners' },
];

const STUDY_PACES = [
  { id: 'casual', label: 'Casual Learner', icon: Coffee, hours: '2-3', desc: 'A relaxed pace — perfect for busy schedules', color: 'blue' },
  { id: 'regular', label: 'Steady Learner', icon: Flame, hours: '5-7', desc: 'Consistent progress — the sweet spot', color: 'emerald' },
  { id: 'intensive', label: 'Intensive Learner', icon: Rocket, hours: '10+', desc: 'Fast track — complete quickly', color: 'purple' },
];

const CourseOnboarding = () => {
  const { id: courseId } = useParams();
  const { user, profile } = useAuthContext();
  const { error: showError } = useToast();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [selectedPace, setSelectedPace] = useState('regular');
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  useEffect(() => {
    if (courseId) loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const data = await courseService.getById(courseId);
      if (!data) throw new Error('Course not found');
      setCourse(data);
    } catch (err) {
      showError('Could not load course');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const goNext = () => {
    if (currentStep < STEPS.length - 1) {
      setDirection(1);
      setCurrentStep(s => s + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(s => s - 1);
    }
  };

  const toggleGoal = (goalId) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : prev.length < 3
          ? [...prev, goalId]
          : prev
    );
  };

  const handleComplete = () => {
    // Save preferences to localStorage for now
    localStorage.setItem(`onboarding-${courseId}`, JSON.stringify({
      goals: selectedGoals,
      pace: selectedPace,
      completedAt: new Date().toISOString()
    }));
    // Navigate to course lessons
    navigate(`/courses/${courseId}/lessons/1`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0A1120] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-slate-200 dark:border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const userName = profile?.name?.split(' ')[0] || user?.user_metadata?.name?.split(' ')[0] || 'Scholar';

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A1120] selection:bg-emerald-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12 sm:py-16">
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((step, i) => (
              <div key={step.id} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  i <= currentStep
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                }`}>
                  {i < currentStep ? (
                    <CheckCircle size={14} />
                  ) : (
                    <step.icon size={14} />
                  )}
                </div>
                <span className={`hidden sm:block text-xs font-semibold transition-colors ${
                  i <= currentStep ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-600'
                }`}>{step.label}</span>
                {i < STEPS.length - 1 && (
                  <div className={`hidden sm:block w-12 h-0.5 mx-1 rounded-full transition-colors duration-300 ${
                    i < currentStep ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="relative overflow-hidden min-h-[500px]">
          <AnimatePresence mode="wait" custom={direction}>
            {/* STEP 0: Welcome */}
            {currentStep === 0 && (
              <motion.div
                key="welcome"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="space-y-8"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/25"
                  >
                    <Sparkles className="w-9 h-9 text-white" />
                  </motion.div>
                  
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                    Welcome, {userName}! 🎉
                  </h1>
                  <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    You're now enrolled in this course. Let's set up your learning experience.
                  </p>
                </div>

                {/* Course Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center flex-shrink-0 border border-emerald-100 dark:border-emerald-500/20">
                      <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{course?.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{course?.company || 'One Islam Institute'}</p>
                    </div>
                  </div>
                  
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {[
                      { icon: Clock, label: course?.job_type || 'Self-Paced' },
                      { icon: Play, label: course?.experience_level || 'All Levels' },
                      { icon: Award, label: 'Certificate' },
                    ].map((item, i) => (
                      <div key={i} className="text-center py-3 px-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                        <item.icon size={16} className="mx-auto text-emerald-500 mb-1.5" />
                        <p className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What to expect */}
                <div className="bg-emerald-50 dark:bg-emerald-500/5 rounded-2xl border border-emerald-100 dark:border-emerald-500/10 p-5">
                  <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 mb-3">What to Expect</h4>
                  <ul className="space-y-2.5">
                    {[
                      'Set your learning goals and preferred study pace',
                      'Get personalized course recommendations',
                      'Access all course materials immediately after setup',
                    ].map((text, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-emerald-700 dark:text-emerald-300/80">
                        <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* STEP 1: Goals */}
            {currentStep === 1 && (
              <motion.div
                key="goals"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="space-y-6"
              >
                <div className="text-center mb-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                    What are your goals?
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    Select up to 3 goals for this course
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {LEARNING_GOALS.map((goal) => {
                    const isSelected = selectedGoals.includes(goal.id);
                    return (
                      <motion.button
                        key={goal.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleGoal(goal.id)}
                        className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-sm shadow-emerald-500/10'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                          }`}>
                            <goal.icon size={16} />
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${
                              isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'
                            }`}>{goal.label}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{goal.desc}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2"
                          >
                            <CheckCircle size={16} className="text-emerald-500" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {selectedGoals.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-xs text-emerald-600 dark:text-emerald-400 font-medium"
                  >
                    {selectedGoals.length}/3 goals selected
                  </motion.p>
                )}
              </motion.div>
            )}

            {/* STEP 2: Schedule */}
            {currentStep === 2 && (
              <motion.div
                key="schedule"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="space-y-6"
              >
                <div className="text-center mb-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                    Set your study pace
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    Choose a pace that fits your lifestyle — you can change this anytime
                  </p>
                </div>

                <div className="space-y-3">
                  {STUDY_PACES.map((pace) => {
                    const isSelected = selectedPace === pace.id;
                    const colorMap = {
                      blue: { bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-500', text: 'text-blue-700 dark:text-blue-400', iconBg: 'bg-blue-500' },
                      emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-500', text: 'text-emerald-700 dark:text-emerald-400', iconBg: 'bg-emerald-500' },
                      purple: { bg: 'bg-purple-50 dark:bg-purple-500/10', border: 'border-purple-500', text: 'text-purple-700 dark:text-purple-400', iconBg: 'bg-purple-500' },
                    };
                    const c = colorMap[pace.color];

                    return (
                      <motion.button
                        key={pace.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedPace(pace.id)}
                        className={`w-full relative p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                          isSelected
                            ? `${c.border} ${c.bg} shadow-sm`
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected ? `${c.iconBg} text-white` : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                          }`}>
                            <pace.icon size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className={`text-base font-bold ${
                                isSelected ? c.text : 'text-slate-700 dark:text-slate-300'
                              }`}>{pace.label}</p>
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                isSelected 
                                  ? `${c.bg} ${c.text}` 
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                              }`}>
                                {pace.hours} hrs/week
                              </span>
                            </div>
                            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{pace.desc}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3"
                          >
                            <CheckCircle size={18} className={c.text} />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 3: Ready */}
            {currentStep === 3 && (
              <motion.div
                key="ready"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="space-y-6"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/25"
                  >
                    <Rocket className="w-9 h-9 text-white" />
                  </motion.div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                    You're All Set! 🚀
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    Here's a summary of your learning plan
                  </p>
                </div>

                {/* Summary Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  {/* Course */}
                  <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Course</p>
                    <p className="text-base font-bold text-slate-900 dark:text-white">{course?.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{course?.company || 'One Islam Institute'}</p>
                  </div>

                  {/* Goals */}
                  <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Your Goals</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedGoals.length > 0 ? (
                        selectedGoals.map(goalId => {
                          const goal = LEARNING_GOALS.find(g => g.id === goalId);
                          return (
                            <span key={goalId} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-100 dark:border-emerald-500/20">
                              <goal.icon size={12} />
                              {goal.label}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-xs text-slate-400">No specific goals set — that's okay!</span>
                      )}
                    </div>
                  </div>

                  {/* Pace */}
                  <div className="p-5">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Study Pace</p>
                    {(() => {
                      const pace = STUDY_PACES.find(p => p.id === selectedPace);
                      return (
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
                            <pace.icon size={16} className="text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{pace.label}</p>
                            <p className="text-xs text-slate-400">{pace.hours} hours per week</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between gap-4">
          {currentStep > 0 ? (
            <button
              onClick={goBack}
              className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 text-sm"
            >
              <ArrowLeft size={15} />
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={goNext}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/25 active:scale-[0.98] flex items-center gap-2 text-sm group"
            >
              Continue
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/25 active:scale-[0.98] flex items-center gap-2 text-sm group"
            >
              <Play size={15} />
              Start Learning
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseOnboarding;
