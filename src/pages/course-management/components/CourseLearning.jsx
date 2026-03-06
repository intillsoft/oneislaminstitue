import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ChevronRight, CheckCircle2, Circle, Lock, Play,
  Bookmark, Share2, MessageCircle, ThumbsUp, Clock, BarChart3,
  BookOpen, ArrowLeft, Volume2, Settings, Maximize2, Download
} from 'lucide-react';
import { courseService } from '../../../services/courseService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import './CourseLearning.css';

// Helper function to get YouTube embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) {
    console.warn('[COURSE LEARNING VIDEO DEBUG] Empty URL provided');
    return '';
  }
  
  try {
    console.log('[COURSE LEARNING VIDEO DEBUG] Input URL:', url);
    let inputUrl = url;
    
    // If the input is HTML iframe code, extract the src URL
    if (inputUrl.includes('<iframe') && inputUrl.includes('src=')) {
      const srcMatch = inputUrl.match(/src=["']([^"']+)["']/);
      if (srcMatch && srcMatch[1]) {
        inputUrl = srcMatch[1];
        console.log('[COURSE LEARNING VIDEO DEBUG] Extracted src from iframe HTML:', inputUrl);
      }
    }
    
    let videoId = '';
    let embedUrl = '';
    
    if (inputUrl.includes('youtu.be/')) {
      videoId = inputUrl.split('youtu.be/')[1].split('?')[0].split('&')[0].trim();
      console.log('[COURSE LEARNING VIDEO DEBUG] youtu.be format, videoId:', videoId);
    } else if (inputUrl.includes('youtube.com') && inputUrl.includes('v=')) {
      const match = inputUrl.match(/[?&]v=([^&]+)/);
      if (match) {
        videoId = match[1].trim();
        console.log('[COURSE LEARNING VIDEO DEBUG] youtube.com?v= format, videoId:', videoId);
      }
    } else if (inputUrl.includes('/embed/')) {
      videoId = inputUrl.split('/embed/')[1].split('?')[0].trim();
      console.log('[COURSE LEARNING VIDEO DEBUG] /embed/ format, videoId:', videoId);
    } else if (inputUrl.includes('/shorts/')) {
      videoId = inputUrl.split('/shorts/')[1].split('?')[0].trim();
      console.log('[COURSE LEARNING VIDEO DEBUG] /shorts/ format, videoId:', videoId);
    } else if (inputUrl.includes('youtube.com')) {
      videoId = inputUrl.split('/').pop().split('?')[0].trim();
      console.log('[COURSE LEARNING VIDEO DEBUG] youtube.com fallback, videoId:', videoId);
    } else {
      // Assume it's just the video ID
      videoId = inputUrl.split('?')[0].trim();
      console.log('[COURSE LEARNING VIDEO DEBUG] Assuming raw videoId:', videoId);
    }
    
    if (videoId && videoId.length > 0 && videoId !== 'II?rel' && videoId !== 'II') {
      embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&origin=${typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''}`;
      console.log('[COURSE LEARNING VIDEO DEBUG] Generated embed URL:', embedUrl);
      return embedUrl;
    }
    
    console.warn('[COURSE LEARNING VIDEO DEBUG] Could not parse videoId, returning original');
    return url;
  } catch (e) {
    console.error('[COURSE LEARNING VIDEO DEBUG] Error:', e, 'Original URL:', url);
    return url;
  }
};

/**
 * Progress Bar Component
 */
const ProgressBar = ({ completed, total }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Progress
        </span>
        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
          {completed}/{total}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {Math.round(percentage)}% Complete
      </p>
    </div>
  );
};

/**
 * Module Item Component
 */
const ModuleItem = ({
  module,
  lessons,
  isExpanded,
  onToggle,
  selectedLesson,
  onSelectLesson,
  completedLessons,
  currentUserId,
}) => {
  const completedCount = lessons.filter((l) =>
    completedLessons.some((cl) => cl.lesson_id === l.id && cl.completed)
  ).length;

  return (
    <div className="border-b border-gray-200 dark:border-slate-700 last:border-b-0">
      {/* Module Header */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors text-left group"
      >
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
        </motion.div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {module.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {completedCount} of {lessons.length} lessons completed
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {completedCount}/{lessons.length}
          </span>
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {Math.round((completedCount / lessons.length) * 100) || 0}%
            </span>
          </div>
        </div>
      </button>

      {/* Lessons List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-50 dark:bg-slate-800/30 border-t border-gray-100 dark:border-slate-700/50"
          >
            {lessons.map((lesson, index) => {
              const isCompleted = completedLessons.some(
                (cl) => cl.lesson_id === lesson.id && cl.completed
              );
              const isSelected = selectedLesson?.id === lesson.id;

              return (
                <button
                  key={lesson.id}
                  onClick={() => onSelectLesson(lesson)}
                  className={`w-full px-8 py-2.5 flex items-center gap-3 text-left transition-colors group ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-600'
                      : 'border-l-2 border-transparent hover:bg-gray-100 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        isSelected
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Lesson {index + 1}: {lesson.title}
                    </p>
                  </div>

                  {lesson.duration_minutes && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      {lesson.duration_minutes}m
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Content Block Renderer
 */
const ContentBlockRenderer = ({ block }) => {
  switch (block.type) {
    case 'text':
      return (
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div className="whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-200">
            {block.data.text}
          </div>
        </div>
      );

    case 'image':
      return (
        <figure className="my-6">
          <img
            src={block.data.url}
            alt={block.data.caption || 'Lesson image'}
            className="w-full rounded-lg shadow-md"
          />
          {block.data.caption && (
            <figcaption className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center italic">
              {block.data.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'video':
      return (
        <div className="my-6 relative pt-[56.25%] bg-black rounded-lg overflow-hidden shadow-lg">
          {block.data.source === 'youtube' ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={getYouTubeEmbedUrl(block.data.url)}
              title="Lesson video"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : block.data.source === 'vimeo' ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://player.vimeo.com/video/${block.data.url}`}
              title="Lesson video"
              allowFullScreen
              allow="autoplay"
            />
          ) : (
            <video
              className="absolute inset-0 w-full h-full"
              controls
              src={block.data.url}
            />
          )}
        </div>
      );

    case 'infographic':
      return (
        <div className="my-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
          <img
            src={block.data.url}
            alt="Infographic"
            className="w-full rounded-lg"
          />
        </div>
      );

    default:
      return null;
  }
};

/**
 * Lesson Navigation Component
 */
const LessonNavigation = ({
  currentLesson,
  allLessons,
  onPrevious,
  onNext,
  isFirstLesson,
  isLastLesson,
}) => {
  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson?.id);

  return (
    <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
      <button
        onClick={onPrevious}
        disabled={isFirstLesson}
        className="px-4 py-2 flex items-center gap-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronDown className="w-4 h-4 rotate-90" />
        Previous
      </button>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Lesson {currentIndex + 1} of {allLessons.length}
        </p>
      </div>

      <button
        onClick={onNext}
        disabled={isLastLesson}
        className="px-4 py-2 flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

/**
 * Main Course Learning Component
 */
export default function CourseLearning({ courseId, modulesData, lessonsData }) {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();

  const [modules, setModules] = useState(modulesData || []);
  const [expandedModules, setExpandedModules] = useState(new Set());
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [courseProgress, setCourseProgress] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCourseData();
    }
  }, [user, courseId]);

  const loadCourseData = async () => {
    try {
      setLoading(true);

      // Load modules if not provided
      if (!modulesData) {
        const modulesResult = await courseService.getModules(courseId);
        if (modulesResult.success) {
          setModules(modulesResult.data);
        }
      }

      // Load progress
      const progressResult = await courseService.getCourseProgress(
        user.id,
        courseId
      );
      if (progressResult.success) {
        setCourseProgress(progressResult.data);
      } else {
        // Initialize progress if first time
        const initResult = await courseService.initializeCourseProgress(
          user.id,
          courseId
        );
        if (initResult.success) {
          setCourseProgress(initResult.data);
        }
      }

      // Set first lesson as selected
      if (!selectedLesson && modules.length > 0) {
        const firstModule = modules[0];
        const lessonsResult = await courseService.getLessons(firstModule.id);
        if (lessonsResult.success && lessonsResult.data.length > 0) {
          setSelectedLesson(lessonsResult.data[0]);
          setExpandedModules(new Set([firstModule.id]));

          // Load first lesson progress
          loadLessonProgress(lessonsResult.data[0]);
        }
      }
    } catch (error) {
      showError('Error loading course: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadLessonProgress = async (lesson) => {
    try {
      const result = await courseService.getLessonProgress(user.id, lesson.id);
      if (result.success && result.data) {
        setCompletedLessons((prev) => [...prev, result.data]);
      }
    } catch (error) {
      console.error('Error loading lesson progress:', error);
    }
  };

  const handleToggleModule = (moduleId) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleSelectLesson = async (lesson) => {
    setSelectedLesson(lesson);
    await loadLessonProgress(lesson);
  };

  const handleMarkLessonComplete = async () => {
    try {
      const result = await courseService.markLessonComplete(
        user.id,
        selectedLesson.id
      );
      if (result.success) {
        setCompletedLessons((prev) => [result.data, ...prev]);
        success('Lesson marked as complete!');
      } else {
        showError('Failed to mark lesson complete');
      }
    } catch (error) {
      showError('Error: ' + error.message);
    }
  };

  const handlePreviousLesson = async () => {
    const allLessons = await getAllLessonsInOrder();
    const currentIndex = allLessons.findIndex((l) => l.id === selectedLesson.id);
    if (currentIndex > 0) {
      await handleSelectLesson(allLessons[currentIndex - 1]);
    }
  };

  const handleNextLesson = async () => {
    const allLessons = await getAllLessonsInOrder();
    const currentIndex = allLessons.findIndex((l) => l.id === selectedLesson.id);
    if (currentIndex < allLessons.length - 1) {
      await handleSelectLesson(allLessons[currentIndex + 1]);
    }
  };

  const getAllLessonsInOrder = async () => {
    const allLessons = [];
    for (const module of modules) {
      const result = await courseService.getLessons(module.id);
      if (result.success) {
        allLessons.push(...result.data);
      }
    }
    return allLessons;
  };

  const allLessons = [];
  const getProgressStats = () => {
    if (!courseProgress) return { completed: 0, total: 0 };
    return {
      completed: courseProgress.completed_lessons || 0,
      total: courseProgress.total_lessons || 0,
    };
  };

  const progressStats = getProgressStats();
  const allLessonsFlat = [];

  return (
    <div className="flex flex-col lg:flex-row gap-6 bg-gray-50 dark:bg-slate-900 min-h-screen p-4">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ marginLeft: sidebarOpen ? 0 : -400 }}
        className="lg:static fixed left-0 top-0 z-40 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 overflow-y-auto max-h-screen lg:max-h-none"
      >
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Course Content
          </h2>
        </div>

        <div className="p-4 space-y-4">
          <ProgressBar {...progressStats} />

          <div className="space-y-1">
            {modules.map((module) => (
              <ModuleItem
                key={module.id}
                module={module}
                lessons={lessonsData?.filter((l) => l.module_id === module.id) || []}
                isExpanded={expandedModules.has(module.id)}
                onToggle={() => handleToggleModule(module.id)}
                selectedLesson={selectedLesson}
                onSelectLesson={handleSelectLesson}
                completedLessons={completedLessons}
                currentUserId={user?.id}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1">
        {selectedLesson ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{selectedLesson.title}</h1>
                  <p className="text-blue-100">{selectedLesson.description}</p>
                </div>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 hover:bg-blue-500/50 rounded-lg transition-colors"
                >
                  <BookOpen className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {selectedLesson.duration_minutes && (
                  <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4" />
                    {selectedLesson.duration_minutes} minutes
                  </div>
                )}
                <button className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors flex items-center gap-1">
                  <Bookmark className="w-4 h-4" />
                  Save
                </button>
                <button className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors flex items-center gap-1">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 max-w-4xl mx-auto">
              {selectedLesson.content_blocks && selectedLesson.content_blocks.length > 0 ? (
                <div className="space-y-8">
                  {selectedLesson.content_blocks.map((block) => (
                    <ContentBlockRenderer key={block.id} block={block} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    No content for this lesson yet.
                  </p>
                </div>
              )}

              {/* Lesson Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700 space-y-4">
                <button
                  onClick={handleMarkLessonComplete}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Mark as Complete
                </button>

                {/* Navigation */}
                <LessonNavigation
                  currentLesson={selectedLesson}
                  allLessons={allLessonsFlat}
                  onPrevious={handlePreviousLesson}
                  onNext={handleNextLesson}
                  isFirstLesson={false}
                  isLastLesson={false}
                />
              </div>

              {/* Lesson Resources */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Lesson Resources
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button className="p-3 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Download className="w-4 h-4" />
                    Download Notes
                  </button>
                  <button className="p-3 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <MessageCircle className="w-4 h-4" />
                    Discussion
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 p-12 text-center">
            <Play className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Select a lesson to begin
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
