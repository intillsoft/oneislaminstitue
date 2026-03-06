import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { jobService } from '../../../services/jobService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const CourseManagementTable = ({ onEdit, onDuplicate }) => {
  const { user, profile } = useAuthContext();
  const { success, error: showError } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('datePosted');
  const [sortDirection, setSortDirection] = useState('desc');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      loadJobs();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      // Fetch courses created by the instructor
      const result = await jobService.getAll({ 
        pageSize: 100,
        ...(profile?.role !== 'admin' && { instructorId: user.id }),
        role: profile?.role
      });
      setJobs(result.data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
      showError('Failed to load academic cluster');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (job) => {
    try {
      const currentStatus = job.status || 'active';
      await jobService.toggleCourseStatus(job.id, currentStatus);
      success(`Course ${currentStatus === 'active' ? 'unpublished' : 'published'} successfully.`);
      loadJobs(); // Reload to reflect changes
    } catch (error) {
      console.error('Error toggling status:', error);
      showError('Failed to change course status.');
    }
  };

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         (job?.subject_area || job?.industry || '')?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const jobStatus = job.status || 'active';
    const matchesStatus = statusFilter === 'all' || jobStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  // Sort jobs
  const sortedJobs = [...filteredJobs]?.sort((a, b) => {
    let aValue = a?.[sortBy === 'datePosted' ? 'created_at' : sortBy];
    let bValue = b?.[sortBy === 'datePosted' ? 'created_at' : sortBy];
    
    if (aValue === null) return 1;
    if (bValue === null) return -1;
    
    if (sortBy === 'datePosted') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (typeof aValue === 'string') {
      aValue = aValue?.toLowerCase();
      bValue = bValue?.toLowerCase();
    }
    
    return sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
  });
  
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse h-24 bg-surface-elevated dark:bg-white/5 rounded-[2rem] border border-border dark:border-white/5"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Control Matrix */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Query Registry..."
            className="w-full bg-surface-elevated dark:bg-white/5 border border-border dark:border-white/10 rounded-2xl pl-12 pr-6 py-3.5 text-xs font-bold text-text-primary outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-surface-elevated dark:bg-white/5 border border-border dark:border-white/10 rounded-2xl px-6 py-3.5 text-xs font-black uppercase tracking-widest text-text-secondary outline-none appearance-none cursor-pointer hover:bg-surface transition-all"
        >
          <option value="all">Global Status</option>
          <option value="active">Active Cell</option>
          <option value="draft">Draft State</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Course List - Modern Card View */}
      <div className="space-y-4">
        <AnimatePresence>
          {sortedJobs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center bg-surface-elevated dark:bg-white/5 rounded-[2.5rem] border border-dashed border-border dark:border-white/10"
            >
              <Icon name="Database" size={48} className="mx-auto text-text-muted mb-4 opacity-20" />
              <p className="text-text-muted font-black uppercase tracking-widest text-[10px]">Registry is currently vacant</p>
            </motion.div>
          ) : (
            sortedJobs.map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative p-6 bg-surface-elevated dark:bg-white/5 border border-border dark:border-white/10 rounded-[2rem] hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-600 border border-emerald-600/20">
                      <Icon name="BookOpen" size={24} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-text-primary group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 mt-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                          <Icon name="GraduationCap" size={12} /> {job.subject_area || job.industry || 'General Science'}
                        </span>
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                          <Icon name="Clock" size={12} /> {job.created_at ? formatDistanceToNow(new Date(job.created_at), { addSuffix: true }) : 'Recently'}
                        </span>
                        {(job.salary_min > 0 || job.price > 0) && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/5 px-2 py-0.5 rounded-lg border border-emerald-500/10 uppercase tracking-widest flex items-center gap-1.5">
                            <Icon name="Sparkles" size={10} /> ${job.salary_min || job.price}{job.salary_max > 0 ? ` - $${job.salary_max}` : '+'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                    <div className={`px-4 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${
                      (job.status || 'active') === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-text-muted/10 text-text-muted border-text-muted/20'
                    }`}>
                      <div className={`w-1 h-1 rounded-full animate-pulse ${ (job.status || 'active') === 'active' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                      {job.status || 'active'}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(job)}
                        className={`p-3 bg-white dark:bg-white/5 rounded-xl transition-all border border-border dark:border-white/10 shadow-xl shadow-black/5 ${
                          (job.status || 'active') === 'active' || job.status === 'published' 
                            ? 'text-amber-500 hover:bg-amber-500 hover:text-white' 
                            : 'text-emerald-500 hover:bg-emerald-500 hover:text-white'
                        }`}
                        title={(job.status || 'active') === 'active' || job.status === 'published' ? "Unpublish Course" : "Publish Course"}
                      >
                        <Icon name={(job.status || 'active') === 'active' || job.status === 'published' ? "EyeOff" : "Eye"} size={14} />
                      </button>
                      <button
                        onClick={() => onEdit?.(job)}
                        className="p-3 bg-white dark:bg-white/5 text-text-muted rounded-xl hover:bg-emerald-600 hover:text-white transition-all border border-border dark:border-white/10 shadow-xl shadow-black/5"
                        title="Edit Curriculum"
                      >
                        <Icon name="Edit" size={14} />
                      </button>
                      <button
                        onClick={() => onDuplicate?.(job)}
                        className="p-3 bg-white dark:bg-white/5 text-text-muted rounded-xl hover:bg-workflow-primary hover:text-white transition-all border border-border dark:border-white/10 shadow-xl shadow-black/5"
                        title="Duplicate Structure"
                      >
                        <Icon name="Copy" size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CourseManagementTable;
