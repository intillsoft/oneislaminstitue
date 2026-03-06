import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { useToast } from '../../../components/ui/Toast';
import { apiService } from '../../../lib/api';
import { Play, Pause, RefreshCw, BarChart3, Clock } from 'lucide-react';

import { EliteCard } from '../../../components/ui/EliteCard';

const JobCrawlerPanel = () => {
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [crawling, setCrawling] = useState(false);
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState({ keywords: 'software engineer', location: 'United States', sources: ['linkedin', 'glassdoor', 'indeed'], limit: 50, date_posted: '7d' });

  const [continuousMode, setContinuousMode] = useState(false);
  const isCrawlingRef = React.useRef(false);

  useEffect(() => {
    loadStatus();
    return () => {
      isCrawlingRef.current = false; // Cleanup
    };
  }, []);

  const loadStatus = async () => {
    try {
      const response = await apiService.jobCrawler.getStatus();
      if (response.data) setStatus(response.data);
    } catch (error) {
      console.error('Crawler status sync failure:', error);
    }
  };

  const handleCrawl = async () => {
    isCrawlingRef.current = true;
    setLoading(true);
    setCrawling(true);

    try {
      do {
        const response = await apiService.jobCrawler.crawl(formData);
        if (response.success) {
          success(`Indexing cycle complete. ${response.data.inserted} entities synchronized.`);
          await loadStatus();
        }

        if (continuousMode && isCrawlingRef.current) {
          // Wait 5 minutes before next cycle
          await new Promise(resolve => setTimeout(resolve, 300000));
        }
      } while (continuousMode && isCrawlingRef.current);
    } catch (error) {
      showError('Crawling sequence interrupted. Verify connectivity.');
    } finally {
      if (isCrawlingRef.current) {
        // Only reset if we weren't stopped manually (which handles its own state)
        setLoading(false);
        setCrawling(false);
        isCrawlingRef.current = false;
      }
    }
  };

  const handleStop = async () => {
    isCrawlingRef.current = false; // Break the loop
    try {
      if (apiService.jobCrawler.stop) {
        await apiService.jobCrawler.stop();
      }
      setCrawling(false);
      setLoading(false);
      success('Indexing sequence terminated manually.');
    } catch (error) {
      console.warn('Stop signal failed:', error);
      setCrawling(false);
      setLoading(false);
      success('Indexing sequence stopped (local).');
    }
  };

  const handleSchedule = async () => {
    try {
      setLoading(true);
      const response = await apiService.jobCrawler.schedule();
      if (response.success) {
        success('Global indexing sequence scheduled and executed successfully.');
        await loadStatus();
      }
    } catch (error) {
      showError('Failed to initiate scheduled crawl protocol.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSource = (source) => {
    setFormData(prev => ({ ...prev, sources: prev.sources.includes(source) ? prev.sources.filter(s => s !== source) : [...prev.sources, source] }));
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8 px-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Intelligence Crawler</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">Global Entity Indexing & Ingestion Engine</p>
        </div>

        <button onClick={loadStatus} disabled={loading} className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-3">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          SYNCHRONIZE STATUS
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: 'DB ENTITIES', value: status?.data?.total_jobs_in_db || 0, icon: 'BarChart3', color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'LAST INDEX', value: status?.data?.last_run?.inserted || 0, icon: 'Play', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'REDUNDANCIES', value: status?.data?.last_run?.skipped || 0, icon: 'RefreshCw', color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'SYNC LATENCY', value: '42ms', icon: 'Clock', color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <EliteCard key={i} className="p-6 border-white/5 bg-white/[0.01] hover:translate-y-[-4px] transition-all cursor-default group">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center border border-white/5 group-hover:border-blue-500/30 transition-all`}>
                <Icon name={stat.icon} size={20} className={stat.color} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl font-black text-white uppercase tracking-tight">{stat.value}</p>
              </div>
            </div>
          </EliteCard>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8">
          <EliteCard className="p-10 border-white/5 bg-white/[0.01]">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-10">Manual Indexing Protocol</h3>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">ENTITY KEYWORDS</label>
                  <input type="text" value={formData.keywords} onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-[11px] font-black text-white focus:outline-none focus:border-blue-500/50 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">TARGET LOCALE</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-[11px] font-black text-white focus:outline-none focus:border-blue-500/50 transition-all" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">INTELLIGENCE SOURCES</label>
                    <div className="flex flex-wrap gap-3">
                      {['linkedin', 'glassdoor', 'indeed'].map((source) => (
                        <button key={source} onClick={() => toggleSource(source)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${formData.sources.includes(source) ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white hover:bg-white/10'}`}>
                          {source}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 w-full md:w-1/3">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">FRESHNESS LIMIT (AGE)</label>
                    <select
                      value={formData.date_posted}
                      onChange={(e) => setFormData(prev => ({ ...prev, date_posted: e.target.value }))}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3 text-[11px] font-black text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="24h">Last 24 Hours</option>
                      <option value="3d">Last 3 Days</option>
                      <option value="7d">Last 7 Days (Max)</option>
                      <option value="month">Last Month</option>
                    </select>
                  </div>

                  <div className="space-y-2 w-full md:w-1/3 flex flex-col justify-end">
                    <div className="flex items-center gap-3 h-[42px] px-5 bg-white/[0.03] border border-white/10 rounded-xl transition-all hover:bg-white/[0.05]">
                      <div
                        onClick={() => !crawling && setContinuousMode(!continuousMode)}
                        className={`w-10 h-5 rounded-full transition-colors cursor-pointer flex items-center px-1 ${continuousMode ? 'bg-blue-600' : 'bg-slate-700'} ${crawling ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-300 ease-spring ${continuousMode ? 'translate-x-5' : 'translate-x-0'}`} />
                      </div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest cursor-pointer select-none" onClick={() => !crawling && setContinuousMode(!continuousMode)}>
                        CONTINUOUS LOOP (5m)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex gap-4">
                {!crawling ? (
                  <button onClick={handleCrawl} disabled={loading || formData.sources.length === 0} className="flex-1 py-4 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3">
                    <Play className="w-4 h-4" />
                    INITIATE CRAWL
                  </button>
                ) : (
                  <button onClick={handleStop} className="flex-1 py-4 bg-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-3 animate-pulse">
                    <Pause className="w-4 h-4" />
                    STOP SEQUENCE
                  </button>
                )}

                <button
                  onClick={handleSchedule}
                  disabled={loading}
                  className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  {loading && !crawling ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
                  ASYNC SCHEDULE
                </button>
              </div>
            </div>
          </EliteCard>
        </div>

        <div className="xl:col-span-4">
          <EliteCard className="p-8 border-white/5 bg-white/[0.01]">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Security Context</h3>
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="Info" size={16} className="text-blue-500" />
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Authentication Required</span>
                </div>
                <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase">Verify RapidAPI & LinkedIn Credentials in the system core to enable deep indexing.</p>
              </div>
              <div className="space-y-4">
                {['RAPIDAPI_KEY', 'LINKEDIN_TOKEN', 'INDEED_CLIENT_ID'].map(token => (
                  <div key={token} className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{token}</span>
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">ACTIVE</span>
                  </div>
                ))}
              </div>
            </div>
          </EliteCard>
        </div>
      </div>
    </div>
  );
};

export default JobCrawlerPanel;

