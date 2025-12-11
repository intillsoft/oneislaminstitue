import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { applicationService } from '../../../services/applicationService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { formatDistanceToNow } from 'date-fns';
import ComponentAIAssistant from '../../../components/ui/ComponentAIAssistant';

const CandidatePipeline = () => {
  const { user, profile } = useAuthContext();
  const { error: showError } = useToast();
  const [activeStage, setActiveStage] = useState('all');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && (profile?.role === 'recruiter' || profile?.role === 'admin')) {
      loadApplications();
    } else {
      setLoading(false);
    }
  }, [user, profile, activeStage]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const allApplications = await applicationService.getAllForRecruiter();
      
      // Filter by stage if not 'all'
      const filtered = activeStage === 'all' 
        ? allApplications 
        : allApplications.filter(app => app.status === activeStage);
      
      setApplications(filtered || []);
    } catch (error) {
      console.error('Error loading applications:', error);
      showError('Failed to load applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stage counts
  const stageCounts = {
    all: applications.length,
    new: applications.filter(app => !app.status || app.status === 'pending' || app.status === 'applied').length,
    screening: applications.filter(app => app.status === 'screening' || app.status === 'reviewing').length,
    interview: applications.filter(app => app.status === 'interview' || app.status === 'interview_scheduled').length,
    assessment: applications.filter(app => app.status === 'assessment' || app.status === 'testing').length,
    offer: applications.filter(app => app.status === 'offer' || app.status === 'offer_sent').length,
    hired: applications.filter(app => app.status === 'hired' || app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected' || app.status === 'declined').length,
  };

  const stages = [
    { id: 'all', label: 'All Candidates', count: stageCounts.all },
    { id: 'new', label: 'New', count: stageCounts.new },
    { id: 'screening', label: 'Screening', count: stageCounts.screening },
    { id: 'interview', label: 'Interview', count: stageCounts.interview },
    { id: 'assessment', label: 'Assessment', count: stageCounts.assessment },
    { id: 'offer', label: 'Offer', count: stageCounts.offer },
    { id: 'hired', label: 'Hired', count: stageCounts.hired },
    { id: 'rejected', label: 'Rejected', count: stageCounts.rejected },
  ];

  const filteredCandidates = activeStage === 'all' 
    ? applications 
    : applications.filter(app => {
        const status = app.status || 'new';
        if (activeStage === 'new') {
          return !status || status === 'pending' || status === 'applied';
        }
        return status === activeStage || 
               (activeStage === 'interview' && (status === 'interview' || status === 'interview_scheduled')) ||
               (activeStage === 'assessment' && (status === 'assessment' || status === 'testing')) ||
               (activeStage === 'offer' && (status === 'offer' || status === 'offer_sent')) ||
               (activeStage === 'hired' && (status === 'hired' || status === 'accepted')) ||
               (activeStage === 'rejected' && (status === 'rejected' || status === 'declined'));
      });

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const getStageColor = (stage) => {
    const status = stage || 'new';
    const stageColors = {
      new: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300',
      screening: 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400',
      interview: 'bg-warning-50 text-warning-600 dark:bg-warning-900/20 dark:text-warning-400',
      assessment: 'bg-secondary-200 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-200',
      offer: 'bg-accent-50 text-accent-700 dark:bg-accent-900/20 dark:text-accent-400',
      hired: 'bg-success-50 text-success-600 dark:bg-success-900/20 dark:text-success-400',
      rejected: 'bg-error-50 text-error-600 dark:bg-error-900/20 dark:text-error-400',
    };
    
    if (status === 'pending' || status === 'applied' || !status) return stageColors.new;
    if (status === 'screening' || status === 'reviewing') return stageColors.screening;
    if (status === 'interview' || status === 'interview_scheduled') return stageColors.interview;
    if (status === 'assessment' || status === 'testing') return stageColors.assessment;
    if (status === 'offer' || status === 'offer_sent') return stageColors.offer;
    if (status === 'hired' || status === 'accepted') return stageColors.hired;
    if (status === 'rejected' || status === 'declined') return stageColors.rejected;
    
    return stageColors.new;
  };

  const getStageLabel = (status) => {
    if (!status || status === 'pending' || status === 'applied') return 'New';
    if (status === 'screening' || status === 'reviewing') return 'Screening';
    if (status === 'interview' || status === 'interview_scheduled') return 'Interview';
    if (status === 'assessment' || status === 'testing') return 'Assessment';
    if (status === 'offer' || status === 'offer_sent') return 'Offer';
    if (status === 'hired' || status === 'accepted') return 'Hired';
    if (status === 'rejected' || status === 'declined') return 'Rejected';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="card bg-background dark:bg-[#13182E] border border-border">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-1/4"></div>
            <div className="h-10 bg-surface-200 dark:bg-surface-700 rounded"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-surface-200 dark:bg-surface-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-background dark:bg-[#13182E] border border-border overflow-hidden relative">
      <div className="absolute top-4 right-4 z-10">
        <ComponentAIAssistant
          componentName="Candidate Pipeline"
          componentData={{
            activeStage,
            totalCandidates: applications.length,
            stageCounts,
            filteredCandidates: filteredCandidates.length
          }}
          position="top-right"
        />
      </div>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-text-primary dark:text-white mb-3 sm:mb-0">Candidate Pipeline</h3>
          <div className="flex items-center space-x-2">
            <button className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-100 dark:hover:bg-surface-700 transition-smooth">
              <Icon name="Filter" size={16} />
            </button>
            <button className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-100 dark:hover:bg-surface-700 transition-smooth">
              <Icon name="SlidersHorizontal" size={16} />
            </button>
          </div>
        </div>
        
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 min-w-max pb-2">
            {stages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center whitespace-nowrap transition-smooth ${
                  activeStage === stage.id
                    ? 'bg-primary-50 text-primary dark:bg-primary-900/20 dark:text-primary-400' 
                    : 'text-text-secondary hover:bg-surface-100 hover:text-text-primary dark:hover:bg-surface-700 dark:text-gray-400'
                }`}
              >
                <span>{stage.label}</span>
                <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                  activeStage === stage.id 
                    ? 'bg-primary-100 dark:bg-primary-900/40' 
                    : 'bg-background dark:bg-surface-800'
                }`}>
                  {stage.count}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border dark:divide-gray-700">
              <thead className="bg-surface-100 dark:bg-surface-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">
                    Position
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">
                    Applied
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">
                    Stage
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-background dark:bg-[#13182E] divide-y divide-border dark:divide-gray-700">
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <Icon name="Users" size={48} className="mx-auto mb-4 text-secondary-300 dark:text-gray-600" />
                      <h3 className="text-lg font-medium text-text-primary dark:text-white mb-1">No candidates found</h3>
                      <p className="text-text-secondary dark:text-gray-400">Try adjusting your filters or search criteria</p>
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((application) => {
                    const candidate = application.user || {};
                    const job = application.job || {};
                    const avatarUrl = candidate.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name || candidate.email || 'User')}&background=random`;
                    
                    return (
                      <tr key={application.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-smooth">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <Image 
                                src={avatarUrl} 
                                alt={candidate.name || 'Candidate'} 
                                className="h-10 w-10 rounded-full"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-text-primary dark:text-white">
                                {candidate.name || candidate.email || 'Unknown'}
                              </div>
                              <div className="text-xs text-text-secondary dark:text-gray-400">
                                {candidate.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-text-primary dark:text-white">{job.title || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-text-secondary dark:text-gray-400">
                            {formatDate(application.applied_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(application.status)}`}>
                            {getStageLabel(application.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="text-text-secondary hover:text-primary dark:hover:text-primary-400 transition-smooth">
                              <Icon name="Mail" size={16} />
                            </button>
                            <button className="text-text-secondary hover:text-primary dark:hover:text-primary-400 transition-smooth">
                              <Icon name="Calendar" size={16} />
                            </button>
                            <button className="text-text-secondary hover:text-primary dark:hover:text-primary-400 transition-smooth">
                              <Icon name="MoreVertical" size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatePipeline;
