/**
 * Schedule Service
 * Handles class schedule, events, and AI preparation tips
 */

import { supabase } from '../lib/supabase';

export const scheduleService = {
  // Get schedule for current user's enrolled courses
  async getMySchedule(dateRange = {}) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get enrolled course IDs
    const { data: enrollments, error: enrollError } = await supabase
      .from('applications')
      .select('job_id')
      .eq('user_id', user.id);

    if (enrollError) throw enrollError;
    const courseIds = (enrollments || []).map(e => e.job_id);
    if (courseIds.length === 0) return [];

    let query = supabase
      .from('class_schedule')
      .select(`
        *,
        course:jobs(id, title, company),
        student_schedule!left(id, reminder_set, attendance_status, notes)
      `)
      .in('course_id', courseIds)
      .order('start_time', { ascending: true });

    if (dateRange.start) {
      query = query.gte('start_time', dateRange.start);
    }
    if (dateRange.end) {
      query = query.lte('start_time', dateRange.end);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(event => ({
      ...event,
      isRegistered: event.student_schedule?.length > 0,
      myRegistration: event.student_schedule?.[0] || null
    }));
  },

  // Get schedule for a specific week
  async getWeekSchedule(weekStart) {
    const start = new Date(weekStart);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    return this.getMySchedule({
      start: start.toISOString(),
      end: end.toISOString()
    });
  },

  // Get today's schedule
  async getTodaySchedule() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.getMySchedule({
      start: today.toISOString(),
      end: tomorrow.toISOString()
    });
  },

  // Get upcoming events (next 7 days)
  async getUpcoming(limit = 10) {
    const now = new Date().toISOString();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const events = await this.getMySchedule({
      start: now,
      end: nextWeek.toISOString()
    });

    return events.slice(0, limit);
  },

  // Register for a schedule event
  async register(scheduleId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('student_schedule')
      .insert({
        user_id: user.id,
        schedule_id: scheduleId,
        reminder_set: true,
        reminder_minutes_before: 15
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Toggle reminder
  async toggleReminder(registrationId, enabled) {
    const { data, error } = await supabase
      .from('student_schedule')
      .update({ reminder_set: enabled })
      .eq('id', registrationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get schedule stats
  async getStats() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { todayEvents: 0, weekEvents: 0, upcomingAssignments: 0 };

    const today = await this.getTodaySchedule();
    const upcoming = await this.getUpcoming(50);

    const todayEvents = today.length;
    const weekEvents = upcoming.length;
    const upcomingAssignments = upcoming.filter(
      e => e.event_type === 'assignment_due' || e.event_type === 'quiz' || e.event_type === 'exam'
    ).length;
    const liveSessions = upcoming.filter(e => e.event_type === 'live_session').length;

    return {
      todayEvents,
      weekEvents,
      upcomingAssignments,
      liveSessions,
      nextEvent: upcoming[0] || null
    };
  },

  // Generate AI preparation suggestions
  generateAIPrep(event) {
    const typeAdvice = {
      lesson: {
        icon: '📖',
        tips: [
          'Review the previous lesson notes before starting',
          'Prepare 2-3 questions about the topic',
          'Have a notebook ready for key concepts'
        ]
      },
      live_session: {
        icon: '🎥',
        tips: [
          'Test your camera and microphone beforehand',
          'Join 5 minutes early to ensure stable connection',
          'Prepare questions you want to ask the instructor'
        ]
      },
      assignment_due: {
        icon: '📝',
        tips: [
          'Break the assignment into smaller tasks',
          'Start with the most challenging section first',
          'Leave time for review and proofreading'
        ]
      },
      quiz: {
        icon: '✅',
        tips: [
          'Review all module materials and key terms',
          'Practice with flashcards for quick recall',
          'Get a good night\'s sleep before the quiz'
        ]
      },
      exam: {
        icon: '🎓',
        tips: [
          'Create a comprehensive study plan 3-5 days before',
          'Focus on understanding concepts, not memorizing',
          'Take practice exams under timed conditions'
        ]
      },
      office_hours: {
        icon: '💬',
        tips: [
          'List specific questions or concepts you need help with',
          'Bring examples of work you\'re struggling with',
          'Take notes during the session for reference'
        ]
      },
      workshop: {
        icon: '🛠️',
        tips: [
          'Complete any prerequisite materials',
          'Set up your workspace and tools in advance',
          'Come with a project idea to apply what you learn'
        ]
      }
    };

    const advice = typeAdvice[event.event_type] || typeAdvice.lesson;

    return {
      ...advice,
      estimatedPrepTime: event.ai_estimated_prep_time_minutes || 
        (event.event_type === 'exam' ? 120 : event.event_type === 'quiz' ? 45 : 15),
      difficulty: event.ai_difficulty_level || 'intermediate',
      customTip: event.ai_preparation_tips || null
    };
  },

  // Get smart daily summary
  generateDailySummary(todayEvents, upcomingEvents) {
    const now = new Date();
    const hour = now.getHours();

    let greeting = hour < 12 ? '🌅 Good morning' : hour < 17 ? '☀️ Good afternoon' : '🌙 Good evening';

    if (todayEvents.length === 0 && upcomingEvents.length === 0) {
      return {
        greeting,
        message: 'Your schedule is clear today. Perfect time for self-paced study or exploring new courses!',
        priority: 'low',
        actionItems: ['Browse recommended courses', 'Review past lesson notes', 'Practice with quizzes']
      };
    }

    const urgentItems = todayEvents.filter(e =>
      e.event_type === 'exam' || e.event_type === 'assignment_due'
    );

    const liveItems = todayEvents.filter(e => e.event_type === 'live_session');

    let message = `You have ${todayEvents.length} event${todayEvents.length !== 1 ? 's' : ''} today. `;
    const actionItems = [];

    if (urgentItems.length > 0) {
      message += `⚠️ ${urgentItems.length} deadline${urgentItems.length !== 1 ? 's' : ''} to focus on. `;
      urgentItems.forEach(item => {
        actionItems.push(`Complete: ${item.title} by ${new Date(item.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      });
    }

    if (liveItems.length > 0) {
      message += `📺 ${liveItems.length} live session${liveItems.length !== 1 ? 's' : ''} scheduled.`;
      liveItems.forEach(item => {
        actionItems.push(`Join: ${item.title} at ${new Date(item.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      });
    }

    return {
      greeting,
      message: message.trim(),
      priority: urgentItems.length > 0 ? 'high' : liveItems.length > 0 ? 'medium' : 'low',
      actionItems: actionItems.length > 0 ? actionItems : ['Check today\'s lessons', 'Stay on track with your study plan']
    };
  }
};

export default scheduleService;
