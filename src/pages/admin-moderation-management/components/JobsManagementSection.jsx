import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../../components/ui/Toast';
import { EliteCard } from '../../../components/ui/EliteCard';
import { formatDistanceToNow } from 'date-fns';

const JobsManagementSection = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadCourses();
  }, [filterStatus]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;
      if (error) throw error;

      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
      showError('Failed to synchronize curriculum matrix');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (courseId, newStatus) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', courseId);

      if (error) throw error;
      success(`Curriculum status updated to ${newStatus}`);
      loadCourses();
    } catch (error) {
      showError('Failed to propagate domain changes');
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to decommission this curriculum?')) return;
    try {
      const { error } = await supabase.from('jobs').delete().eq('id', courseId);
      if (error) throw error;
      success('Curriculum decommissioned successfully');
      loadCourses();
    } catch (error) {
      showError('Failed to decommission course');
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Academic Governance</h2>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 mt-1">Curator Team Access & Authorization Registry</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Icon name="Search" size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text"
              placeholder="Query Curriculum..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 pl-12 pr-6 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-full sm:w-72 transition-all"
            />
          </div>
          <button 
            onClick={() => navigate('/instructor/courses/new')}
            className="h-12 px-8 bg-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-emerald-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/10"
          >
            <Icon name="Plus" size={16} />
            Architect Course
          </button>
        </div>
      </div>

      {/* Course Matrix Table */}
      <EliteCard className="border-white/5 bg-white/[0.01] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Academic Structure</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Pedagogy</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">State Control</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Deployment</th>
                <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-8 py-8 h-24"><div className="w-full h-full bg-white/5 rounded-2xl" /></td>
                  </tr>
                ))
              ) : filteredCourses.length === 0 ? (
                <tr>
                   <td colSpan="5" className="px-8 py-24 text-center">
                    <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-6">
                      <Icon name="FileQuestion" size={32} className="text-slate-600" />
                    </div>
                    <h3 className="text-sm font-black text-slate-600 uppercase tracking-widest italic">Curriculum Matrix is Empty</h3>
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="group hover:bg-white/[0.02] transition-premium">
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-[1.25rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                          <Icon name="Book" size={24} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-white group-hover:text-emerald-500 transition-colors uppercase tracking-tight truncate">{course.title}</div>
                          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-1">{course.company || 'One Islam Institute'} • {course.industry || 'Sacred Knowledge'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="inline-flex px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        {course.employment_type?.replace('-', ' ') || 'Traditional'}
                      </div>
                    </td>
                    <td className="px-8 py-8">
                       <select 
                        value={course.status || 'active'}
                        onChange={(e) => handleStatusChange(course.id, e.target.value)}
                        className={`text-[10px] font-black uppercase tracking-widest bg-transparent focus:outline-none cursor-pointer pb-1 border-b border-white/5
                          ${course.status === 'active' || course.status === 'published' ? 'text-emerald-500/80' : 'text-slate-500'}`}
                      >
                        <option value="active">Active</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </td>
                    <td className="px-8 py-8">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {course.created_at ? formatDistanceToNow(new Date(course.created_at), { addSuffix: true }).toUpperCase() : 'UNKNOWN'}
                      </div>
                    </td>
                    <td className="px-8 py-8 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-premium translate-x-4 group-hover:translate-x-0">
                        <button 
                          onClick={() => navigate(`/courses/detail/${course.id}`)}
                          className="p-3 bg-white/5 border border-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                          <Icon name="Eye" size={18} />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(course.id, course.status === 'active' ? 'draft' : 'active')}
                          className="p-3 bg-white/5 border border-white/5 rounded-2xl text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all"
                        >
                          <Icon name="Power" size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(course.id)}
                          className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-500/10"
                        >
                          <Icon name="Trash2" size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </EliteCard>
    </div>
  );
};

export default JobsManagementSection;
