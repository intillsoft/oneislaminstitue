import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { enrollmentService } from '../../../services/applicationService';
import { progressService } from '../../../services/progressService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { formatDistanceToNow } from 'date-fns';
import ComponentAIAssistant from '../../../components/ui/ComponentAIAssistant';

const ApplicationTracker = () => {
  const { user } = useAuthContext();
  const { error: showError } = useToast();
  const navigate = useNavigate();

  const [filter, setFilter] = useState('all');
  const [applications, setApplications] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadApplications();
    } else {
      setLoading(false);
    }
  }, [user, filter]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const [apps, prog] = await Promise.all([
        enrollmentService.getAll({ status: filter === 'all' ? null : filter }),
        progressService.getAll().catch(e => {
          console.warn('Progress service failed to load, falling back gracefully:', e);
          return [];
        })
      ]);
      setApplications(apps || []);
      
      const progMap = {};
      (prog || []).forEach(p => {
        progMap[p.course_id] = p;
      });
      setProgressData(progMap);
    } catch (error) {
      console.error('Error loading enrollments:', error);
      showError('Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white border border-[var(--color-card-border)] rounded-xl p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-xl bg-[var(--color-bg-secondary)] flex items-center justify-center mx-auto mb-4">
            <Icon name="FileText" className="w-10 h-10 text-[var(--color-text-tertiary)]" />
          </div>
          <p className="text-[var(--color-text-secondary)] mb-6">Sign in to track your applications</p>
          <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-hover)] transition-all font-bold">
            <Icon name="LogIn" size={18} />
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const getStatusInfo = (status) => {
    const statusMap = {
      applied:   { icon: 'BookOpen',     color: 'var(--color-primary)',  bgColor: 'var(--color-info-bg)' },
      enrolled:  { icon: 'BookOpen',     color: 'var(--color-primary)',  bgColor: 'var(--color-info-bg)' },
      reviewed:  { icon: 'CheckCircle',  color: 'var(--color-warning)', bgColor: 'var(--color-warning-bg)' },
      active:    { icon: 'Zap',          color: 'var(--color-stat-border-4)', bgColor: '#F3EFFA' },
      offer:     { icon: 'Award',        color: 'var(--color-success)', bgColor: 'var(--color-success-bg)' },
      completed: { icon: 'Award',        color: 'var(--color-success)', bgColor: 'var(--color-success-bg)' },
      rejected:  { icon: 'XCircle',      color: 'var(--color-text-tertiary)', bgColor: 'var(--color-bg-secondary)' },
    };
    return statusMap[status] || statusMap.applied;
  };

  const getStatusText = (status) => {
    const statusTextMap = {
      applied: 'Enrolled',
      enrolled: 'Enrolled',
      reviewed: 'In Progress',
      active: 'In Progress',
      interview: 'Assessment',
      offer: 'Completed',
      completed: 'Completed',
      rejected: 'Audit Only',
    };
    return statusTextMap[status] || status;
  };

  const filteredApplications = filter === 'all'
    ? applications
    : applications?.filter(app => app?.status === filter);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse h-32 bg-white rounded-xl border border-[var(--color-card-border)]"></div>
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white border border-[var(--color-card-border)] rounded-xl p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-xl bg-[var(--color-bg-secondary)] flex items-center justify-center mx-auto mb-4">
            <Icon name="FileText" className="w-10 h-10 text-[var(--color-text-tertiary)]" />
          </div>
          <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">No enrollments yet</h3>
          <p className="text-[var(--color-text-tertiary)] mb-6">Start enrolling in courses to track your progress</p>
          <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-hover)] transition-all font-bold">
            <Icon name="Search" size={18} />
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-visible space-y-6">
      <div className="absolute -top-2 -right-2 z-50">
        <ComponentAIAssistant
          componentName="Enrollment Tracker"
          componentData={{
            totalEnrollments: applications.length,
            filteredEnrollments: filteredApplications.length,
            filter,
            statusBreakdown: {
              active: applications.filter(a => a.status === 'applied').length,
              reviewed: applications.filter(a => a.status === 'reviewed').length,
              interview: applications.filter(a => a.status === 'interview').length,
              offer: applications.filter(a => a.status === 'offer').length,
              rejected: applications.filter(a => a.status === 'rejected').length
            }
          }}
          position="top-right"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'applied', 'active', 'completed', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${filter === status
              ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
              : 'bg-white text-[var(--color-text-tertiary)] border-[var(--color-card-border)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] hover:border-[var(--color-border-secondary)]'
              } tracking-wide`}
          >
            {status === 'all' ? 'All' : status === 'applied' ? 'Active' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {filteredApplications.map((application) => {
          const job = application.job || {};
          const statusInfo = getStatusInfo(application.status);
          const prog = progressData[job.id];
          const hasStarted = prog && prog.last_activity_at;

          return (
            <div
              key={application.id}
              className="group relative overflow-hidden rounded-xl bg-white border border-[var(--color-card-border)] hover:border-[var(--color-border-secondary)] transition-all duration-150 hover:-translate-y-0.5 p-6 sm:p-8"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 md:gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    {job.logo ? (
                      <div className="w-11 h-11 rounded-lg border border-[var(--color-card-border)] overflow-hidden flex-shrink-0">
                        <Image
                          src={job.logo}
                          alt={job.company}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-[var(--color-bg-secondary)] flex items-center justify-center flex-shrink-0">
                        <Icon name="Briefcase" className="w-5 h-5 text-[var(--color-text-tertiary)]" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/courses/detail/${job.id}`}
                        className="text-base md:text-lg font-bold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors block truncate"
                      >
                        {job.title}
                      </Link>
                      <p className="text-xs md:text-sm font-medium text-[var(--color-text-tertiary)] mt-0.5">{job.company}</p>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2 text-xs font-medium text-[var(--color-text-tertiary)]">
                        <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--color-bg-secondary)]">
                          <Icon name="MapPin" size={12} />
                          {job.location}
                        </span>
                        {application.applied_at && (
                          <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--color-bg-secondary)]">
                            <Icon name="Clock" size={12} />
                            <span className="hidden sm:inline">Enrolled {formatDistanceToNow(new Date(application.applied_at), { addSuffix: true })}</span>
                            <span className="sm:hidden">{formatDistanceToNow(new Date(application.applied_at), { addSuffix: true })}</span>
                          </span>
                        )}
                      </div>
                      
                      {/* Progress bar */}
                      <div className="mt-4 max-w-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">{Math.round(prog?.completion_percentage || 0)}% Completed</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[var(--color-bg-secondary)] overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${prog?.completion_percentage || 0}%`,
                              backgroundColor: prog?.completion_percentage === 100 ? 'var(--color-success)' : 'var(--color-primary)'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:items-end">
                  <div 
                    className="px-3 py-1.5 rounded-md text-xs flex items-center gap-2 border border-transparent"
                    style={{ backgroundColor: statusInfo.bgColor }}
                  >
                    <Icon name={statusInfo.icon} size={12} style={{ color: statusInfo.color }} />
                    <span className="font-bold uppercase tracking-wide" style={{ color: statusInfo.color }}>
                      {getStatusText(application.status)}
                    </span>
                  </div>
                  <Link
                    to={application.status === 'completed' || application.status === 'offer' ? `/courses/detail/${job.id}` : hasStarted ? `/courses/${job.id}/learn` : `/courses/${job.id}/onboarding`}
                    className="mt-2 px-4 py-2 rounded-md text-xs font-bold bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <span className="hidden sm:inline">{application.status === 'completed' || application.status === 'offer' ? 'Review Course' : hasStarted ? 'Continue Learning' : 'Start Learning'}</span>
                    <span className="sm:hidden">{application.status === 'completed' || application.status === 'offer' ? 'Review' : hasStarted ? 'Continue' : 'Start'}</span>
                    <Icon name={application.status === 'completed' || application.status === 'offer' ? 'CheckCircle' : 'PlayCircle'} size={14} />
                  </Link>
                </div>
              </div>
              {application.notes && (
                <div className="mt-4 pt-4 border-t border-[var(--color-card-border)]">
                  <p className="text-[11px] md:text-sm italic font-medium text-[var(--color-text-tertiary)] line-clamp-2">"{application.notes}"</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationTracker;
