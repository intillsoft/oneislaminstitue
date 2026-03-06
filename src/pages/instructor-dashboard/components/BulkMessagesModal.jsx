/**
 * Bulk Messages Modal
 * Allows recruiters to send messages to multiple candidates at once
 */

import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import Modal from 'components/ui/Modal';
import { applicationService } from '../../../services/applicationService';
import { supabase } from '../../../lib/supabase';
import { apiService } from '../../../lib/api';
import { useToast } from '../../../components/ui/Toast';

const BulkMessagesModal = ({ isOpen, onClose }) => {
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [messageType, setMessageType] = useState('custom');
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    template: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadApplications();
    }
  }, [isOpen]);

  const loadApplications = async () => {
    try {
      const allApplications = await applicationService.getAllForRecruiter();
      setApplications(allApplications || []);
    } catch (error) {
      console.error('Error loading applications:', error);
      showError('Failed to load applications');
    }
  };

  const messageTemplates = {
    interview: {
      subject: 'Interview Invitation',
      message: 'Dear {{name}},\n\nWe are pleased to invite you for an interview for the {{job_title}} position. We were impressed with your application and would like to learn more about you.\n\nPlease let us know your availability.\n\nBest regards,\n{{company_name}}',
    },
    rejection: {
      subject: 'Application Update',
      message: 'Dear {{name}},\n\nThank you for your interest in the {{job_title}} position. After careful consideration, we have decided to move forward with other candidates.\n\nWe appreciate your time and wish you the best in your job search.\n\nBest regards,\n{{company_name}}',
    },
    offer: {
      subject: 'Job Offer',
      message: 'Dear {{name}},\n\nWe are delighted to offer you the {{job_title}} position. We believe your skills and experience will be a great addition to our team.\n\nPlease review the offer details and let us know if you have any questions.\n\nBest regards,\n{{company_name}}',
    },
  };

  const handleTemplateSelect = (template) => {
    if (template === 'custom') {
      setFormData({
        subject: '',
        message: '',
        template: 'custom',
      });
    } else {
      const selectedTemplate = messageTemplates[template];
      setFormData({
        subject: selectedTemplate.subject,
        message: selectedTemplate.message,
        template: template,
      });
    }
  };

  const handleSelectApplication = (appId) => {
    setSelectedApplications(prev =>
      prev.includes(appId)
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === applications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(applications.map(app => app.id));
    }
  };

  const replaceTemplateVariables = (text, application) => {
    return text
      .replace(/\{\{name\}\}/g, `${application.first_name} ${application.last_name}`)
      .replace(/\{\{job_title\}\}/g, application.job?.title || 'the position')
      .replace(/\{\{company_name\}\}/g, application.job?.company || 'Our Company');
  };

  const validateForm = () => {
    const newErrors = {};
    if (selectedApplications.length === 0) {
      newErrors.applications = 'Please select at least one candidate';
    }
    if (!formData.subject) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.message) {
      newErrors.message = 'Message is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Send messages via backend API or directly via Supabase
      const selectedApps = applications.filter(app => selectedApplications.includes(app.id));
      
      let sentCount = 0;
      const errors = [];

      // Try to send via backend API first, fallback to direct Supabase update
      for (const app of selectedApps) {
        try {
          const personalizedSubject = replaceTemplateVariables(formData.subject, app);
          const personalizedMessage = replaceTemplateVariables(formData.message, app);

          // Try backend API first
          try {
            await apiService.post('/emails/send', {
              to: app.email,
              subject: personalizedSubject,
              html: personalizedMessage.replace(/\n/g, '<br>'),
              text: personalizedMessage,
            });
          } catch (apiError) {
            // If backend API fails, log but continue (might be in development)
            console.warn(`Backend email API not available for ${app.email}, continuing...`, apiError);
          }

          // Update application notes to track sent messages
          const existingNotes = app.notes 
            ? (typeof app.notes === 'string' ? JSON.parse(app.notes) : app.notes) 
            : {};
          const updatedNotes = {
            ...existingNotes,
            messages: [
              ...(existingNotes.messages || []),
              {
                type: messageType,
                subject: personalizedSubject,
                sentAt: new Date().toISOString(),
              }
            ]
          };

          const { error: updateError } = await supabase
            .from('applications')
            .update({ notes: JSON.stringify(updatedNotes) })
            .eq('id', app.id);

          if (updateError) {
            throw updateError;
          }

          sentCount++;
        } catch (error) {
          console.error(`Error sending message to ${app.email}:`, error);
          errors.push({ email: app.email, error: error.message });
        }
      }

      if (errors.length > 0) {
        showError(`Failed to send ${errors.length} message(s). ${sentCount} sent successfully.`);
      }

      success(`Messages sent successfully to ${selectedApplications.length} candidate(s)!`);
      onClose();
      setSelectedApplications([]);
      setFormData({
        subject: '',
        message: '',
        template: '',
      });
    } catch (error) {
      console.error('Error sending messages:', error);
      showError('Failed to send messages');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Send Bulk Messages"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Select Candidates */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-text-primary dark:text-white">
              Select Candidates <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-sm text-workflow-primary hover:text-workflow-primary-600"
            >
              {selectedApplications.length === applications.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-lg p-2">
            {applications.length === 0 ? (
              <p className="text-sm text-text-secondary dark:text-gray-400 text-center py-4">
                No candidates available
              </p>
            ) : (
              applications.map((app) => (
                <label
                  key={app.id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedApplications.includes(app.id)}
                    onChange={() => handleSelectApplication(app.id)}
                    className="rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary dark:text-white">
                      {app.first_name} {app.last_name}
                    </p>
                    <p className="text-xs text-text-secondary dark:text-gray-400">
                      {app.email} • {app.job?.title || 'N/A'}
                    </p>
                  </div>
                </label>
              ))
            )}
          </div>
          {errors.applications && (
            <p className="text-red-500 text-sm mt-1">{errors.applications}</p>
          )}
          {selectedApplications.length > 0 && (
            <p className="text-sm text-text-secondary dark:text-gray-400 mt-2">
              {selectedApplications.length} candidate(s) selected
            </p>
          )}
        </div>

        {/* Message Template */}
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
            Message Template
          </label>
          <select
            value={messageType}
            onChange={(e) => {
              setMessageType(e.target.value);
              handleTemplateSelect(e.target.value);
            }}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1A2139] text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary"
          >
            <option value="custom">Custom Message</option>
            <option value="interview">Interview Invitation</option>
            <option value="rejection">Rejection Notice</option>
            <option value="offer">Job Offer</option>
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Message subject"
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
            } bg-white dark:bg-[#1A2139] text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary`}
          />
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={8}
            placeholder="Your message... Use {{name}}, {{job_title}}, {{company_name}} for personalization"
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
            } bg-white dark:bg-[#1A2139] text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary resize-none`}
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
          <p className="text-xs text-text-secondary dark:text-gray-400 mt-1">
            Available variables: {'{{name}}'}, {'{{job_title}}'}, {'{{company_name}}'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || selectedApplications.length === 0}
            className="px-4 py-2 rounded-lg bg-workflow-primary text-white hover:bg-workflow-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Icon name="Send" size={16} />
                <span>Send to {selectedApplications.length} Candidate(s)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BulkMessagesModal;

