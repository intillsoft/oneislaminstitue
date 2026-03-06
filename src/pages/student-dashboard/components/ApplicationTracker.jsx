import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { EliteCard, EliteProgressBar } from '../../../components/ui/EliteCard';
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
      <EliteCard>
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-2xl bg-surface-elevated dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Icon name="FileText" className="w-10 h-10 text-text-muted dark:text-slate-600 transition-colors" />
          </div>
          <p className="text-text-secondary dark:text-slate-400 mb-6">Sign in to track your applications</p>
          <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-workflow-primary text-white rounded-xl hover:bg-workflow-primary/90 transition-all font-semibold shadow-lg shadow-workflow-primary/20">
            <Icon name="LogIn" size={18} />
            Sign In
          </Link>
        </div>
      </EliteCard>
    );
  }

  const getStatusInfo = (status) => {
    const statusMap = {
      applied: { icon: 'BookOpen', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
      enrolled: { icon: 'BookOpen', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
      reviewed: { icon: 'CheckCircle', color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
      active: { icon: 'Zap', color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
      offer: { icon: 'Award', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
      completed: { icon: 'Award', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
      rejected: { icon: 'XCircle', color: 'text-slate-500', bgColor: 'bg-slate-500/10' },
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
          <div key={i} className="animate-pulse h-32 bg-surface dark:bg-bg rounded-2xl border border-emerald-500/20"></div>
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <EliteCard>
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-2xl bg-surface-elevated dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Icon name="FileText" className="w-10 h-10 text-text-muted dark:text-slate-600 transition-colors" />
          </div>
          <h3 className="text-xl font-black text-text-primary dark:text-white mb-2">No enrollments yet</h3>
          <p className="text-text-secondary dark:text-slate-400 mb-6">Start enrolling in courses to track your progress</p>
          <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-workflow-primary text-white rounded-xl hover:bg-workflow-primary/90 transition-all font-semibold shadow-lg shadow-workflow-primary/20">
            <Icon name="Search" size={18} />
            Browse Courses
          </Link>
        </div>
      </EliteCard>
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
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all border shadow-sm ${filter === status
              ? 'bg-slate-900 dark:bg-emerald-600 text-white border-slate-900 dark:border-emerald-500/60 shadow-md'
              : 'bg-white dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-slate-800'
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
              className="group relative overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1 p-6 sm:p-8"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 md:gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    {job.logo ? (
                      <div className="w-11 h-11 rounded-lg border border-emerald-500/20 overflow-hidden flex-shrink-0">
                        <Image
                          src={job.logo}
                          alt={job.company}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-surface-elevated dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                        <Icon name="Briefcase" className="w-5 h-5 text-text-muted dark:text-slate-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/courses/detail/${job.id}`}
                        className="text-base md:text-lg font-bold text-text-primary dark:text-white hover:text-emerald-600 transition-colors block truncate"
                      >
                        {job.title}
                      </Link>
                      <p className="text-xs md:text-sm font-semibold text-text-muted dark:text-slate-400 mt-0.5">{job.company}</p>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2 text-xs font-medium text-text-muted dark:text-slate-400">
                        <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-elevated dark:bg-white/5">
                          <Icon name="MapPin" size={12} />
                          {job.location}
                        </span>
                        {application.applied_at && (
                          <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-elevated dark:bg-white/5">
                            <Icon name="Clock" size={12} />
                            <span className="hidden sm:inline">Enrolled {formatDistanceToNow(new Date(application.applied_at), { addSuffix: true })}</span>
                            <span className="sm:hidden">{formatDistanceToNow(new Date(application.applied_at), { addSuffix: true })}</span>
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-4 max-w-sm">
                        <EliteProgressBar
                          value={prog?.completion_percentage || 0}
                          label={`${Math.round(prog?.completion_percentage || 0)}% Completed`}
                          color={prog?.completion_percentage === 100 ? 'green' : 'emerald'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:items-end">
                  <div className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 border ${statusInfo.bgColor} border-transparent`}>
                    <Icon name={statusInfo.icon} size={12} className={statusInfo.color} />
                    <span className={`font-bold uppercase tracking-wide ${statusInfo.color}`}>
                      {getStatusText(application.status)}
                    </span>
                  </div>
                  <Link
                    to={application.status === 'completed' || application.status === 'offer' ? `/courses/detail/${job.id}` : hasStarted ? `/courses/${job.id}/learn` : `/courses/${job.id}/onboarding`}
                    className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
                  >
                    <span className="hidden sm:inline">{application.status === 'completed' || application.status === 'offer' ? 'Review Course' : hasStarted ? 'Continue Learning' : 'Start Learning'}</span>
                    <span className="sm:hidden">{application.status === 'completed' || application.status === 'offer' ? 'Review' : hasStarted ? 'Continue' : 'Start'}</span>
                    <Icon name={application.status === 'completed' || application.status === 'offer' ? 'CheckCircle' : 'PlayCircle'} size={14} />
                  </Link>
                </div>
              </div>
              {application.notes && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                  <p className="text-[11px] md:text-sm italic font-medium text-slate-500 dark:text-slate-400 line-clamp-2">"{application.notes}"</p>
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
