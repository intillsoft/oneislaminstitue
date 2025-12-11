import React, { useState, useEffect } from 'react';
import { Clock, MapPin, DollarSign, Building, ExternalLink, Calendar, MessageSquare, CheckCircle, XCircle, AlertCircle, FileText, Search, Download, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../../services/jobService';
import { applicationService } from '../../../services/applicationService';
import { useToast } from '../../../components/ui/Toast';
import { format } from 'date-fns';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';

const ApplicationPipeline = ({ filterStatus, applications = [] }) => {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const [jobsData, setJobsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedApps, setSelectedApps] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // date, company, status
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState('');

  useEffect(() => {
    loadJobDetails();
  }, [applications]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      const jobsMap = {};
      for (const app of applications) {
        if (app.job_id && !jobsMap[app.job_id]) {
          try {
            const job = await jobService.getById(app.job_id);
            jobsMap[app.job_id] = job;
          } catch (error) {
            console.error(`Error loading job ${app.job_id}:`, error);
          }
        }
      }
      setJobsData(jobsMap);
    } catch (error) {
      console.error('Error loading job details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Transform applications to display format
  const transformedApplications = applications.map(app => {
    const job = jobsData[app.job_id] || {};
    const appliedDate = app.applied_at ? new Date(app.applied_at) : new Date(app.created_at);
    const daysAgo = Math.floor((new Date() - appliedDate) / (1000 * 60 * 60 * 24));
    
    // Calculate probability based on status
    const probabilityMap = {
      'accepted': 100,
      'interview': 75,
      'screening': 50,
      'applied': 25,
      'rejected': 0,
      'withdrawn': 0
    };
    
    const stageMap = {
      'applied': 'Application Submitted',
      'screening': 'Phone Screen',
      'interview': 'Technical Interview',
      'accepted': 'Offer Extended',
      'rejected': 'Not Selected',
      'withdrawn': 'Withdrawn'
    };
    
    return {
      id: app.id,
      company: job.company || 'Unknown Company',
      position: job.title || 'Unknown Position',
      location: job.location || 'Location not specified',
      salary: job.salary || 'Salary not specified',
      appliedDate: format(appliedDate, 'yyyy-MM-dd'),
      status: app.status,
      stage: stageMap[app.status] || app.status,
      nextAction: getNextAction(app.status, app.applied_at),
      daysInStage: daysAgo,
      probability: probabilityMap[app.status] || 0,
      companyLogo: job.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company || 'Company')}&background=0046FF&color=fff`,
      notes: app.notes ? 1 : 0,
      communications: 0, // TODO: Implement communication tracking
      job_id: app.job_id
    };
  });

  const getNextAction = (status, appliedAt) => {
    const date = appliedAt ? new Date(appliedAt) : new Date();
    const followUpDate = new Date(date);
    followUpDate.setDate(followUpDate.getDate() + 7);
    
    switch(status) {
      case 'interview':
        return `Follow up on interview status`;
      case 'screening':
        return `Prepare for screening call`;
      case 'applied':
        return `Follow up on ${format(followUpDate, 'MMM d, yyyy')}`;
      case 'accepted':
        return `Respond to offer`;
      default:
        return `Review application status`;
    }
  };


  // Search and filter
  let filteredApplications = filterStatus === 'all' 
    ? transformedApplications 
    : transformedApplications?.filter(app => {
      if (filterStatus === 'offer') return app.status === 'accepted';
      return app.status === filterStatus;
    });

  // Apply search
  if (searchQuery) {
    filteredApplications = filteredApplications.filter(app =>
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply sorting
  filteredApplications = [...filteredApplications].sort((a, b) => {
    switch (sortBy) {
      case 'company':
        return a.company.localeCompare(b.company);
      case 'status':
        return a.status.localeCompare(b.status);
      case 'date':
      default:
        return new Date(b.appliedDate) - new Date(a.appliedDate);
    }
  });

  const handleSelectApp = (appId) => {
    setSelectedApps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(appId)) {
        newSet.delete(appId);
      } else {
        newSet.add(appId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedApps.size === filteredApplications.length) {
      setSelectedApps(new Set());
    } else {
      setSelectedApps(new Set(filteredApplications.map(app => app.id)));
    }
  };

  const handleBulkAction = async () => {
    if (selectedApps.size === 0) return;

    try {
      if (bulkAction === 'delete') {
        await applicationService.bulkDelete(Array.from(selectedApps));
        success(`${selectedApps.size} application(s) deleted`);
      } else if (bulkAction) {
        await applicationService.bulkUpdateStatus(Array.from(selectedApps), bulkAction);
        success(`${selectedApps.size} application(s) updated`);
      }
      setSelectedApps(new Set());
      setShowBulkModal(false);
      // Reload applications
      window.location.reload();
    } catch (error) {
      showError('Failed to perform bulk action');
    }
  };

  const handleExport = async () => {
    try {
      const csv = await applicationService.exportToCSV({ status: filterStatus === 'all' ? null : filterStatus });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `applications-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      success('Applications exported successfully');
    } catch (error) {
      showError('Failed to export applications');
    }
  };

  // Calculate counts
  const counts = {
    applied: transformedApplications.filter(a => a.status === 'applied').length,
    screening: transformedApplications.filter(a => a.status === 'screening').length,
    interview: transformedApplications.filter(a => a.status === 'interview').length,
    offer: transformedApplications.filter(a => a.status === 'accepted').length
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-700 border-blue-200',
      screening: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      interview: 'bg-purple-100 text-purple-700 border-purple-200',
      offer: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors?.[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'offer':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'interview':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 75) return 'text-green-600';
    if (probability >= 50) return 'text-yellow-600';
    if (probability >= 25) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Search and Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#64748B] dark:text-[#8B92A3]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company or position..."
              className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-workflow-primary"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-[#E2E8F0] dark:border-[#1E2640] rounded-lg bg-white dark:bg-[#13182E] text-[#0F172A] dark:text-[#E8EAED] text-sm"
          >
            <option value="date">Sort by Date</option>
            <option value="company">Sort by Company</option>
            <option value="status">Sort by Status</option>
          </select>
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          {selectedApps.size > 0 && (
            <Button onClick={() => setShowBulkModal(true)} variant="primary" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Bulk Actions ({selectedApps.size})
            </Button>
          )}
        </div>
      </div>

      {/* Pipeline Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Applied</div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{counts.applied}</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium mb-1">Screening</div>
          <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{counts.screening}</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">Interview</div>
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{counts.interview}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">Offers</div>
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">{counts.offer}</div>
        </div>
      </div>
      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications?.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedApps.size === filteredApplications.length && filteredApplications.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 text-workflow-primary focus:ring-workflow-primary border-[#E2E8F0] dark:border-[#1E2640] rounded"
              />
              <span className="text-sm text-[#64748B] dark:text-[#8B92A3]">
                Select All ({filteredApplications.length} applications)
              </span>
            </label>
          </div>
        )}
        {filteredApplications?.map((app) => (
          <div
            key={app?.id}
            className={`bg-white dark:bg-[#13182E] border rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow ${
              selectedApps.has(app.id)
                ? 'border-workflow-primary bg-workflow-primary-50 dark:bg-workflow-primary-900/20'
                : 'border-gray-200 dark:border-[#1E2640]'
            }`}
          >
            {/* Header Row */}
            <div className="flex items-start gap-3 mb-4">
              <input
                type="checkbox"
                checked={selectedApps.has(app.id)}
                onChange={() => handleSelectApp(app.id)}
                className="mt-1 w-4 h-4 text-workflow-primary focus:ring-workflow-primary border-[#E2E8F0] dark:border-[#1E2640] rounded"
              />
              <div className="flex items-start justify-between gap-4 flex-1">
              <div className="flex items-start gap-4 flex-1">
                <img
                  src={app?.companyLogo}
                  alt={`${app?.company} logo`}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-[#E8EAED] mb-1">{app?.position}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-[#8B92A3] mb-2">
                    <Building className="w-4 h-4" />
                    {app?.company}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-[#8B92A3]">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {app?.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {app?.salary}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Applied {app?.daysInStage} days ago
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button 
                  onClick={() => navigate(`/application-detail?id=${app.id}`)}
                  className="text-[#0046FF] hover:text-blue-700"
                  title="View Details"
                >
                  <FileText className="w-5 h-5" />
                </button>
                {app.job_id && (
                  <button 
                    onClick={() => navigate(`/job-detail-application?id=${app.job_id}`)}
                    className="text-[#0046FF] hover:text-blue-700"
                    title="View Job"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                )}
              </div>
              </div>
            </div>

            {/* Status and Stage */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(app?.status)}`}>
                {getStatusIcon(app?.status)}
                {app?.stage}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Success Probability:</span>
                <span className={`text-sm font-bold ${getProbabilityColor(app?.probability)}`}>
                  {app?.probability}%
                </span>
              </div>
            </div>

            {/* Next Action */}
            <div className="bg-blue-50 dark:bg-[#1A2139] border border-blue-200 dark:border-[#1E2640] rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-[#0046FF]" />
                <span className="font-medium text-gray-700 dark:text-[#B4B9C4]">Next Action:</span>
                <span className="text-gray-900 dark:text-[#E8EAED]">{app?.nextAction}</span>
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate(`/application-detail?id=${app.id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-[#0046FF] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                View Details
              </button>
              {app.job_id && (
                <button
                  onClick={() => navigate(`/job-detail-application?id=${app.job_id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1A2139] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-[#1E2640] rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-[#13182E] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Job
                </button>
              )}
            </div>

            {/* Timeline Progress Bar */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#1E2640]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600 dark:text-[#8B92A3]">Application Progress</span>
                <span className="text-xs text-gray-600 dark:text-[#8B92A3]">{app?.daysInStage} days in current stage</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-[#1E2640] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0046FF] rounded-full transition-all"
                  style={{ width: `${app?.probability}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0046FF] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-[#8B92A3]">Loading applications...</p>
        </div>
      ) : filteredApplications?.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-[#8B92A3] mb-4">
            <Clock className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-[#E8EAED] mb-2">No applications found</h3>
          <p className="text-gray-600 dark:text-[#8B92A3] mb-4">Try adjusting your filters or apply to jobs to get started</p>
          <button 
            onClick={() => navigate('/job-search-browse')}
            className="px-6 py-2 bg-[#0046FF] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Jobs
          </button>
        </div>
      ) : null}

      {/* Bulk Actions Modal */}
      <Modal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        title={`Bulk Actions (${selectedApps.size} selected)`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] dark:text-[#E8EAED] mb-2">
              Action
            </label>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="input-field"
            >
              <option value="">Select an action...</option>
              <option value="applied">Change Status: Applied</option>
              <option value="screening">Change Status: Screening</option>
              <option value="interview">Change Status: Interview</option>
              <option value="rejected">Change Status: Rejected</option>
              <option value="withdrawn">Change Status: Withdrawn</option>
              <option value="delete">Delete Applications</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button onClick={() => setShowBulkModal(false)} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={handleBulkAction}
              disabled={!bulkAction || loading}
              variant={bulkAction === 'delete' ? 'danger' : 'primary'}
            >
              {loading ? 'Processing...' : 'Apply Action'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ApplicationPipeline;