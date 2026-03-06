/**
 * Resend Email Service
 * Sends emails via Resend API for notifications
 */

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export const sendEmail = async (payload: EmailPayload): Promise<boolean> => {
  try {
    const apiKey = process.env.REACT_APP_RESEND_API_KEY;

    if (!apiKey) {
      console.warn('[RESEND] API key not found. Skipping email send.');
      return false;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: payload.from || 'notifications@yourdomain.com',
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[RESEND] Error sending email:', error);
      return false;
    }

    const result = await response.json();
    console.log('[RESEND] Email sent successfully:', result.id);
    return true;
  } catch (error) {
    console.error('[RESEND] Failed to send email:', error);
    return false;
  }
};

/**
 * Send welcome notification email
 */
export const sendWelcomeEmail = async (
  to: string,
  name: string,
  subject = 'Welcome to Our Platform'
): Promise<boolean> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">Welcome!</h1>
      </div>
      <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p>Hi ${name},</p>
        <p>Welcome to our platform! We're excited to have you on board.</p>
        <p>You can now:</p>
        <ul>
          <li>Browse our courses</li>
          <li>Enroll in your first course</li>
          <li>Connect with instructors and students</li>
        </ul>
        <div style="margin-top: 30px; text-align: center;">
          <a href="${process.env.REACT_APP_BASE_URL || 'https://yourdomain.com'}" 
             style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Get Started
          </a>
        </div>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject,
    html,
  });
};

/**
 * Send course enrollment confirmation email
 */
export const sendCourseEnrollmentEmail = async (
  to: string,
  name: string,
  courseName: string,
  courseId: string
): Promise<boolean> => {
  const courseUrl = `${process.env.REACT_APP_BASE_URL || 'https://yourdomain.com'}/course/${courseId}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">🎓 Enrollment Confirmed</h1>
      </div>
      <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p>Hi ${name},</p>
        <p>Congratulations! You've successfully enrolled in:</p>
        <h2 style="color: #667eea; margin: 20px 0;">${courseName}</h2>
        <p>You can now access all course materials, lessons, and assignments.</p>
        <div style="margin-top: 30px; text-align: center;">
          <a href="${courseUrl}" 
             style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Start Learning
          </a>
        </div>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          Questions? Contact our support team.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Welcome to ${courseName}`,
    html,
  });
};

/**
 * Send generic notification email
 */
export const sendNotificationEmail = async (
  to: string,
  title: string,
  message: string,
  actionUrl?: string,
  actionText: string = 'View Details'
): Promise<boolean> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">📬 ${title}</h1>
      </div>
      <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p>${message}</p>
        ${
          actionUrl
            ? `<div style="margin-top: 30px; text-align: center;">
                 <a href="${actionUrl}" 
                    style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                   ${actionText}
                 </a>
               </div>`
            : ''
        }
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject: title,
    html,
  });
};
