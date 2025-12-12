import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Icon from 'components/AppIcon';
import Breadcrumb from 'components/ui/Breadcrumb';
import { applicationService } from '../../services/applicationService';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { format, formatDistanceToNow } from 'date-fns';
import Button from 'components/ui/Button';
import Modal from 'components/ui/Modal';

const ApplicationDetail = () => {
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('id');
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpTime, setFollowUpTime] = useState('');
  const [timeline, setTimeline] = useState([]);

  const statusOptions = [
    { value: 'applied', label: 'Applied', icon: 'Send' },
    { value: 'screening', label: 'Screening', icon: 'Eye' },
    { value: 'interview', label: 'Interview Scheduled', icon: 'Calendar' },
    { value: 'interview_completed', label: 'Interview Completed', icon: 'CheckCircle' },
    { value: 'offer', label: 'Offer Received', icon: 'Award' },
    { value: 'offer_accepted', label: 'Offer Accepted', icon: 'CheckCircle' },
    { value: 'rejected', label: 'Rejected', icon: 'XCircle' },
    { value: 'withdrawn', label: 'Withdrawn', icon: 'X' },
  ];

  useEffect(() => {
    if (user && applicationId) {
      loadApplication();
    } else if (!user) {
      navigate('/login');
    }
  }, [user, applicationId]);

  const loadApplication = async () => {
    try {
      setLoading(true);
      const app = await applicationService.getById(applicationId);
      setApplication(app);
      setNotes(app.notes || '');
      setNewStatus(app.status);
      generateTimeline(app);
    } catch (error) {
      console.error('Error loading application:', error);
      showError('Failed to load application');
      navigate('/workflow-application-tracking-analytics');
    } finally {
      setLoading(false);
    }
  };

  const generateTimeline = (app) => {
    const events = [];
    
    if (app.applied_at) {
      events.push({
        date: app.applied_at,
        type: 'applied',
        title: 'Application Submitted',
        description: 'Your application was successfully submitted',
        icon: 'Send',
      });
    }

    if (app.status === 'screening') {
      events.push({
        date: app.updated_at || app.applied_at,
        type: 'screening',
        title: 'Under Review',
        description: 'Your application is being reviewed',
        icon: 'Eye',
      });
    }

    if (app.status === 'interview' || app.status === 'interview_completed') {
      events.push({
        date: app.interview_date || app.updated_at,
        type: 'interview',
        title: 'Interview Scheduled',
        description: app.interview_date ? `Interview scheduled for ${format(new Date(app.interview_date), 'MMM d, yyyy')}` : 'Interview scheduled',
        icon: 'Calendar',
      });
    }

    if (app.status === 'offer' || app.status === 'offer_accepted') {
      events.push({
        date: app.offer_date || app.updated_at,
        type: 'offer',
        title: 'Offer Received',
        description: app.offer_salary ? `Offer received: $${app.offer_salary}` : 'Offer received',
        icon: 'Award',
      });
    }

    if (app.status === 'rejected') {
      events.push({
        date: app.updated_at || app.applied_at,
        type: 'rejected',
        title: 'Application Rejected',
        description: 'Unfortunately, this application was not selected',
        icon: 'XCircle',
      });
    }

    // Sort by date
    events.sort((a, b) => new Date(b.date) - new Date(a.date));
    setTimeline(events);
  };

  const handleStatusUpdate = async () => {
    try {
      await applicationService.updateStatus(applicationId, newStatus, notes);
      success('Application status updated');
      setShowStatusModal(false);
      loadApplication();
    } catch (error) {
      showError('Failed to update status');
    }
  };

  const handleNotesUpdate = async () => {
    try {
      await applicationService.updateStatus(applicationId, application.status, notes);
      success('Notes updated');
      setShowNotesModal(false);
      loadApplication();
    } catch (error) {
      showError('Failed to update notes');
    }
  };

  const handleFollowUpSchedule = async () => {
    try {
      const followUpDateTime = `${followUpDate}T${followUpTime}`;
      await applicationService.updateStatus(applicationId, application.status, notes, {
        follow_up_date: followUpDateTime,
      });
      success('Follow-up scheduled');
      setShowFollowUpModal(false);
      loadApplication();
    } catch (error) {
      showError('Failed to schedule follow-up');
    }
  };

  const handleDelete = async () => {
    try {
      await applicationService.delete(applicationId);
      success('Application deleted');
      navigate('/workflow-application-tracking-analytics');
    } catch (error) {
      showError('Failed to delete application');
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      applied: { color: 'text-workflow-primary', bgColor: 'bg-workflow-primary-50 dark:bg-workflow-primary-900/20', icon: 'Send' },
      screening: { color: 'text-[#64748B]', bgColor: 'bg-[#F8FAFC] dark:bg-[#1A2139]', icon: 'Eye' },
      interview: { color: 'text-success', bgColor: 'bg-success-50 dark:bg-success-900/20', icon: 'Calendar' },
      interview_completed: { color: 'text-success', bgColor: 'bg-success-50 dark:bg-success-900/20', icon: 'CheckCircle' },
      offer: { color: 'text-success', bgColor: 'bg-success-50 dark:bg-success-900/20', icon: 'Award' },
      offer_accepted: { color: 'text-success', bgColor: 'bg-success-50 dark:bg-success-900/20', icon: 'CheckCircle' },
      rejected: { color: 'text-error', bgColor: 'bg-error-50 dark:bg-error-900/20', icon: 'XCircle' },
      withdrawn: { color: 'text-[#64748B]', bgColor: 'bg-[#F8FAFC] dark:bg-[#1A2139]', icon: 'X' },
    };
    return statusMap[status] || statusMap.applied;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0E27] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary"></div>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  const job = application.job || {};
  const statusInfo = getStatusInfo(application.status);

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Applications', path: '/workflow-application-tracking-analytics' },
    { label: 'Application Detail', path: `/application-detail?id=${applicationId}`, isLast: true },
  ];

  return (
    <>
      <Helmet>
        <title>Application Detail - Workflow</title>
      </Helmet>
      <div className="min-h-screen bg-white dark:bg-[#0A0E27]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb customItems={breadcrumbItems} />

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Information Card */}
              <div className="bg-white dark:bg-[#13182E] rounded-lg shadow-soft border border-[#E2E8F0] dark:border-[#1E2640] p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-[#0F172A] dark:text-[#E8EAED] mb-2">
                      {job.title || 'Job Title'}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#64748B] dark:text-[#8B92A3]">
                      <span className="flex items-center gap-1">
                        <Icon name="Building" size={16} />
                        {job.company || 'Company'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="MapPin" size={16} />
                        {job.location || 'Location'}
                      </span>
                      {job.salary && (
                        <span className="flex items-center gap-1">
                          <Icon name="DollarSign" size={16} />
                          {job.salary}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full flex items-center gap-2 ${statusInfo.bgColor}`}>
                    <Icon name={statusInfo.icon} size={16} className={statusInfo.color} />
                    <span className={`text-sm font-medium ${statusInfo.color}`}>
                      {statusOptions.find(s => s.value === application.status)?.label || application.status}
                    </span>
                  </div>
                </div>

                {job.description && (
                  <div className="mt-4 pt-4 border-t border-[#E2E8F0] dark:border-[#1E2640]">
                    <h3 className="text-sm font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-2">Job Description</h3>
                    <div className="text-sm text-[#64748B] dark:text-[#8B92A3] prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: job.description }} />
                  </div>
                )}

                <div className="mt-4 flex gap-3">
                  <Link
                    to={`/jobs/detail?id=${job.id}`}
                    className="btn-outline text-sm"
                  >
                    <Icon name="ExternalLink" size={16} className="mr-2" />
                    View Job Posting
                  </Link>
                </div>
              </div>

              {/* Application Timeline */}
              <div className="bg-white dark:bg-[#13182E] rounded-lg shadow-soft border border-[#E2E8F0] dark:border-[#1E2640] p-6">
                <h2 className="text-xl font-bold text-[#0F172A] dark:text-[#E8EAED] mb-4">Application Timeline</h2>
                <div className="space-y-4">
                  {timeline.length > 0 ? (
                    timeline.map((event, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusInfo(event.type).bgColor}`}>
                            <Icon name={event.icon} size={20} className={getStatusInfo(event.type).color} />
                          </div>
                          {index < timeline.length - 1 && (
                            <div className="w-0.5 h-full bg-[#E2E8F0] dark:bg-[#1E2640] mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <h3 className="font-semibold text-[#0F172A] dark:text-[#E8EAED]">{event.title}</h3>
                          <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">{event.description}</p>
                          <p className="text-xs text-[#64748B] dark:text-[#8B92A3] mt-1">
                            {formatDistanceToNow(new Date(event.date), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">No timeline events yet</p>
                  )}
                </div>
              </div>

              {/* Notes Section */}
              {application.notes && (
                <div className="bg-white dark:bg-[#13182E] rounded-lg shadow-soft border border-[#E2E8F0] dark:border-[#1E2640] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[#0F172A] dark:text-[#E8EAED]">Notes</h2>
                    <Button onClick={() => setShowNotesModal(true)} variant="outline" size="sm">
                      <Icon name="Edit" size={16} className="mr-2" />
                      Edit
                    </Button>
                  </div>
                  <p className="text-sm text-[#64748B] dark:text-[#8B92A3] whitespace-pre-wrap">{application.notes}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Actions */}
              <div className="bg-white dark:bg-[#13182E] rounded-lg shadow-soft border border-[#E2E8F0] dark:border-[#1E2640] p-6">
                <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button onClick={() => setShowStatusModal(true)} variant="primary" className="w-full">
                    <Icon name="Edit" size={16} className="mr-2" />
                    Update Status
                  </Button>
                  <Button onClick={() => setShowNotesModal(true)} variant="outline" className="w-full">
                    <Icon name="FileText" size={16} className="mr-2" />
                    {application.notes ? 'Edit Notes' : 'Add Notes'}
                  </Button>
                  <Button onClick={() => setShowFollowUpModal(true)} variant="outline" className="w-full">
                    <Icon name="Calendar" size={16} className="mr-2" />
                    Schedule Follow-up
                  </Button>
                  <Button onClick={() => setShowDeleteModal(true)} variant="danger" className="w-full">
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Delete Application
                  </Button>
                </div>
              </div>

              {/* Application Details */}
              <div className="bg-white dark:bg-[#13182E] rounded-lg shadow-soft border border-[#E2E8F0] dark:border-[#1E2640] p-6">
                <h3 className="text-lg font-semibold text-[#0F172A] dark:text-[#E8EAED] mb-4">Application Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-[#64748B] dark:text-[#8B92A3]">Applied:</span>
                    <p className="text-[#0F172A] dark:text-[#E8EAED] font-medium">
                      {application.applied_at ? format(new Date(application.applied_at), 'MMM d, yyyy') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#64748B] dark:text-[#8B92A3]">Status:</span>
                    <p className="text-[#0F172A] dark:text-[#E8EAED] font-medium">
                      {statusOptions.find(s => s.value === application.status)?.label || application.status}
                    </p>
                  </div>
                  {application.interview_date && (
                    <div>
                      <span className="text-[#64748B] dark:text-[#8B92A3]">Interview Date:</span>
                      <p className="text-[#0F172A] dark:text-[#E8EAED] font-medium">
                        {format(new Date(application.interview_date), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  )}
                  {application.offer_salary && (
                    <div>
                      <span className="text-[#64748B] dark:text-[#8B92A3]">Offer Salary:</span>
                      <p className="text-[#0F172A] dark:text-[#E8EAED] font-medium">
                        ${application.offer_salary.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Application Status"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
              Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="input-field"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field"
              rows={4}
              placeholder="Add notes about this status change..."
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button onClick={() => setShowStatusModal(false)} variant="outline">Cancel</Button>
            <Button onClick={handleStatusUpdate} variant="primary">Update Status</Button>
          </div>
        </div>
      </Modal>

      {/* Notes Modal */}
      <Modal
        isOpen={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        title={application.notes ? "Edit Notes" : "Add Notes"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field"
              rows={6}
              placeholder="Add internal notes about this application..."
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button onClick={() => setShowNotesModal(false)} variant="outline">Cancel</Button>
            <Button onClick={handleNotesUpdate} variant="primary">Save Notes</Button>
          </div>
        </div>
      </Modal>

      {/* Follow-up Modal */}
      <Modal
        isOpen={showFollowUpModal}
        onClose={() => setShowFollowUpModal(false)}
        title="Schedule Follow-up"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
              Date
            </label>
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="input-field"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
              Time
            </label>
            <input
              type="time"
              value={followUpTime}
              onChange={(e) => setFollowUpTime(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button onClick={() => setShowFollowUpModal(false)} variant="outline">Cancel</Button>
            <Button onClick={handleFollowUpSchedule} variant="primary">Schedule</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Application"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#64748B] dark:text-[#8B92A3]">
            Are you sure you want to delete this application? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button onClick={() => setShowDeleteModal(false)} variant="outline">Cancel</Button>
            <Button onClick={handleDelete} variant="danger">Delete</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ApplicationDetail;

