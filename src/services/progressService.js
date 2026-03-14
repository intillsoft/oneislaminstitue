/**
 * Study Progress Service
 * A robust version for educational course tracking using the unified schema.
 */
import { supabase } from '../lib/supabase';
import { apiService } from '../lib/api';
import { certificateService } from './certificateService';

const TABLE_PROGRESS = 'study_progress';
const TABLE_LESSON_COMPLETIONS = 'lesson_completions';
const TABLE_QUIZ_RESULTS = 'quiz_results';
const TABLE_COIN_TRANSACTIONS = 'coin_transactions';

import * as triggers from './notificationTriggers';

const isUuid = (value) =>
  typeof value === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

// Detect PostgREST schema-cache / missing-table / missing-column errors
const isSchemaErr = (e) => {
  if (!e) return false;
  const msg = (e.message || '').toLowerCase();
  const code = e.code || '';
  return (
    code === 'PGRST200' || code === '42P01' || code === '42703' ||
    msg.includes('schema cache') ||
    msg.includes('not find the table') ||
    msg.includes('not find the') ||
    msg.includes('could not find')
  );
};

export const progressService = {
  /**
   * Check if a specific module or lesson is locked for the user.
   */
  async getLockStatus(courseId, modules = []) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { lockedModules: {}, lockedLessons: {}, nextAvailable: null };

    // 1. Check user role - Admins and Instructors (recruiters) are exempt
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profile?.role === 'admin' || profile?.role === 'recruiter') {
      return { lockedModules: {}, lockedLessons: {}, nextAvailable: null };
    }

    // 2. Get Enrollment Date
    const { data: enrollment } = await supabase
      .from('applications')
      .select('applied_at')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .maybeSingle();
    
    if (!enrollment) return { lockedModules: {}, lockedLessons: {}, nextAvailable: null };

    // 3. Get Completion Data
    const progress = await this.getByCourse(courseId);
    const completedIds = progress?.completed_lessons || [];

    // 4. Calculate Duration for Weekly Unlocking
    const enrolledDate = new Date(enrollment.applied_at);
    const now = new Date();
    const diffTime = Math.abs(now - enrolledDate);
    const availableWeeks = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000)) + 1;

    const lockedModules = {};
    const lockedLessons = {};
    const allLessons = modules.flatMap(m => m.lessons || []);
    let nextAvailable = allLessons[0]; // Default to first lesson

    // Iterate through modules and lessons to apply locks
    let hasFoundFirstIncomplete = false;

    modules.forEach((mod) => {
      // Rule: Weekly unlocking (e.g. Week 1 -> all mods with unlock_week: 1)
      const moduleWeek = mod.unlock_week || 1;
      const isWeekLocked = moduleWeek > availableWeeks;
      lockedModules[mod.id] = isWeekLocked;

      (mod.lessons || []).forEach((lesson) => {
          const lIndex = allLessons.findIndex(l => l.id === lesson.id);
          
          // Rule: Sequential locking (Lesson N locked if N-1 incomplete)
          let isPrevIncomplete = false;
          if (lIndex > 0) {
              const prevLesson = allLessons[lIndex - 1];
              if (!completedIds.includes(prevLesson.id)) {
                  isPrevIncomplete = true;
              }
          }

          // Rule: Time-Gated integration task
          let isTimeGatedLock = false;
          if (lesson.content_data?.is_time_gated) {
              const requiredDays = moduleWeek * 7;
              const diffDays = Math.floor(diffTime / (24 * 60 * 60 * 1000));
              if (diffDays < requiredDays - 1) {
                  isTimeGatedLock = true;
              }
          }

          const isLocked = isWeekLocked || isPrevIncomplete || isTimeGatedLock;
          lockedLessons[lesson.id] = isLocked;

          if (!hasFoundFirstIncomplete && !completedIds.includes(lesson.id)) {
              nextAvailable = lesson;
              hasFoundFirstIncomplete = true;
          }
      });
    });

    return { 
        lockedModules, 
        lockedLessons, 
        nextAvailable,
        weeksEnrolled: availableWeeks,
        isStudent: true
    };
  },

  /**
   * Get progress for a specific course.
   */
  async getByCourse(courseId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Safe default in case the table is being created / cache is stale
    const safeDefault = {
      user_id: user.id,
      course_id: courseId,
      completed_lessons: [],
      lessons_completed: 0,
      completion_percentage: 0,
      status: 'in_progress',
      last_activity_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from(TABLE_PROGRESS)
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      // Schema-cache miss (404) or any PostgREST schema error → return safe default
      if (error) {
        const isSchemaError = error.code === 'PGRST200' || error.code === '42P01' ||
          (error.message || '').toLowerCase().includes('schema cache') ||
          (error.message || '').toLowerCase().includes('not find the table');
        if (isSchemaError) {
          console.warn('study_progress table not in schema cache yet – run ULTIMATE_PROGRESSION_REPAIR.sql in Supabase.');
          return safeDefault;
        }
        throw error;
      }

      if (!data) return safeDefault;

      return {
        ...data,
        completed_lessons: Array.isArray(data.completed_lessons) ? data.completed_lessons : []
      };
    } catch (err) {
      console.warn('Progress fetch error:', err.message);
      return safeDefault;
    }
  },

  /**
   * Log activity and update lesson completion.
   */
  async logActivity(courseId, minutesStudied = 0, lessonId = null, coinReward = 0, lessonsTotalOverride = null) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    try {
      // 1. Get current state
      const current = await this.getByCourse(courseId);
      
      let totalLessons = (typeof lessonsTotalOverride === 'number' && lessonsTotalOverride > 0)
        ? lessonsTotalOverride
        : (current?.lessons_total || 0);
      if (!totalLessons || totalLessons === 0) {
          const { data: modules } = await supabase.from('course_modules').select('id').eq('course_id', courseId);
          if (modules?.length > 0) {
              const moduleIds = modules.map(m => m.id);
              const { count } = await supabase.from('course_lessons').select('*', { count: 'exact', head: true }).in('module_id', moduleIds);
              totalLessons = count || 10;
          } else {
              totalLessons = 10;
          }
      }
      
      // 2. Log Lesson Completion if provided
      let isNewLessonCompletion = false;
      if (lessonId) {
          // Determine if it already exists in DB to prevent double rewards
          let alreadyCompleted = false;
          try {
            const { data: existingCompletion, error: existingErr } = await supabase
              .from(TABLE_LESSON_COMPLETIONS)
              .select('id')
              .eq('user_id', user.id)
              .eq('lesson_id', lessonId)
              .maybeSingle();

            if (!existingErr && existingCompletion?.id) {
              alreadyCompleted = true;
            }
          } catch (_) { /* table may not exist yet, treat as not completed */ }

          try {
            const { error: compErr } = await supabase
                .from(TABLE_LESSON_COMPLETIONS)
                .upsert({
                    user_id: user.id,
                    course_id: courseId,
                    lesson_id: lessonId,
                    xp_earned: coinReward,
                    completed_at: new Date().toISOString()
                }, { onConflict: 'user_id,lesson_id' });

            if (compErr) {
              // Missing course_id column or schema cache miss — log and skip silently
              const isSchemaError = compErr.code === 'PGRST200' || compErr.code === '42703' ||
                (compErr.message || '').toLowerCase().includes('course_id') ||
                (compErr.message || '').toLowerCase().includes('schema cache');
              if (isSchemaError) {
                console.warn('lesson_completions schema issue – run ULTIMATE_PROGRESSION_REPAIR.sql. Skipping completion log.');
              } else {
                throw compErr;
              }
            }
          } catch (compCatch) {
            const isSchemaError = (compCatch.message || '').toLowerCase().includes('schema cache') ||
              (compCatch.message || '').toLowerCase().includes('course_id') ||
              (compCatch.message || '').toLowerCase().includes('not find');
            if (!isSchemaError) throw compCatch;
            console.warn('lesson_completions upsert skipped due to schema cache miss:', compCatch.message);
          }

          // Only consider new if it didn't already exist in DB
          isNewLessonCompletion = !alreadyCompleted;
      }

      // 3. Calculate new state
      let newCompleted = [...(current?.completed_lessons || [])];
      if (lessonId && !newCompleted.includes(lessonId)) {
        newCompleted.push(lessonId);
      }

      const newPercentage = Math.min(100, Math.round((newCompleted.length / totalLessons) * 100));
      const newStatus = (newPercentage === 100 || (totalLessons > 0 && newCompleted.length >= totalLessons)) ? 'completed' : 'in_progress';

      const updatePayload = {
        user_id: user.id,
        course_id: courseId,
        completed_lessons: newCompleted,
        lessons_completed: newCompleted.length,
        lessons_total: totalLessons,
        completion_percentage: newPercentage,
        status: newStatus,
        last_activity_at: new Date().toISOString()
      };

      // 4. Update Study Progress
      let data = null;
      try {
        const { data: upsertData, error } = await supabase
          .from(TABLE_PROGRESS)
          .upsert(updatePayload, { onConflict: 'user_id,course_id' })
          .select()
          .single();

        if (error) {
          if (isSchemaErr(error)) {
            console.warn('study_progress table missing from schema cache – run ULTIMATE_PROGRESSION_REPAIR.sql in Supabase SQL Editor.');
            return updatePayload; // return optimistic data so UI stays functional
          }
          throw error;
        }
        data = upsertData;
      } catch (upsertErr) {
        if (isSchemaErr(upsertErr)) {
          console.warn('study_progress schema cache miss (upsert):', upsertErr.message);
          return updatePayload;
        }
        throw upsertErr;
      }

      // 5. Update Study Streak record
      try {
        const today = new Date().toISOString().split('T')[0];
        const { error: streakErr } = await supabase.from('study_streaks').upsert({
            user_id: user.id,
            study_date: today,
            minutes_studied: (minutesStudied || 0),
            lessons_completed: isNewLessonCompletion ? 1 : 0
        }, { onConflict: 'user_id,study_date' });
        if (streakErr && isSchemaErr(streakErr)) {
          console.warn('study_streaks table missing from schema cache.');
        } else if (streakErr) {
          console.warn('Streak upsert error:', streakErr.message);
        }
      } catch (_) { /* non-critical, skip */ }

      // 6. Awards & Notifications
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, first_name')
          .eq('id', user.id)
          .single();
        
        const userName = profile?.name || profile?.first_name || 'Student';
        const { data: course } = await supabase.from('jobs').select('title').eq('id', courseId).single();
        const courseName = course?.title || 'the course';

        // Milestone 1: Lesson Completion
        if (isNewLessonCompletion && lessonId) {
          const { data: lesson } = await supabase.from('course_lessons').select('title, module_id').eq('id', lessonId).single();
          if (lesson) {
            await triggers.sendLessonMilestoneNotification(user.id, userName, lesson.title, courseName);
            
            // Check for Module Completion
            if (lesson.module_id) {
              const { data: moduleLessons } = await supabase.from('course_lessons').select('id').eq('module_id', lesson.module_id);
              const { data: moduleData } = await supabase.from('course_modules').select('title').eq('id', lesson.module_id).single();
              
              const allLessonsInModule = moduleLessons?.map(l => l.id) || [];
              const completedInModule = allLessonsInModule.every(id => newCompleted.includes(id));
              
              if (completedInModule && moduleData) {
                await triggers.sendModuleCompletionNotification(user.id, userName, moduleData.title, courseName, courseId);
              }
            }
          }
        }

        // Milestone 2: Progress Percentages
        if (newPercentage === 50 && current?.completion_percentage < 50) {
          await triggers.sendProgressUpdateNotification(user.id, userName, courseName, courseId, 50);
        } else if (newPercentage === 75 && current?.completion_percentage < 75) {
          await triggers.sendProgressUpdateNotification(user.id, userName, courseName, courseId, 75);
        }

        // Milestone 3: Course Completion
        if (isNewLessonCompletion && newStatus === 'completed' && current?.status !== 'completed') {
            await certificateService.generate(courseId);
            await triggers.sendCourseCompletionNotification(user.id, userName, courseName, courseId);
        }

        if (isNewLessonCompletion && coinReward > 0) {
          await this.handleCoinReward(user.id, coinReward, 'lesson_completion', lessonId);
        }
      } catch (notifErr) {
        console.warn('Automation trigger error:', notifErr.message);
      }

      return data || updatePayload;
    } catch (err) {
      if (isSchemaErr(err)) {
        console.warn('Progress logging skipped – schema not ready. Run ULTIMATE_PROGRESSION_REPAIR.sql.');
        return null;
      }
      console.warn('Progress logging error:', err.message);
      return null;
    }
  },

  /**
   * Log quiz result to the database.
   */
  async logQuizResult(courseId, lessonId, quizId, score, totalQuestions) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from(TABLE_QUIZ_RESULTS)
        .upsert({
            user_id: user.id,
            course_id: courseId,
            lesson_id: lessonId,
            quiz_id: quizId?.toString(),
            score,
            total_questions: totalQuestions,
            // Tight rule: only "passed" if perfect.
            passed: score === totalQuestions,
            completed_at: new Date().toISOString()
        }, { onConflict: 'user_id,lesson_id,quiz_id' })
        .select()
        .single();

      if (error) throw error;
      
      // Award extra coins for perfect quiz if not already rewarded
      if (score === totalQuestions) {
          const rewardKey = `${lessonId}:${quizId}`;
          await this.handleCoinReward(
            user.id,
            5,
            'quiz_perfect',
            null,
            `Earned 5 coins for quiz perfection (${rewardKey})`
          );
      }

      return data;
    } catch (err) {
      console.warn('Quiz logging error:', err.message);
      return null;
    }
  },

  async handleCoinReward(userId, amount, type, referenceId, descriptionOverride = null) {
    try {
      const referenceUuid = isUuid(referenceId) ? referenceId : null;
      const description = descriptionOverride || `Earned ${amount} coins for ${type.replace('_', ' ')}${referenceId ? ` (${referenceId})` : ''}`;

      // Idempotency: avoid duplicating rewards for same (type, reference)
      try {
        let existingQuery = supabase
          .from(TABLE_COIN_TRANSACTIONS)
          .select('id')
          .eq('user_id', userId)
          .eq('type', type)
          .limit(1);

        if (referenceUuid) {
          existingQuery = existingQuery.eq('reference_id', referenceUuid);
        } else {
          existingQuery = existingQuery.eq('description', description);
        }

        const { data: existingRows, error: existingTxErr } = await existingQuery;
        if (!existingTxErr && Array.isArray(existingRows) && existingRows.length > 0) {
          return;
        }
      } catch (e) {
        // If the idempotency check fails (e.g. schema mismatch), still attempt to insert.
      }

      // 1. Log transaction
      await supabase.from(TABLE_COIN_TRANSACTIONS).insert({
        user_id: userId,
        amount,
        type,
        description,
        reference_id: referenceUuid
      });

      // Note: Trigger in DB will update users.coins balance

      await apiService.notifications.create({
        title: 'One Coins Earned! 🪙',
        message: `MashaAllah! You've earned ${amount} One Coins.`,
        type: 'REWARD'
      });
    } catch (e) {
      console.warn('Reward handling failed:', e.message);
    }
  },

  async getAll() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from(TABLE_PROGRESS)
        .select(`
          *,
          course:jobs(id, title, thumbnail_url, company)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('Error fetching all progress:', err.message);
      return [];
    }
  },

  async getStats() {
    const allProgress = await this.getAll();
    
    const inProgressCourses = allProgress.filter(p => p.status === 'in_progress').length;
    const completedCourses = allProgress.filter(p => p.status === 'completed').length;
    const totalLessons = allProgress.reduce((sum, p) => sum + (p.lessons_completed || 0), 0);
    const avgCompletion = allProgress.length > 0
      ? allProgress.reduce((sum, p) => sum + (p.completion_percentage || 0), 0) / allProgress.length
      : 0;

    // Derive total active study time from streak records so the
    // StudyProgress dashboard can show real "Total Hours" instead
    // of a hard-coded zero.
    let totalTimeMinutes = 0;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: streakRows, error } = await supabase
          .from('study_streaks')
          .select('minutes_studied')
          .eq('user_id', user.id);

        if (!error && Array.isArray(streakRows)) {
          totalTimeMinutes = streakRows.reduce(
            (sum, row) => sum + (row.minutes_studied || 0),
            0
          );
        }
      }
    } catch (e) {
      console.warn('Failed to aggregate study time for stats:', e.message);
    }

    return {
      progress: allProgress,
      totalCourses: allProgress.length,
      completedCourses,
      inProgressCourses,
      avgCompletion,
      totalLessons,
      totalTimeMinutes
    };
  },

  /**
   * Lightweight, deterministic "AI-style" insights based purely on
   * the user's real progress data. This avoids runtime errors in the
   * StudyProgressTracker while keeping the UI dynamic.
   */
  async generateAIInsights(statsInput) {
    const stats = statsInput || await this.getStats();
    const insights = [];

    const completion = Math.round(stats?.avgCompletion || 0);
    const totalCourses = stats?.totalCourses || 0;
    const completedCourses = stats?.completedCourses || 0;
    const totalLessons = stats?.totalLessons || 0;
    const totalTimeMinutes = stats?.totalTimeMinutes || 0;

    // Pace / consistency insight
    if (totalLessons === 0) {
      insights.push({
        icon: '📘',
        title: 'Begin Your Journey',
        message: 'You have not completed any lessons yet. Start your first lesson today to begin building momentum.'
      });
    } else if (totalLessons < 5) {
      insights.push({
        icon: '🌱',
        title: 'Strong Start',
        message: 'You have started your learning journey. Try to complete at least one short lesson every day to build a consistent habit.'
      });
    } else {
      insights.push({
        icon: '🔥',
        title: 'Growing Streak',
        message: 'You are completing lessons regularly. Consider scheduling dedicated study blocks to maintain and grow this streak.'
      });
    }

    // Completion quality insight
    if (completion === 100 && completedCourses > 0) {
      insights.push({
        icon: '🏁',
        title: 'Course Finisher',
        message: `You have fully completed ${completedCourses} course${completedCourses > 1 ? 's' : ''}. This is an excellent sign of deep commitment—try enrolling in a new course to keep advancing.`
      });
    } else if (completion >= 50) {
      insights.push({
        icon: '📈',
        title: 'Past the Halfway Mark',
        message: 'Your average completion rate is above 50%. Focus on finishing one in-progress course before spreading your attention across many.'
      });
    } else if (completion > 0) {
      insights.push({
        icon: '🧭',
        title: 'Many Starts, Few Finishes',
        message: 'You have begun several lessons, but your average completion rate is still low. Pick a single course and commit to completing its next few lessons.'
      });
    }

    // Time-on-task insight
    if (totalTimeMinutes > 0) {
      const hours = Math.round((totalTimeMinutes / 60) * 10) / 10;
      insights.push({
        icon: '⏱️',
        title: 'Time Invested',
        message: `You have invested about ${hours} hour${hours !== 1 ? 's' : ''} of focused study time. Protect this progress by setting a small weekly goal you can reliably hit.`
      });
    }

    // Always return at least one message so the UI never looks empty
    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        title: 'Ready When You Are',
        message: 'Your dashboard is connected to live progress data. As soon as you start learning, this panel will adapt with tailored guidance.'
      });
    }

    return insights;
  },

  async getStreakData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { currentStreak: 0, longestStreak: 0, weekData: [] };

    try {
      const { data: streakRecords, error } = await supabase
        .from('study_streaks')
        .select('*')
        .eq('user_id', user.id)
        .order('study_date', { ascending: false })
        .limit(30);

      if (error) throw error;

      // Calculate current streak
      let currentStreak = 0;
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      if (streakRecords?.[0]?.study_date === today || streakRecords?.[0]?.study_date === yesterday) {
          currentStreak = streakRecords.length; 
      }

      // Generate week data
      const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
      const weekData = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        const dateStr = d.toISOString().split('T')[0];
        const record = streakRecords?.find(r => r.study_date === dateStr);
        
        weekData.push({
          day: days[d.getDay()],
          date: dateStr,
          active: !!record,
          minutes: record?.minutes_studied || 0
        });
      }

      return {
        currentStreak,
        longestStreak: currentStreak,
        weekData
      };
    } catch (err) {
      console.error('Streak fetch error:', err);
      return { currentStreak: 0, longestStreak: 0, weekData: [] };
    }
  }
};

export default progressService;
