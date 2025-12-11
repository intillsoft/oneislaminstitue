/**
 * Email Templates
 * Dynamic email templates for Resend
 */

/**
 * Get email template by type
 */
export function getEmailTemplate(template, data = {}) {
  const templates = {
    welcome: {
      subject: 'Welcome to Workflows! 🎉',
      html: welcomeTemplate(data),
      text: welcomeTemplateText(data),
    },
    'welcome-followup': {
      subject: 'Getting Started with Workflows',
      html: welcomeFollowupTemplate(data),
      text: welcomeFollowupTemplateText(data),
    },
    'welcome-tips': {
      subject: 'Tips for Finding Your Dream Job',
      html: welcomeTipsTemplate(data),
      text: welcomeTipsTemplateText(data),
    },
    'password-reset': {
      subject: 'Reset Your Password',
      html: passwordResetTemplate(data),
      text: passwordResetTemplateText(data),
    },
    'email-verification': {
      subject: 'Verify Your Email Address',
      html: emailVerificationTemplate(data),
      text: emailVerificationTemplateText(data),
    },
    'application-confirmation': {
      subject: 'Application Submitted Successfully',
      html: applicationConfirmationTemplate(data),
      text: applicationConfirmationTemplateText(data),
    },
    'weekly-recommendations': {
      subject: 'Your Weekly Job Recommendations',
      html: weeklyRecommendationsTemplate(data),
      text: weeklyRecommendationsTemplateText(data),
    },
    'interview-reminder': {
      subject: 'Interview Reminder',
      html: interviewReminderTemplate(data),
      text: interviewReminderTemplateText(data),
    },
    'subscription-activated': {
      subject: 'Subscription Activated',
      html: subscriptionActivatedTemplate(data),
      text: subscriptionActivatedTemplateText(data),
    },
    'subscription-canceled': {
      subject: 'Subscription Canceled',
      html: subscriptionCanceledTemplate(data),
      text: subscriptionCanceledTemplateText(data),
    },
    'payment-confirmation': {
      subject: 'Payment Received',
      html: paymentConfirmationTemplate(data),
      text: paymentConfirmationTemplateText(data),
    },
    'payment-failed': {
      subject: 'Payment Failed - Action Required',
      html: paymentFailedTemplate(data),
      text: paymentFailedTemplateText(data),
    },
    'trial-ending': {
      subject: 'Your Trial is Ending Soon',
      html: trialEndingTemplate(data),
      text: trialEndingTemplateText(data),
    },
    'subscription-renewal': {
      subject: 'Subscription Renewal Reminder',
      html: subscriptionRenewalTemplate(data),
      text: subscriptionRenewalTemplateText(data),
    },
    'new-application': {
      subject: 'New Application Received',
      html: newApplicationTemplate(data),
      text: newApplicationTemplateText(data),
    },
  };

  return templates[template] || templates.welcome;
}

// Template functions
function welcomeTemplate({ name = 'there' }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Workflows! 🎉</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>We're thrilled to have you join Workflows! Your journey to finding the perfect job starts now.</p>
          <p>Here's what you can do:</p>
          <ul>
            <li>Browse thousands of job listings</li>
            <li>Create and manage multiple resumes</li>
            <li>Track your applications</li>
            <li>Get AI-powered job recommendations</li>
          </ul>
          <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
          <p>Best of luck with your job search!</p>
          <p>The Workflows Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function welcomeTemplateText({ name = 'there' }) {
  return `
Welcome to Workflows!

Hi ${name},

We're thrilled to have you join Workflows! Your journey to finding the perfect job starts now.

Visit your dashboard: ${process.env.FRONTEND_URL}/dashboard

Best of luck with your job search!
The Workflows Team
  `;
}

function passwordResetTemplate({ name = 'there', resetUrl }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { color: #d32f2f; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <h2>Reset Your Password</h2>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>Or copy and paste this link into your browser:</p>
          <p>${resetUrl}</p>
          <p class="warning">This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>The Workflows Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function passwordResetTemplateText({ name = 'there', resetUrl }) {
  return `
Reset Your Password

Hi ${name},

We received a request to reset your password. Click the link below:

${resetUrl}

This link will expire in 1 hour. If you didn't request this, please ignore this email.

Best regards,
The Workflows Team
  `;
}

function applicationConfirmationTemplate({ name, jobTitle, companyName }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 10px; }
        .success { color: #2e7d32; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <h2 class="success">✓ Application Submitted</h2>
          <p>Hi ${name},</p>
          <p>Your application has been successfully submitted!</p>
          <p><strong>Position:</strong> ${jobTitle}</p>
          <p><strong>Company:</strong> ${companyName}</p>
          <p>We'll keep you updated on the status of your application.</p>
          <p>Good luck!</p>
          <p>The Workflows Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function applicationConfirmationTemplateText({ name, jobTitle, companyName }) {
  return `
Application Submitted Successfully

Hi ${name},

Your application has been successfully submitted!

Position: ${jobTitle}
Company: ${companyName}

We'll keep you updated on the status of your application.

Good luck!
The Workflows Team
  `;
}

function weeklyRecommendationsTemplate({ name, jobs = [] }) {
  const jobsList = jobs.map(job => `
    <div style="margin: 20px 0; padding: 15px; background: white; border-radius: 5px; border-left: 4px solid #667eea;">
      <h3>${job.title}</h3>
      <p><strong>${job.company}</strong> - ${job.location || 'Location not specified'}</p>
      ${job.salary ? `<p>Salary: ${job.salary}</p>` : ''}
      <a href="${process.env.FRONTEND_URL}/jobs/${job.id}" style="color: #667eea;">View Job →</a>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <h2>Your Weekly Job Recommendations</h2>
          <p>Hi ${name},</p>
          <p>Here are some jobs we think you might be interested in:</p>
          ${jobsList || '<p>No new recommendations this week. Check back next week!</p>'}
          <p><a href="${process.env.FRONTEND_URL}/jobs">Browse All Jobs →</a></p>
          <p>Best of luck with your job search!</p>
          <p>The Workflows Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function weeklyRecommendationsTemplateText({ name, jobs = [] }) {
  const jobsList = jobs.map(job => `
${job.title}
${job.company} - ${job.location || 'Location not specified'}
${job.salary ? `Salary: ${job.salary}` : ''}
${process.env.FRONTEND_URL}/jobs/${job.id}
  `).join('\n\n');

  return `
Your Weekly Job Recommendations

Hi ${name},

Here are some jobs we think you might be interested in:

${jobsList || 'No new recommendations this week. Check back next week!'}

Browse all jobs: ${process.env.FRONTEND_URL}/jobs

Best of luck with your job search!
The Workflows Team
  `;
}

function interviewReminderTemplate({ name, interviewDate, jobTitle, companyName }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 10px; }
        .reminder { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <h2>📅 Interview Reminder</h2>
          <p>Hi ${name},</p>
          <div class="reminder">
            <p><strong>You have an upcoming interview:</strong></p>
            <p><strong>Position:</strong> ${jobTitle}</p>
            <p><strong>Company:</strong> ${companyName}</p>
            <p><strong>Date & Time:</strong> ${interviewDate}</p>
          </div>
          <p>Good luck with your interview! Remember to:</p>
          <ul>
            <li>Review the job description</li>
            <li>Prepare questions to ask</li>
            <li>Arrive 10 minutes early</li>
            <li>Bring copies of your resume</li>
          </ul>
          <p>Best of luck!</p>
          <p>The Workflows Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function interviewReminderTemplateText({ name, interviewDate, jobTitle, companyName }) {
  return `
Interview Reminder

Hi ${name},

You have an upcoming interview:

Position: ${jobTitle}
Company: ${companyName}
Date & Time: ${interviewDate}

Good luck with your interview!

Best regards,
The Workflows Team
  `;
}

function subscriptionActivatedTemplate({ name, tier }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 10px; }
        .success { color: #2e7d32; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <h2 class="success">✓ Subscription Activated</h2>
          <p>Hi ${name},</p>
          <p>Your ${tier} subscription has been activated!</p>
          <p>You now have access to all premium features. Start exploring:</p>
          <ul>
            <li>Advanced job search</li>
            <li>AI-powered recommendations</li>
            <li>Unlimited applications</li>
            <li>Priority support</li>
          </ul>
          <p><a href="${process.env.FRONTEND_URL}/dashboard">Go to Dashboard →</a></p>
          <p>Thank you for subscribing!</p>
          <p>The Workflows Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function subscriptionActivatedTemplateText({ name, tier }) {
  return `
Subscription Activated

Hi ${name},

Your ${tier} subscription has been activated!

You now have access to all premium features.

Visit your dashboard: ${process.env.FRONTEND_URL}/dashboard

Thank you for subscribing!
The Workflows Team
  `;
}

function paymentFailedTemplate({ name, amount, currency, retryUrl }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 10px; }
        .warning { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <h2>⚠️ Payment Failed</h2>
          <p>Hi ${name},</p>
          <div class="warning">
            <p>We were unable to process your payment of ${currency} ${amount}.</p>
          </div>
          <p>Please update your payment method to continue your subscription:</p>
          <a href="${retryUrl}" class="button">Update Payment Method</a>
          <p>If you continue to experience issues, please contact support.</p>
          <p>Best regards,<br>The Workflows Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function paymentFailedTemplateText({ name, amount, currency, retryUrl }) {
  return `
Payment Failed - Action Required

Hi ${name},

We were unable to process your payment of ${currency} ${amount}.

Please update your payment method: ${retryUrl}

If you continue to experience issues, please contact support.

Best regards,
The Workflows Team
  `;
}

// Additional template functions (simplified versions)
function welcomeFollowupTemplate(data) {
  return welcomeTemplate(data).replace('Welcome to Workflows!', 'Getting Started with Workflows');
}
function welcomeFollowupTemplateText(data) {
  return welcomeTemplateText(data).replace('Welcome to Workflows!', 'Getting Started with Workflows');
}
function welcomeTipsTemplate(data) {
  return welcomeTemplate(data).replace('Welcome to Workflows!', 'Tips for Finding Your Dream Job');
}
function welcomeTipsTemplateText(data) {
  return welcomeTemplateText(data).replace('Welcome to Workflows!', 'Tips for Finding Your Dream Job');
}
function emailVerificationTemplate({ name, verifyUrl }) {
  return passwordResetTemplate({ name, resetUrl: verifyUrl }).replace('Reset Your Password', 'Verify Your Email');
}
function emailVerificationTemplateText({ name, verifyUrl }) {
  return passwordResetTemplateText({ name, resetUrl: verifyUrl }).replace('Reset Your Password', 'Verify Your Email');
}
function subscriptionCanceledTemplate({ name }) {
  return `<p>Hi ${name},</p><p>Your subscription has been canceled. We're sorry to see you go!</p>`;
}
function subscriptionCanceledTemplateText({ name }) {
  return `Hi ${name},\n\nYour subscription has been canceled. We're sorry to see you go!`;
}
function paymentConfirmationTemplate({ name, amount, currency }) {
  return `<p>Hi ${name},</p><p>Your payment of ${currency} ${amount} has been received. Thank you!</p>`;
}
function paymentConfirmationTemplateText({ name, amount, currency }) {
  return `Hi ${name},\n\nYour payment of ${currency} ${amount} has been received. Thank you!`;
}
function trialEndingTemplate({ name, trialEndDate }) {
  return `<p>Hi ${name},</p><p>Your trial ends on ${trialEndDate}. Upgrade now to continue enjoying premium features!</p>`;
}
function trialEndingTemplateText({ name, trialEndDate }) {
  return `Hi ${name},\n\nYour trial ends on ${trialEndDate}. Upgrade now to continue!`;
}
function subscriptionRenewalTemplate({ name, renewalDate, plan }) {
  return `<p>Hi ${name},</p><p>Your ${plan} subscription will renew on ${renewalDate}.</p>`;
}
function subscriptionRenewalTemplateText({ name, renewalDate, plan }) {
  return `Hi ${name},\n\nYour ${plan} subscription will renew on ${renewalDate}.`;
}
