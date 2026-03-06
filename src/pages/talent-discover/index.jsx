import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Filter, Star, MessageSquare, User, ArrowRight,
  ChevronLeft, ChevronRight, Sliders, MapPin, DollarSign,
  Briefcase, CheckCircle2, Sparkles, X, LayoutGrid, List, Clock
} from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { talentService } from '../../services/talentService';
import { apiService } from '../../lib/api';
import Image from 'components/AppImage';
import Breadcrumb from 'components/ui/Breadcrumb';
import { formatDistanceToNow } from 'date-fns';

const formatTimeAgo = (date) => {
  if (!date) return 'recently';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return 'recently';
  }
};

const TalentDiscover = () => {
  const { user } = useAuthContext();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [talents, setTalents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    hourlyRateMin: '',
    hourlyRateMax: '',
    rating: '',
    availability: '',
    experienceLevel: '',
    language: '',
    skills: '',
  });
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    loadTalents();
  }, [filters, sortBy, searchQuery]);

  const loadTalents = async () => {
    try {
      setLoading(true);
      const data = await talentService.discoverTalents({
        search: searchQuery,
        ...filters,
        sort: sortBy,
      });
      setTalents(data?.data || data || []);
    } catch (error) {
      console.error('Error loading talents:', error);
      showError('Failed to load talents');
    } finally {
      setLoading(false);
    }
  };

  const handleMessageTalent = async (talentUserId) => {
    try {
      if (!user) {
        navigate('/login?redirect=/talent/discover');
        return;
      }
      const response = await apiService.messages.getConversation(talentUserId);
      if (response.data?.success) {
        navigate(`/messages?conversation=${response.data.data.id}`);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      showError('Failed to start conversation');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={12}
            className={`${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary dark:text-white font-sans selection:bg-workflow-primary/30">
      {/* Cinematic Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-workflow-primary/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[0%] right-[-10%] w-[40%] h-[40%] bg-workflow-accent/5 rounded-full blur-[100px]"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >

            {/* Premium Search Box */}
            <div className="max-w-2xl">
              <div className="glass-panel p-2 rounded-2xl flex items-center gap-2 group focus-within:border-workflow-primary/50 transition-all duration-500 shadow-2xl bg-bg-elevated border border-border dark:border-white/10">
                <div className="pl-4 text-slate-500 group-focus-within:text-workflow-primary transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by skill, name, or role..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-text-primary dark:text-white placeholder-text-muted/50 py-3 font-medium"
                />
                <button
                  onClick={loadTalents}
                  className="bg-workflow-primary text-white px-6 py-2.5 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-glow"
                >
                  Find Talent
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Filters Sidebar - Desktop Only */}
          <aside className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-workflow-primary" />
                  <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-text-muted">Refine Search</h3>
                </div>
                <button
                  onClick={() => setFilters({ hourlyRateMin: '', hourlyRateMax: '', rating: '', availability: '', experienceLevel: '', language: '', skills: '' })}
                  className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-workflow-primary transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* ... filters content ... */}
              <div className="space-y-8">
                {/* Hourly Rate */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Hourly Protocol (USD)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.hourlyRateMin}
                      onChange={(e) => setFilters(prev => ({ ...prev, hourlyRateMin: e.target.value }))}
                      className="bg-bg border border-border dark:border-white/10 rounded-xl px-4 py-3 text-xs focus:border-workflow-primary/50 outline-none transition-all placeholder:text-text-muted/30 font-bold"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.hourlyRateMax}
                      onChange={(e) => setFilters(prev => ({ ...prev, hourlyRateMax: e.target.value }))}
                      className="bg-bg border border-border dark:border-white/10 rounded-xl px-4 py-3 text-xs focus:border-workflow-primary/50 outline-none transition-all placeholder:text-text-muted/30 font-bold"
                    />
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Quality Assurance</label>
                  <div className="flex flex-col gap-2">
                    {[4.5, 4.0, 3.5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setFilters(prev => ({ ...prev, rating: filters.rating === rating.toString() ? '' : rating.toString() }))}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${filters.rating === rating.toString() ? 'bg-workflow-primary/10 border-workflow-primary text-workflow-primary' : 'bg-bg/50 border-border dark:border-white/10 text-text-muted hover:bg-bg-elevated'}`}
                      >
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} className={i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-800'} />
                          ))}
                        </div>
                        {rating}+ Stars
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills Tags */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Technical Arsenal</label>
                  <input
                    type="text"
                    placeholder="e.g. React, UX Design"
                    value={filters.skills}
                    onChange={(e) => setFilters(prev => ({ ...prev, skills: e.target.value }))}
                    className="w-full bg-bg border border-border dark:border-white/10 rounded-xl px-4 py-3 text-xs focus:border-workflow-primary/50 outline-none transition-all placeholder:text-text-muted/30 font-bold"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Results Area */}
          <div className="flex-1 space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h2 className="text-lg font-bold">
                {loading ? 'Scanning talent pool...' : `${talents.length} Elite Nodes Detected`}
              </h2>

              {/* Mobile Filter Toggle & Sort */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 bg-bg-elevated border border-border dark:border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-text-muted"
                  >
                    <Filter size={14} /> Filter Nodes
                  </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-bg-elevated border border-border dark:border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-text-muted outline-none focus:border-workflow-primary/50 cursor-pointer flex-1 sm:flex-none appearance-none"
                >
                  <option value="relevance">Priority: Relevance</option>
                  <option value="rating">Priority: Rating</option>
                  <option value="price_low">Value: Low to High</option>
                </select>
              </div>
            </div>

            {/* Mobile Filters Collapsible */}
            <AnimatePresence>
              {showMobileFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="lg:hidden overflow-hidden"
                >
                  <div className="glass-panel p-4 rounded-xl space-y-4 border border-white/10 bg-white/5">
                    {/* Simplified Mobile Filters Content */}
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Min Rate"
                        value={filters.hourlyRateMin}
                        onChange={(e) => setFilters(prev => ({ ...prev, hourlyRateMin: e.target.value }))}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                      />
                      <input
                        type="number"
                        placeholder="Max Rate"
                        value={filters.hourlyRateMax}
                        onChange={(e) => setFilters(prev => ({ ...prev, hourlyRateMax: e.target.value }))}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Filter by Skill..."
                      value={filters.skills}
                      onChange={(e) => setFilters(prev => ({ ...prev, skills: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-bg-elevated border border-border dark:border-white/5 h-64 rounded-[2.5rem] animate-pulse shadow-xl" />
                ))}
              </div>
            ) : talents.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
              >
                {talents.map((talent) => (
                  <motion.div
                    key={talent.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="bg-bg-elevated border border-border dark:border-white/5 p-8 rounded-[2.5rem] hover:border-workflow-primary/30 transition-all duration-500 group relative overflow-hidden flex flex-col h-full shadow-xl"
                  >
                    {/* Background Subtle Glow */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-workflow-primary/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-all duration-700" />

                    {/* Badge */}
                    <div className="absolute top-6 right-6 z-20">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-workflow-primary/10 border border-workflow-primary/20 text-workflow-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-xl backdrop-blur-md">
                        <Sparkles className="w-3 h-3 fill-workflow-primary" />
                        {(talent.matchScore || 95)}% Success
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10 flex-1">
                      {/* Avatar */}
                      <Link to={`/talent/profile/${talent.user_id || talent.id}`} className="relative flex-shrink-0 group/avatar">
                        <div className="w-20 h-20 rounded-[1.25rem] bg-bg border border-border dark:border-white/10 overflow-hidden group-hover:border-workflow-primary/50 transition-all duration-500 shadow-2xl">
                          {talent.profile_picture_url ? (
                            <img src={talent.profile_picture_url} className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-700" alt="" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-workflow-primary/10 to-workflow-accent/10">
                              <User className="w-8 h-8 text-workflow-primary/30" />
                            </div>
                          )}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-[3px] border-bg-elevated ${talent.availability === 'available' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
                      </Link>

                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                          <Link to={`/talent/profile/${talent.user_id || talent.id}`} className="block min-w-0">
                            <h3 className="text-xl font-black text-white group-hover:text-workflow-primary transition-colors truncate tracking-tight">
                              {talent.user?.name || 'Elite Talent'}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-1.5 text-xs font-black text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 w-fit">
                            <DollarSign className="w-3.5 h-3.5" />
                            {talent.hourly_rate}/hr
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                          <span className="flex items-center gap-1.5 text-slate-300">
                            <Briefcase className="w-3.5 h-3.5 text-workflow-primary" />
                            {talent.title || 'Specialist'}
                          </span>
                          <span className="w-1 h-1 bg-slate-800 rounded-full hidden sm:block" />
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-text-muted" />
                            {talent.location || 'Remote Node'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                          <div className="bg-amber-500/10 px-2 py-1 rounded-lg flex items-center gap-1.5">
                            {renderStars(talent.rating || 5)}
                          </div>
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">({talent.total_reviews || 0} Reviews)</span>
                        </div>

                        <div className="flex flex-wrap gap-2 items-center">
                           {talent.skills?.slice(0, 4).map((skill, i) => (
                            <span key={i} className="text-[9px] uppercase tracking-[0.15em] font-black text-text-muted bg-bg border border-border dark:border-white/5 px-3 py-2 rounded-xl">
                              {skill}
                            </span>
                          ))}
                          {talent.skills?.length > 4 && (
                            <span className="text-[9px] font-black text-slate-600">+{talent.skills.length - 4}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 transition-all duration-500">
                        <button
                          onClick={() => handleMessageTalent(talent.user_id || talent.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-bg border border-border dark:border-white/10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-bg-elevated transition-all"
                        >
                        <MessageSquare className="w-4 h-4" />
                        Message
                      </button>
                        <Link
                          to={`/talent/profile/${talent.user_id || talent.id}`}
                          className="flex-1 flex items-center justify-center gap-2 bg-workflow-primary py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-workflow-primary/20 text-white"
                        >
                        Profile
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                    <div className="absolute bottom-4 right-8 text-[9px] font-black text-text-muted/40 uppercase tracking-widest flex items-center gap-1.5 pointer-events-none group-hover:opacity-0 transition-opacity">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(talent.created_at)}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="bg-bg-elevated p-20 text-center rounded-[3rem] border-2 border-dashed border-border dark:border-white/5 shadow-2xl">
                <div className="w-24 h-24 mx-auto bg-bg rounded-[2rem] flex items-center justify-center mb-8 border border-border">
                  <Search className="w-10 h-10 text-text-muted" />
                </div>
                <h3 className="text-3xl font-black mb-3 uppercase tracking-tight">No Elite Nodes Detected</h3>
                <p className="text-text-muted max-w-sm mx-auto font-medium">
                  We couldn't find any professionals matching your exact criteria. Expand your search horizons or reset filter protocols.
                </p>
                <button
                  onClick={() => setFilters({ hourlyRateMin: '', hourlyRateMax: '', rating: '', availability: '', experienceLevel: '', language: '', skills: '' })}
                  className="mt-8 text-workflow-primary font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TalentDiscover;
