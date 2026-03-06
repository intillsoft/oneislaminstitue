import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { jobService } from '../../../services/jobService';
import { applicationService } from '../../../services/applicationService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useToast } from '../../../components/ui/Toast';

import { EliteCard } from '../../../components/ui/EliteCard';

const JobPerformanceTable = () => {
  const [sortField, setSortField] = useState('views');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filter, setFilter] = useState('all');
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, profile, userRole } = useAuthContext();
  const { error: showError } = useToast();

  useEffect(() => {
    const isAuthorized = userRole === 'instructor' || userRole === 'recruiter' || userRole === 'admin';
    if (user && isAuthorized) {
      loadJobs();
    }
  }, [user, userRole]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const result = await jobService.getAll({ 
        pageSize: 100,
        ...(userRole !== 'admin' && { instructorId: user.id }),
        role: userRole
      });

      const coursesWithMetrics = await Promise.all(
        (result.data || []).map(async (course) => {
          try {
            const { count: enrollmentsCount } = await supabase
              .from('applications')
              .select('*', { count: 'exact', head: true })
              .eq('course_id', course.id);

            return {
              id: course.id,
              title: course.title,
              department: course.industry || 'General',
              location: course.location || 'Remote',
              posted: course.created_at ? new Date(course.created_at).toISOString().split('T')[0] : '',
              status: course.status || 'active',
              views: course.views_count || 0,
              applications: enrollmentsCount || 0,
              conversionRate: enrollmentsCount > 0 ? ((enrollmentsCount / (course.views_count || 1)) * 100).toFixed(1) : 0,
              academicValue: 'High'
            };
          } catch {
            return {
              id: course.id,
              title: course.title,
              department: course.industry || 'General',
              status: course.status || 'active',
              views: 0,
              applications: 0,
              conversionRate: 0
            };
          }
        })
      );

      setJobsData(coursesWithMetrics);
    } catch (error) {
      console.error('Error loading courses:', error);
      showError('Failed to load course performance matrix');
      setJobsData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredJobs = filter === 'all'
    ? jobsData
    : jobsData?.filter(job => job?.status === filter);

  const sortedJobs = [...filteredJobs]?.sort((a, b) => {
    const valA = a?.[sortField];
    const valB = b?.[sortField];
    return sortDirection === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <EliteCard className="overflow-hidden border-border bg-bg/20">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between p-8 gap-6">
        <div>
          <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-1">Academic Matrix</h3>
          <h2 className="text-xl font-black text-text-primary uppercase tracking-tight">Active Course Cluster</h2>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          <div className="relative group">
            <select
              value={filter}
              onChange={(e) => setFilter(e?.target?.value)}
              className="appearance-none bg-surface-elevated border border-border dark:border-white/5 rounded-xl py-2 pl-4 pr-10 text-[10px] font-black uppercase tracking-widest text-text-secondary outline-none focus:ring-1 focus:ring-workflow-primary/50 transition-all cursor-pointer"
            >
              <option value="all">System: All Courses</option>
              <option value="active">Active Cluster</option>
              <option value="expired">Archived</option>
              <option value="draft">Review State</option>
            </select>
            <Icon name="ChevronDown" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none group-hover:text-text-primary transition-colors" />
          </div>

          <div className="relative flex-1 xl:w-64">
            <Icon name="Search" size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="QUERIES..."
              className="w-full bg-surface-elevated border border-border dark:border-white/5 rounded-xl py-2 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-text-primary outline-none focus:ring-1 focus:ring-workflow-primary/50 transition-all placeholder:text-text-muted/50"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface border-y border-border dark:border-white/5">
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Course Specification</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Academic Status</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted cursor-pointer hover:text-text-primary transition-colors" onClick={() => handleSort('views')}>
                <div className="flex items-center gap-2">Views {sortField === 'views' && <Icon name={sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={10} />}</div>
              </th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted cursor-pointer hover:text-text-primary transition-colors" onClick={() => handleSort('applications')}>
                <div className="flex items-center gap-2">Enrollments {sortField === 'applications' && <Icon name={sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={10} />}</div>
              </th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hidden lg:table-cell">Completion Rate</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hidden xl:table-cell">Academic Value</th>
              <th className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan="7" className="px-8 py-6"><div className="h-4 bg-white/5 rounded-full w-full" /></td>
                </tr>
              ))
            ) : sortedJobs?.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-8 py-20 text-center">
                  <Icon name="Database" size={40} className="mx-auto mb-4 text-text-muted opacity-20" />
                  <h3 className="text-sm font-black text-text-muted uppercase tracking-[0.2em]">Zero Results Identified</h3>
                </td>
              </tr>
            ) : (
              sortedJobs?.map((job) => (
                <tr key={job?.id} className="hover:bg-workflow-primary/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-text-primary uppercase tracking-tight mb-1 group-hover:text-workflow-primary transition-colors">{job?.title}</div>
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{job?.department} • {job?.location}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${job?.status === 'active'
                      ? 'bg-workflow-primary/10 text-workflow-primary border-workflow-primary/20'
                      : job?.status === 'expired'
                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                        : 'bg-text-muted/10 text-text-muted border-text-muted/20'
                      }`}>
                      <div className={`w-1 h-1 rounded-full mr-2 ${job?.status === 'active' ? 'bg-workflow-primary animate-pulse' : 'bg-current'}`} />
                      {job?.status}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-text-primary">{job?.views?.toLocaleString()}</td>
                  <td className="px-8 py-6 text-sm font-black text-text-primary">{job?.applications}</td>
                  <td className="px-8 py-6 text-sm font-black text-text-secondary hidden lg:table-cell">{job?.conversionRate}%</td>
                  <td className="px-8 py-6 text-sm font-black text-text-secondary hidden xl:table-cell">{job?.academicValue}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                      <Link to={`/courses/detail/${job?.id}`} target="_blank" className="p-2 bg-surface text-text-muted rounded-lg hover:bg-workflow-primary hover:text-white transition-all border border-border shadow-xl flex items-center justify-center">
                        <Icon name="Eye" size={14} />
                      </Link>
                      <Link to="/instructor/courses" className="p-2 bg-surface text-text-muted rounded-lg hover:bg-emerald-600 hover:text-white transition-all border border-border shadow-xl flex items-center justify-center">
                        <Icon name="Edit" size={14} />
                      </Link>
                      <button className="p-2 bg-surface text-text-muted rounded-lg hover:bg-rose-600 hover:text-white transition-all border border-border shadow-xl flex items-center justify-center">
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-8 py-6 flex items-center justify-between border-t border-border bg-surface/10">
        <div className="text-[10px] font-black uppercase tracking-widest text-text-muted">
          Showing <span className="text-text-primary">{sortedJobs?.length}</span> Nodes In Current Cluster
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-workflow-primary/10 transition-all border border-border disabled:opacity-20">
            <Icon name="ChevronLeft" size={16} />
          </button>
          <button className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-workflow-primary/10 transition-all border border-border disabled:opacity-20">
            <Icon name="ChevronRight" size={16} />
          </button>
        </div>
      </div>
    </EliteCard>
  );
};

export default JobPerformanceTable;