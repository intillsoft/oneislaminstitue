import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { talentService } from '../../services/talentService';
import Breadcrumb from 'components/ui/Breadcrumb';
import UnifiedSidebar from '../../components/ui/UnifiedSidebar';
import { EliteCard, ElitePageHeader } from '../../components/ui/EliteCard';

const TalentGigsList = () => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [gigs, setGigs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    loadGigs();
  }, [filter]);

  const loadGigs = async () => {
    try {
      setLoading(true);
      const data = await talentService.getGigs({ is_active: filter === 'all' ? null : filter === 'active' });
      setGigs(data || []);
    } catch (error) {
      console.error('Error loading gigs:', error);
      showError('Failed to load gigs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGig = async (gigId) => {
    if (!window.confirm('Are you sure you want to delete this gig?')) return;

    try {
      await talentService.deleteGig(gigId);
      success('Gig deleted successfully!');
      loadGigs();
    } catch (error) {
      console.error('Error deleting gig:', error);
      showError('Failed to delete gig');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <UnifiedSidebar isCollapsed={isSidebarCollapsed} onCollapseChange={setIsSidebarCollapsed} />
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-[260px]'} min-h-screen flex items-center justify-center`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workflow-primary mx-auto mb-4"></div>
            <p className="text-text-muted font-black uppercase tracking-widest text-[10px]">Loading Nodes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg transition-all duration-300">
      <UnifiedSidebar isCollapsed={isSidebarCollapsed} onCollapseChange={setIsSidebarCollapsed} />
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-[260px]'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />

          <ElitePageHeader
            title="My Gigs"
            description="Manage your high-impact service offerings"
            className="mb-12"
          >
            <Link
              to="/talent/gigs/create"
              className="flex items-center gap-2 px-6 py-3 bg-workflow-primary text-white rounded-xl hover:bg-workflow-primary/80 transition-all font-black uppercase tracking-widest text-[10px] shadow-lg shadow-workflow-primary/20"
            >
              <Icon name="Plus" size={16} />
              Create New Gig
            </Link>
          </ElitePageHeader>

          {/* Filters */}
          <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-xl border border-white/5 w-fit mb-8">
            {['all', 'active', 'inactive'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === status
                    ? 'bg-workflow-primary text-white shadow-lg shadow-workflow-primary/10'
                    : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Gigs Grid */}
          {gigs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gigs.map((gig) => (
                <EliteCard
                  key={gig.id}
                  className="group relative overflow-hidden flex flex-col h-full"
                >
                  {gig.images && gig.images.length > 0 ? (
                    <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/5 mb-6 relative">
                      <img
                        src={gig.images[0]}
                        alt={gig.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${gig.is_active
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-lg'
                            : 'bg-slate-900/80 text-slate-500 border-white/10'
                          }`}>
                          {gig.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video w-full bg-slate-900 rounded-xl border border-white/5 mb-6 flex items-center justify-center relative">
                      <Icon name="Briefcase" className="w-10 h-10 text-slate-800" />
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${gig.is_active
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-slate-900/80 text-slate-500 border-white/10'
                          }`}>
                          {gig.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex-1 flex flex-col">
                    <h3 className="text-lg font-black text-white leading-tight mb-3 group-hover:text-workflow-primary transition-colors line-clamp-2 uppercase tracking-tight">
                      {gig.title}
                    </h3>
                    <p className="text-xs text-text-muted dark:text-slate-400 font-medium line-clamp-2 mb-6 leading-relaxed">
                      {gig.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/5">
                          <Icon name="Clock" size={12} className="text-workflow-primary" />
                          <span className="text-[10px] font-black text-text-muted">{gig.delivery_time}d</span>
                        </div>
                        {gig.rating > 0 && (
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/5 rounded-lg border border-amber-500/10">
                            <Icon name="Star" size={12} className="text-amber-500 fill-current" />
                            <span className="text-[10px] font-black text-amber-500">{gig.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-white tracking-tighter">
                          ${gig.price}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/talent/gigs/${gig.id}/edit`}
                        className="flex-1 p-3 bg-bg-elevated text-text-muted hover:text-text-primary hover:bg-white/5 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all border border-border dark:border-white/5 text-center"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/talent/gigs/${gig.id}`}
                        className="flex-1 p-3 bg-workflow-primary text-white hover:bg-workflow-primary/80 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all shadow-lg shadow-workflow-primary/10 text-center"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDeleteGig(gig.id)}
                        className="p-3 bg-red-500/5 text-red-500 hover:bg-red-500/20 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                      >
                        <Icon name="Trash" size={16} />
                      </button>
                    </div>
                  </div>
                </EliteCard>
              ))}
            </div>
          ) : (
            <EliteCard className="text-center py-24">
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/5">
                <Icon name="Briefcase" className="w-10 h-10 text-slate-800" />
              </div>
              <h3 className="text-xl font-black text-white mb-2 tracking-tight">Zero Gigs Detected</h3>
              <p className="text-slate-500 mb-8 font-medium">Initialize your first gig node to start earning.</p>
              <Link
                to="/talent/gigs/create"
                className="inline-flex items-center gap-2 px-8 py-4 bg-workflow-primary text-white rounded-2xl hover:bg-workflow-primary/80 transition-all font-black uppercase tracking-widest text-xs shadow-xl shadow-workflow-primary/20"
              >
                <Icon name="Plus" size={20} />
                Create Your First Gig
              </Link>
            </EliteCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default TalentGigsList;











