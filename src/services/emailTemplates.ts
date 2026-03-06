/**
 * Email Templates for Notifications
 * HTML email templates used by notificationService for Resend
 */

/**
 * Generate enrollment welcome email
 */
export const generateEnrollmentWelcomeEmail = (
  userName: string,
  courseName: string,
  courseUrl?: string
): string => {
  const baseUrl = courseUrl || 'https://yourplatform.com';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 8px 8px 0 0; color: white; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome! 🎉</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Great news! You've successfully enrolled in <strong>${courseName}</strong>.</p>
            <p>You're all set to start learning. Access your course and begin your learning journey today!</p>
            <center>
              <a href="${baseUrl}" class="button">Start Learning</a>
            </center>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Happy learning!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Your Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

/**
 * Generate registration welcome email
 */
export const generateRegistrationWelcomeEmail = (
  userName: string,
  exploreUrl?: string
): string => {
  const baseUrl = exploreUrl || 'https://yourplatform.com';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 8px 8px 0 0; color: white; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin: 20px 0; }
          .feature { margin: 15px 0; padding: 15px; background: white; border-left: 4px solid #667eea; border-radius: 4px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome! 👋</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Welcome to our learning platform! We're thrilled to have you on board.</p>
            
            <p><strong>Here's what you can do:</strong></p>
            <div class="feature">
              📚 Explore our comprehensive course catalog
            </div>
            <div class="feature">
              🎯 Enroll in courses that interest you
            </div>
            <div class="feature">
              📈 Track your progress and earn certificates
            </div>
            <div class="feature">
              🤝 Connect with instructors and fellow learners
            </div>
            
            <p>Ready to get started?</p>
            <center>
              <a href="${baseUrl}" class="button">Explore Courses</a>
            </center>
            
            <p>If you have any questions or need help, don't hesitate to contact us.</p>
            <p>Best regards,<br>The Learning Platform Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Your Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

/**
 * Generate course completion email
 */
export const generateCourseCompletionEmail = (
  userName: string,
  courseName: string,
  certificateUrl?: string
): string => {
  const baseUrl = certificateUrl || 'https://yourplatform.com';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 8px 8px 0 0; color: white; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin: 20px 0; }
          .achievement { text-align: center; padding: 20px; background: #f0fdf4; border: 2px solid #10b981; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Congratulations! 🎓</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Congratulations on completing <strong>${courseName}</strong>! You did it! 🌟</p>
            
            <div class="achievement">
              <h2>🏆 Course Completed!</h2>
              <p>You've successfully completed all lessons and requirements.</p>
            </div>
            
            <p>Your certificate of completion is now available. You can view and download it anytime from your dashboard.</p>
            
            <center>
              <a href="${baseUrl}" class="button">View Certificate</a>
            </center>
            
            <p><strong>What's next?</strong></p>
            <ul>
              <li>Share your certificate on social media</li>
              <li>Explore other courses to expand your skills</li>
              <li>Help other learners in the community</li>
            </ul>
            
            <p>Thank you for learning with us!</p>
            <p>Keep learning,<br>The Learning Platform Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Your Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

/**
 * Generate lesson availability email
 */
export const generateLessonAvailableEmail = (
  userName: string,
  lessonTitle: string,
  courseName: string,
  lessonUrl?: string
): string => {
  const baseUrl = lessonUrl || 'https://yourplatform.com';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; border-radius: 8px 8px 0 0; color: white; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin: 20px 0; }
          .lesson-card { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 15px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Lesson Released! 📚</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Great news! A new lesson is now available in <strong>${courseName}</strong>.</p>
            
            <div class="lesson-card">
              <strong>📖 ${lessonTitle}</strong>
              <p style="margin-top: 10px; color: #666;">Start learning this new content and continue your journey!</p>
            </div>
            
            <p>Don't miss out! Check out the new lesson and keep up with your learning progress.</p>
            
            <center>
              <a href="${baseUrl}" class="button">View Lesson</a>
            </center>
            
            <p>Happy learning!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Your Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

/**
 * Generate assignment reminder email
 */
export const generateAssignmentReminderEmail = (
  userName: string,
  assignmentTitle: string,
  courseName: string,
  dueDate: string,
  assignmentUrl?: string
): string => {
  const baseUrl = assignmentUrl || 'https://yourplatform.com';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; border-radius: 8px 8px 0 0; color: white; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin: 20px 0; }
          .deadline { background: #fef2f2; border: 2px solid #fecaca; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Assignment Reminder ⏰</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>This is a friendly reminder about your upcoming assignment in <strong>${courseName}</strong>.</p>
            
            <div class="deadline">
              <strong>📝 ${assignmentTitle}</strong><br>
              <strong>📅 Due Date: ${dueDate}</strong><br>
              <p style="margin: 10px 0 0 0; color: #666;">Make sure to submit your work before the deadline!</p>
            </div>
            
            <p>Click the button below to access and submit your assignment.</p>
            
            <center>
              <a href="${baseUrl}" class="button">Submit Assignment</a>
            </center>
            
            <p>If you have any questions, please reach out to your instructor.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Your Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

/**
 * Generate progress update email
 */
export const generateProgressUpdateEmail = (
  userName: string,
  courseName: string,
  progressPercentage: number,
  courseUrl?: string
): string => {
  const baseUrl = courseUrl || 'https://yourplatform.com';
  const milestone = progressPercentage === 50 ? 'halfway' : progressPercentage === 75 ? 'almost there' : 'complete';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px; border-radius: 8px 8px 0 0; color: white; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin: 20px 0; }
          .progress-bar { background: #e5e7eb; height: 10px; border-radius: 10px; overflow: hidden; margin: 15px 0; }
          .progress-fill { background: linear-gradient(90deg, #3b82f6, #1d4ed8); height: 100%; width: ${progressPercentage}%; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Great Progress! 🚀</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>You're doing amazing! You're ${milestone} through <strong>${courseName}</strong>.</p>
            
            <p><strong>Your Progress: ${progressPercentage}%</strong></p>
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
            
            ${
              progressPercentage === 50
                ? '<p>You\'re at the halfway point! Keep up the momentum and don\'t stop now.</p>'
                : progressPercentage === 75
                ? '<p>You\'re almost at the finish line! Just a little bit more to go. You\'ve got this!</p>'
                : '<p>Congratulations! You\'ve completed the course. Great work!</p>'
            }
            
            <center>
              <a href="${baseUrl}" class="button">Continue Learning</a>
            </center>
            
            <p>Keep pushing forward!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Your Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

/**
 * Generate announcement email
 */
export const generateAnnouncementEmail = (
  userName: string,
  title: string,
  message: string,
  courseName: string,
  courseUrl?: string
): string => {
  const baseUrl = courseUrl || 'https://yourplatform.com';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); padding: 30px; border-radius: 8px 8px 0 0; color: white; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #8b5cf6; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin: 20px 0; }
          .announcement { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #8b5cf6; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📣 New Announcement</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>There's a new announcement in <strong>${courseName}</strong>.</p>
            
            <div class="announcement">
              <h3 style="margin-top: 0;">${title}</h3>
              <p>${message}</p>
            </div>
            
            <p>Make sure to check the course for full details.</p>
            
            <center>
              <a href="${baseUrl}" class="button">View Announcement</a>
            </center>
            
            <p>Thank you!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Your Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

/**
 * Email template selector
 */
export const getEmailTemplate = (
  type: 'enrollment' | 'registration' | 'completion' | 'lesson' | 'assignment' | 'progress' | 'announcement',
  params: Record<string, any>
): string => {
  switch (type) {
    case 'enrollment':
      return generateEnrollmentWelcomeEmail(
        params.userName,
        params.courseName,
        params.courseUrl
      );
    case 'registration':
      return generateRegistrationWelcomeEmail(
        params.userName,
        params.exploreUrl
      );
    case 'completion':
      return generateCourseCompletionEmail(
        params.userName,
        params.courseName,
        params.certificateUrl
      );
    case 'lesson':
      return generateLessonAvailableEmail(
        params.userName,
        params.lessonTitle,
        params.courseName,
        params.lessonUrl
      );
    case 'assignment':
      return generateAssignmentReminderEmail(
        params.userName,
        params.assignmentTitle,
        params.courseName,
        params.dueDate,
        params.assignmentUrl
      );
    case 'progress':
      return generateProgressUpdateEmail(
        params.userName,
        params.courseName,
        params.progressPercentage,
        params.courseUrl
      );
    case 'announcement':
      return generateAnnouncementEmail(
        params.userName,
        params.title,
        params.message,
        params.courseName,
        params.courseUrl
      );
    default:
      return '';
  }
};
