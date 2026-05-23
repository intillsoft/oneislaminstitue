import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, SlidersHorizontal, ArrowRight, 
  X, TrendingUp, BookOpen, ChevronDown
} from 'lucide-react';
import { courseService } from '../../services/jobService';
import { aiService } from '../../services/aiService';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import SearchFilters from './components/SearchFilters';
import CourseCard from './components/CourseCard';
import AdvancedSearchModal from './components/AdvancedSearchModal';
import VoiceSearch from '../../components/ui/VoiceSearch';

const CourseDiscovery = () => {
  const { user } = useAuthContext();
  const { error: showError } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    location: [],
    employmentType: [],
    salaryRange: '',
    companySize: '',
    postingDate: '',
    experienceLevel: '',
    remoteWork: false
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  // Load saved jobs (recommendations section removed for cleaner UI)
  useEffect(() => {
    if (user) {
      loadSavedJobs();
    }
  }, [user]);

  const loadJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters = {
        search: searchQuery,
        location: selectedFilters.location[0] || null,
        employmentType: selectedFilters.employmentType[0] || null,
        remote: selectedFilters.remoteWork || null,
        experienceLevel: selectedFilters.experienceLevel || null,
        salaryMin: selectedFilters.salaryRange?.split('-')[0]?.replace(/[^0-9]/g, '') || null,
        salaryMax: selectedFilters.salaryRange?.split('-')[1]?.replace(/[^0-9]/g, '') || null,
        sortBy: sortBy === 'relevance' ? 'created_at' : sortBy,
        sortOrder: 'desc',
        page: currentPage,
        pageSize: 12,
      };

      const result = await courseService.getAll(filters);
      if (currentPage === 1) setJobs(result.data || []);
      else setJobs(prev => [...prev, ...(result.data || [])]);

      setTotalJobs(result.total || 0);
      setHasMore((result.data?.length || 0) === 12);
    } catch (error) {
      showError('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedFilters, sortBy, currentPage]);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  const loadSavedJobs = async () => {
    try {
      const saved = await courseService.getSavedJobs();
      setSavedJobs(new Set(saved.map(sj => sj.job_id || sj.job?.id)));
    } catch (error) { }
  };

  const handleSaveJob = async (jobId) => {
    if (!user) { navigate('/login'); return; }
    try {
      if (savedJobs.has(jobId)) {
        await courseService.unsaveJob(jobId);
        setSavedJobs(prev => { const n = new Set(prev); n.delete(jobId); return n; });
      } else {
        await courseService.saveJob(jobId);
        setSavedJobs(prev => new Set([...prev, jobId]));
      }
    } catch (error) {
      showError('Action failed');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[var(--color-bg-dark)] text-[var(--color-text-primary)] dark:text-white font-sans selection:bg-[var(--color-primary)]/30 pb-32">
      
      {/* Search Header */}
      <section className="relative pt-36 md:pt-40 pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--color-primary)]/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                Explore the <span className="text-[var(--color-primary)]">Curriculum</span>
              </h1>
              
              <div className="bg-white dark:bg-[#0f1429] p-1.5 rounded-3xl flex items-center gap-2 group border border-slate-100 dark:border-white/5 shadow-2xl shadow-emerald-500/5 transition-all focus-within:border-[var(--color-primary)]/20">
                    <div className="pl-4 text-slate-300 group-focus-within:text-[var(--color-primary)] transition-colors">
                      <Search className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      placeholder="Search for subjects, lessons, or modules..."
                      className="flex-1 bg-transparent border-none focus:ring-0 text-[var(--color-text-primary)] dark:text-white placeholder-slate-400 py-3.5 text-[15px] font-bold"
                    />
                    <div className="flex items-center gap-1 pr-1.5">
                      <VoiceSearch
                        onTranscript={(text) => { setSearchQuery(text); setCurrentPage(1); }}
                      />
                      <button
                        onClick={() => setIsAdvancedSearchOpen(true)}
                        className="p-2.5 rounded-2xl hover:bg-white dark:hover:bg-white/5 text-slate-300 hover:text-[var(--color-primary)] transition-all"
                      >
                        <SlidersHorizontal className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => { setCurrentPage(1); loadJobs(); }}
                        className="bg-[var(--color-primary)] text-white px-8 py-3.5 rounded-2xl font-black hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-emerald-500/10 text-[10px] tracking-[0.2em] uppercase"
                      >
                        Find Course
                      </button>
                    </div>
              </div>

              {/* Horizontal Filter Bar */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 py-4 px-6 bg-white dark:bg-[#0f1429] rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-md max-w-4xl mx-auto">
                {/* Subject Area Dropdown */}
                <div className="relative flex-1 min-w-[150px]">
                  <select
                    value={selectedFilters.location[0] || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedFilters(p => ({ ...p, location: val ? [val] : [] }));
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl pl-4 pr-10 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-[var(--color-primary)] transition-all cursor-pointer uppercase tracking-wider"
                  >
                    <option value="">All Subjects</option>
                    {['Quran & Tajweed', 'Islamic Studies', 'Hadith', 'Islamic History', 'Fiqh (Islamic Law)', 'Islamic Theology', 'Arabic Language', 'Islamic Ethics', 'Quranic Tafsir'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>

                {/* Study Format Dropdown */}
                <div className="relative flex-1 min-w-[150px]">
                  <select
                    value={selectedFilters.employmentType[0] || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedFilters(p => ({ ...p, employmentType: val ? [val] : [] }));
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl pl-4 pr-10 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-[var(--color-primary)] transition-all cursor-pointer uppercase tracking-wider"
                  >
                    <option value="">All Formats</option>
                    {['Live Classes', 'Recorded', 'Self-Paced', 'Hybrid'].map(mode => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>

                {/* Level Dropdown */}
                <div className="relative flex-1 min-w-[150px]">
                  <select
                    value={selectedFilters.experienceLevel || ''}
                    onChange={(e) => {
                      setSelectedFilters(p => ({ ...p, experienceLevel: e.target.value }));
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl pl-4 pr-10 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-[var(--color-primary)] transition-all cursor-pointer uppercase tracking-wider"
                  >
                    <option value="">All Levels</option>
                    {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>

                {/* Language Dropdown */}
                <div className="relative flex-1 min-w-[150px]">
                  <select
                    value={selectedFilters.companySize || ''}
                    onChange={(e) => {
                      setSelectedFilters(p => ({ ...p, companySize: e.target.value }));
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl pl-4 pr-10 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-[var(--color-primary)] transition-all cursor-pointer uppercase tracking-wider"
                  >
                    <option value="">All Languages</option>
                    {['English', 'Arabic', 'Urdu', 'French', 'Spanish', 'Turkish'].map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>

                {/* Self-Paced Toggle */}
                <div className="flex items-center gap-2.5 pl-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Self-Paced</span>
                  <input
                    type="checkbox"
                    checked={selectedFilters.remoteWork || false}
                    onChange={(e) => {
                      setSelectedFilters(p => ({ ...p, remoteWork: e.target.checked }));
                      setCurrentPage(1);
                    }}
                    className="w-8 h-4 rounded-full bg-slate-100 dark:bg-white/5 border-none text-[var(--color-primary)] focus:ring-0 appearance-none relative before:content-[''] before:absolute before:w-3 before:h-3 before:bg-slate-400 before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-4.5 checked:before:bg-[var(--color-primary)] transition-all duration-300 cursor-pointer"
                  />
                </div>

                {/* Reset Trigger */}
                {Object.values(selectedFilters).some(v => Array.isArray(v) ? v.length > 0 : !!v) && (
                  <button
                    onClick={() => {
                      setSelectedFilters({
                        location: [],
                        employmentType: [],
                        salaryRange: '',
                        companySize: '',
                        postingDate: '',
                        experienceLevel: '',
                        remoteWork: false
                      });
                      setCurrentPage(1);
                    }}
                    className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] hover:underline px-3 transition-all shrink-0"
                  >
                    Reset
                  </button>
                )}
              </div>
            </motion.div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4">
        <div className="w-full">
          {/* Main List */}
          <div className="w-full space-y-12">

            {/* Removed AI Matches section for cleaner design */}

            {/* List Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-6">
                <h2 className="text-xl font-black tracking-tight text-[var(--color-text-primary)] dark:text-white">
                  {isLoading ? 'Scanning...' : `${totalJobs} Courses Available`}
                </h2>
                
                <div className="relative group">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white dark:bg-slate-900 border border-[var(--color-border-primary)] dark:border-white/10 rounded-full pl-6 pr-12 py-2.5 text-xs font-black text-[var(--color-text-secondary)] dark:text-slate-400 outline-none focus:border-[var(--color-primary)] transition-all cursor-pointer uppercase tracking-widest"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="created_at">Newest</option>
                    <option value="salary">Academic Level</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Grid */}
            {isLoading && jobs.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-square rounded-[2rem] bg-slate-100 dark:bg-white/[0.02] animate-pulse" />)}
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 px-2 sm:px-0">
                  {jobs.map((job, idx) => (
                    <CourseCard
                      key={job.id}
                      index={idx}
                      job={{
                        ...job,
                        employmentType: job.job_type || job.employment_type,
                        logo: job.logo || job.companies?.[0]?.logo
                      }}
                      isSaved={savedJobs.has(job.id)}
                      onSave={() => handleSaveJob(job.id)}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center pb-12">
                    <button
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={isLoading}
                      className="px-12 py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-[var(--color-primary)] transition-all disabled:opacity-50 text-[10px] uppercase tracking-[0.2em] shadow-xl hover:shadow-[var(--color-primary)]/20"
                    >
                      {isLoading ? 'Scanning...' : 'Load more items'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-20 text-center rounded-[3rem] border-2 border-dashed border-[var(--color-border-primary)] dark:border-white/10 flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6">
                  <BookOpen size={30} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-black mb-2">No Courses Found</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">Try adjusting your search filters or browse by academic category.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <AdvancedSearchModal
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        filters={selectedFilters}
        onApplyFilters={setSelectedFilters}
      />
    </div>
  );
};

export default CourseDiscovery;
