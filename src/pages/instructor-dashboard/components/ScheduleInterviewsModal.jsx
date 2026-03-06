/**
 * Schedule Interviews Modal
 * Allows recruiters to schedule interviews with candidates
 */

import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import Modal from 'components/ui/Modal';
import { applicationService } from '../../../services/applicationService';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../../components/ui/Toast';
import { format } from 'date-fns';

const ScheduleInterviewsModal = ({ isOpen, onClose, applicationId = null }) => {
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(applicationId);
  const [formData, setFormData] = useState({
    interviewDate: '',
    interviewTime: '',
    interviewType: 'video',
    location: '',
    meetingLink: '',
    notes: '',
    interviewer: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadApplications();
      if (applicationId) {
        setSelectedApplication(applicationId);
      }
    }
  }, [isOpen, applicationId]);

  const loadApplications = async () => {
    try {
      const allApplications = await applicationService.getAllForRecruiter();
      // Filter to only show applications that are in screening or interview stage
      const interviewable = allApplications.filter(app => 
        app.status === 'screening' || app.status === 'interview' || app.status === 'applied'
      );
      setApplications(interviewable);
    } catch (error) {
      console.error('Error loading applications:', error);
      showError('Failed to load applications');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedApplication) {
      newErrors.application = 'Please select a candidate';
    }
    if (!formData.interviewDate) {
      newErrors.interviewDate = 'Interview date is required';
    }
    if (!formData.interviewTime) {
      newErrors.interviewTime = 'Interview time is required';
    }
    if (formData.interviewType === 'video' && !formData.meetingLink) {
      newErrors.meetingLink = 'Meeting link is required for video interviews';
    }
    if (formData.interviewType === 'onsite' && !formData.location) {
      newErrors.location = 'Location is required for onsite interviews';
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
      const interviewDateTime = new Date(`${formData.interviewDate}T${formData.interviewTime}`);
      
      // Get application details
      const application = applications.find(a => a.id === selectedApplication);
      const existingNotes = application?.notes 
        ? (typeof application.notes === 'string' ? JSON.parse(application.notes) : application.notes) 
        : {};
      
      // Prepare interview details
      const interviewDetails = {
        type: formData.interviewType,
        location: formData.location,
        meetingLink: formData.meetingLink,
        interviewer: formData.interviewer,
        scheduledAt: interviewDateTime.toISOString(),
        notes: formData.notes || null,
      };

      const updatedNotes = {
        ...existingNotes,
        interview: interviewDetails
      };

      // Update application with interview_date column (from schema) and status
      const updatePayload = {
        status: 'interview',
        interview_date: interviewDateTime.toISOString(),
        notes: JSON.stringify(updatedNotes),
      };

      const { error: updateError } = await supabase
        .from('applications')
        .update(updatePayload)
        .eq('id', selectedApplication);

      if (updateError) {
        console.error('Error updating application:', updateError);
        throw updateError;
      }

      // Optionally send email notification via backend
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/emails/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: JSON.stringify({
            to: application.email,
            template: 'interview-scheduled',
            data: {
              candidateName: `${application.first_name} ${application.last_name}`,
              jobTitle: application.job?.title || 'the position',
              interviewDate: formData.interviewDate,
              interviewTime: formData.interviewTime,
              interviewType: formData.interviewType,
              location: formData.location,
              meetingLink: formData.meetingLink,
              interviewer: formData.interviewer,
            },
          }),
        });
        
        if (!response.ok) {
          console.warn('Failed to send interview email notification');
        }
      } catch (emailError) {
        console.warn('Email notification error (non-critical):', emailError);
        // Don't fail the interview scheduling if email fails
      }

      success('Interview scheduled successfully!');
      onClose();
      setFormData({
        interviewDate: '',
        interviewTime: '',
        interviewType: 'video',
        location: '',
        meetingLink: '',
        notes: '',
        interviewer: '',
      });
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error scheduling interview:', error);
      showError('Failed to schedule interview');
    } finally {
      setLoading(false);
    }
  };

  const selectedApp = applications.find(a => a.id === selectedApplication);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Interview"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Select Candidate */}
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
            Select Candidate <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedApplication || ''}
            onChange={(e) => setSelectedApplication(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.application ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
            } bg-white dark:bg-[#1A2139] text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary`}
          >
            <option value="">Select a candidate...</option>
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.first_name} {app.last_name} - {app.job?.title || 'N/A'}
              </option>
            ))}
          </select>
          {errors.application && (
            <p className="text-red-500 text-sm mt-1">{errors.application}</p>
          )}
          {selectedApp && (
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-text-secondary dark:text-gray-400">
                <strong>Email:</strong> {selectedApp.email}
              </p>
              {selectedApp.phone && (
                <p className="text-sm text-text-secondary dark:text-gray-400">
                  <strong>Phone:</strong> {selectedApp.phone}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Interview Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
              Interview Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.interviewDate}
              onChange={(e) => handleInputChange('interviewDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.interviewDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
              } bg-white dark:bg-[#1A2139] text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary`}
            />
            {errors.interviewDate && (
              <p className="text-red-500 text-sm mt-1">{errors.interviewDate}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
              Interview Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={formData.interviewTime}
              onChange={(e) => handleInputChange('interviewTime', e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.interviewTime ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
              } bg-white dark:bg-[#1A2139] text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary`}
            />
            {errors.interviewTime && (
              <p className="text-red-500 text-sm mt-1">{errors.interviewTime}</p>
            )}
          </div>
        </div>

        {/* Interview Type */}
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
            Interview Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.interviewType}
            onChange={(e) => handleInputChange('interviewType', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1A2139] text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary"
          >
            <option value="video">Video Call</option>
            <option value="onsite">On-site</option>
            <option value="phone">Phone Call</option>
          </select>
        </div>

        {/* Location or Meeting Link */}
        {formData.interviewType === 'video' ? (
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
              Meeting Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={formData.meetingLink}
              onChange={(e) => handleInputChange('meetingLink', e.target.value)}
              placeholder="https://meet.google.com/..."
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.meetingLink ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
              } bg-white dark:bg-[#1A2139] text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary`}
            />
            {errors.meetingLink && (
              <p className="text-red-500 text-sm mt-1">{errors.meetingLink}</p>
            )}
          </div>
        ) : formData.interviewType === 'onsite' ? (
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Office address or meeting room"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.location ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
              } bg-white dark:bg-[#1A2139] text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary`}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>
        ) : null}

        {/* Interviewer */}
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
            Interviewer Name
          </label>
          <input
            type="text"
            value={formData.interviewer}
            onChange={(e) => handleInputChange('interviewer', e.target.value)}
            placeholder="Name of the interviewer"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1A2139] text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={4}
            placeholder="Any additional information about the interview..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1A2139] text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-workflow-primary resize-none"
          />
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
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-workflow-primary text-white hover:bg-workflow-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Scheduling...</span>
              </>
            ) : (
              <>
                <Icon name="Calendar" size={16} />
                <span>Schedule Interview</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ScheduleInterviewsModal;

