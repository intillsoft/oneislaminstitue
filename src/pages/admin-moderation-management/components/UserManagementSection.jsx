import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../../components/ui/Toast';
import { EliteCard } from '../../../components/ui/EliteCard';

const UserManagementSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success, error: showError } = useToast();

  useEffect(() => {
    loadUsers();
  }, [filterRole]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterRole !== 'all') {
        query = query.eq('role', filterRole);
      }

      const { data, error } = await query;
      if (error) throw error;

      setUsers(data || []);
    } catch (err) {
      console.error('Error loading users:', err);
      showError('Failed to synchronize userbase');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;
      success(`Entity role updated to ${newRole}`);
      loadUsers();
    } catch (err) {
      showError('Authorization update failed');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Scholarly Directory</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">Management of Platform Citizens & Curator Team</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative group">
            <Icon name="Search" size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text"
              placeholder="Query Identity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 pl-10 pr-6 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all w-full sm:w-64"
            />
          </div>
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="h-11 px-6 rounded-xl bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-widest text-slate-300 focus:outline-none cursor-pointer hover:bg-white/10"
          >
            <option value="all">Global Filter</option>
            <option value="student">Students</option>
            <option value="instructor">Instructors</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Stats Mini Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
          <span className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Population</span>
          <span className="text-2xl font-black text-white tracking-tighter italic">{users.length}</span>
        </div>
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
          <span className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Active Instructors</span>
          <span className="text-2xl font-black text-blue-500 tracking-tighter italic">{users.filter(u => u.role === 'instructor' || u.role === 'recruiter').length}</span>
        </div>
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
          <span className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Academic Trustees</span>
          <span className="text-2xl font-black text-emerald-500 tracking-tighter italic">{users.filter(u => u.role === 'admin').length}</span>
        </div>
      </div>

      {/* Interactive Table */}
      <EliteCard className="border-white/5 bg-white/[0.01] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Identity</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Authorization</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Joined Cycle</th>
                <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Orchestration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="4" className="px-8 py-6 h-20"><div className="w-full h-full bg-white/5 rounded-xl" /></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                   <td colSpan="4" className="px-8 py-20 text-center">
                    <div className="text-sm font-black text-slate-600 uppercase tracking-widest italic">Identity Query Returned Null</div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="group hover:bg-white/[0.02] transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                          <Image src={u.avatar_url || `https://ui-avatars.com/api/?name=${u.name}&background=random`} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-white italic group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{u.name}</div>
                          <div className="text-[10px] font-bold text-slate-500 tracking-wide mt-0.5">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <select 
                        value={u.role}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                        className="bg-transparent text-[10px] font-black uppercase tracking-widest text-emerald-500 focus:outline-none cursor-pointer border-b border-white/10 pb-1"
                      >
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(u.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-premium translate-x-4 group-hover:translate-x-0">
                        <button className="p-3 bg-white/5 border border-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                          <Icon name="Eye" size={16} />
                        </button>
                        <button className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                          <Icon name="UserX" size={16} />
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

export default UserManagementSection;
