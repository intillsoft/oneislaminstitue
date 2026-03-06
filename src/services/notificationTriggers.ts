/**
 * Notification Triggers
 * Automatic notification sending for enrollment, registration, etc.
 */

import { notificationService } from './notificationService';

/**
 * Send welcome notification when user enrolls in a course
 */
export const sendEnrollmentWelcomeNotification = async (
  userId: string,
  userName: string,
  courseName: string,
  courseId: string,
  instructorId?: string
) => {
  try {
    await notificationService.sendNotification({
      userId,
      senderId: instructorId || 'system',
      title: `Welcome to ${courseName}, ${userName}!`,
      message: `MashaAllah ${userName}, you have successfully enrolled in ${courseName}. We are excited to have you on this journey. Click to start your first lesson!`,
      type: 'welcome',
      data: {
        courseId,
        action: 'view-course',
      },
      sendEmail: true,
    });

    console.log(`[NOTIFICATION] Enrollment welcome sent to ${userName} (${userId})`);
  } catch (error) {
    console.error('[ERROR] Failed to send enrollment welcome notification:', error);
  }
};

/**
 * Send welcome notification to new registered users
 */
export const sendRegistrationWelcomeNotification = async (
  userId: string,
  userEmail: string,
  userName: string
) => {
  try {
    await notificationService.sendNotification({
      userId,
      senderId: 'system',
      title: `Welcome to One Islam, ${userName}!`,
      message: `Salam ${userName}! Welcome aboard. Explore our elite curriculum and start your path of knowledge today.`,
      type: 'welcome',
      data: {
        action: 'browse-courses',
      },
      sendEmail: true,
    });

    console.log(`[NOTIFICATION] Registration welcome sent to ${userEmail}`);
  } catch (error) {
    console.error('[ERROR] Failed to send registration welcome notification:', error);
  }
};

/**
 * Send module/week completion notification
 */
export const sendModuleCompletionNotification = async (
  userId: string,
  userName: string,
  moduleName: string,
  courseName: string,
  courseId: string,
  instructorId?: string
) => {
  try {
    await notificationService.sendNotification({
      userId,
      senderId: instructorId || 'system',
      title: `Excellent work on ${moduleName}!`,
      message: `BarakAllahu Feek ${userName}! You've completed ${moduleName} in ${courseName}. You are making great progress!`,
      type: 'announcement',
      data: {
        courseId,
        moduleName,
        action: 'continue-course',
      },
      sendEmail: true,
    });

    console.log(`[NOTIFICATION] Module completion sent for ${moduleName} to ${userName}`);
  } catch (error) {
    console.error('[ERROR] Failed to send module completion notification:', error);
  }
};

/**
 * Send course completion notification
 */
export const sendCourseCompletionNotification = async (
  userId: string,
  userName: string,
  courseName: string,
  courseId: string,
  instructorId?: string
) => {
  try {
    await notificationService.sendNotification({
      userId,
      senderId: instructorId || 'system',
      title: `Congratulations on Graduating ${courseName}!`,
      message: `Excellent achievement, ${userName}! You have successfully completed the entire ${courseName} course. Your dedication to learning is inspiring. View your certificate now!`,
      type: 'welcome',
      data: {
        courseId,
        action: 'view-certificate',
      },
      sendEmail: true,
    });

    console.log(`[NOTIFICATION] Course graduation sent to ${userName}`);
  } catch (error) {
    console.error('[ERROR] Failed to send course completion notification:', error);
  }
};

/**
 * Send progress update notification
 */
export const sendProgressUpdateNotification = async (
  userId: string,
  userName: string,
  courseName: string,
  courseId: string,
  progressPercentage: number,
  instructorId?: string
) => {
  try {
    let message = '';
    let title = `Progress Update: ${courseName}`;

    if (progressPercentage === 50) {
      title = `Halfway there, ${userName}! 📈`;
      message = `Salam ${userName}, you've reached 50% in ${courseName}! You're doing amazing, keep that momentum going!`;
    } else if (progressPercentage === 75) {
      title = `Almost Finished, ${userName}! 🏁`;
      message = `Salam ${userName}, you're at 75% in ${courseName}! Just a few more steps to completion. We believe in you!`;
    } else {
      message = `Hi ${userName}, your current progress in ${courseName} is at ${progressPercentage}%.`;
    }

    await notificationService.sendNotification({
      userId,
      senderId: instructorId || 'system',
      title,
      message,
      type: 'announcement',
      data: {
        courseId,
        progressPercentage,
        action: 'continue-course',
      },
      sendEmail: progressPercentage >= 50,
    });

    console.log(`[NOTIFICATION] Progress milestone (${progressPercentage}%) sent to ${userName}`);
  } catch (error) {
    console.error('[ERROR] Failed to send progress update notification:', error);
  }
};

/**
 * Send lesson milestone (achievement) notification
 */
export const sendLessonMilestoneNotification = async (
  userId: string,
  userName: string,
  lessonTitle: string,
  courseName: string
) => {
  try {
    await notificationService.sendNotification({
      userId,
      senderId: 'system',
      title: `Lesson Complete: ${lessonTitle} 🏆`,
      message: `Wonderful job ${userName}! You've successfully finished "${lessonTitle}". Every step counts towards mastery!`,
      type: 'announcement',
      sendEmail: false, // Don't spam email for every single lesson, but keep it in-app
    });
  } catch (error) {
    console.error('[ERROR] Failed to send lesson milestone notification:', error);
  }
};
