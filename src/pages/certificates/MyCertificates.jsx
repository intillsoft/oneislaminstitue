/**
 * My Certificates Page
 * Displays earned certificates with AI achievement summaries and shareable cards
 * Style: Elite Dashboard Pattern
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Award, Download, Share2, Sparkles, Shield, Star, Trophy,
  TrendingUp, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { certificateService } from '../../services/certificateService';
import { useAuthContext } from '../../contexts/AuthContext';
import { ElitePageHeader, EliteCard, EliteStatCard } from '../../components/ui/EliteCard';
import AILoader from '../../components/ui/AILoader';

const CertificateCard = ({ cert, index, onShare, onDownload }) => {
  const gradeColors = {
    'Distinction': 'from-amber-500 to-yellow-500',
    'Merit': 'from-emerald-500 to-teal-500',
    'Pass': 'from-blue-500 to-indigo-500',
  };
  const gradeBg = {
    'Distinction': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    'Merit': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    'Pass': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12 }}
    >
      <EliteCard className="p-0 overflow-hidden relative group h-full flex flex-col hover:border-emerald-500/30 transition-all duration-300">
        <div className={`h-1.5 w-full bg-gradient-to-r ${gradeColors[cert.grade] || gradeColors['Pass']}`} />
        
        <div className="p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-5">
                <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradeColors[cert.grade] || gradeColors['Pass']} flex items-center justify-center shadow-lg text-white shrink-0`}>
                        <Award size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight text-text-primary mb-1">{cert.title}</h3>
                        <p className="text-xs text-text-muted uppercase tracking-wide font-medium">{cert.course?.company || 'One Islam Institute'}</p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${gradeBg[cert.grade] || gradeBg['Pass']}`}>
                    {cert.grade}
                </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-5 border-y border-border mb-5">
                <div className="text-center">
                    <span className="block text-2xl font-black text-text-primary">{cert.score}%</span>
                    <span className="text-[9px] text-text-muted uppercase tracking-widest font-bold">Score</span>
                </div>
                 <div className="text-center border-l border-border relative">
                    <span className="block text-sm font-bold mt-1.5 text-text-primary">{new Date(cert.issued_at).toLocaleDateString('en', { month: 'short', year: 'numeric' })}</span>
                    <span className="text-[9px] text-text-muted uppercase tracking-widest font-bold absolute bottom-0 left-0 right-0">Issued</span>
                </div>
                 <div className="text-center border-l border-border relative">
                    <span className="block text-emerald-600 font-bold text-sm flex items-center justify-center gap-1 mt-1.5"><Shield size={12}/> Verified</span>
                    <span className="text-[9px] text-text-muted uppercase tracking-widest font-bold absolute bottom-0 left-0 right-0">Status</span>
                </div>
            </div>

            <div className="flex-1 mb-6">
                 <div className="flex flex-wrap gap-2">
                    {(cert.skills_earned || []).map(s => (
                        <span key={s} className="text-[10px] font-bold px-2.5 py-1 bg-surface-elevated rounded-lg border border-border text-text-secondary">
                            {s}
                        </span>
                    ))}
                 </div>
            </div>

            <div className="flex justify-between items-center pt-2">
                <span className="font-mono text-[10px] text-text-muted tracking-wider">{cert.certificate_number}</span>
                <div className="flex gap-2">
                    <button onClick={() => onShare(cert)} className="p-2 hover:bg-surface-elevated rounded-xl text-text-muted hover:text-emerald-500 transition-colors" title="Share">
                        <Share2 size={16}/>
                    </button>
                    <button onClick={() => onDownload(cert)} className="p-2 hover:bg-surface-elevated rounded-xl text-text-muted hover:text-emerald-500 transition-colors" title="Download">
                        <Download size={16}/>
                    </button>
                </div>
            </div>
        </div>
      </EliteCard>
    </motion.div>
  );
};

const MyCertificates = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsRes = await certificateService.getStats();
      // No mock fallback
      setStats(statsRes);
      setCertificates(statsRes.certificates || []);
      setAiSummary(certificateService.generateAISummary(statsRes.certificates || []));
    } catch (error) {
      console.error("Failed to load certificates", error);
      setCertificates([]);
      setAiSummary(certificateService.generateAISummary([]));
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (cert) => {
    try {
      await navigator.clipboard.writeText(`I earned a certificate in "${cert.title}" from One Islam Institute! 🎓 Verify: ${cert.certificate_number}`);
      // Toast notification could be added here
    } catch { /* clipboard not supported */ }
  };

  const handleDownload = (cert) => {
    alert(`Certificate ${cert.certificate_number} download will be available soon.`);
  };

  const filteredCerts = certificates.filter(c =>
    !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.certificate_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
     <div className="flex flex-col items-center justify-center py-32">
        <AILoader variant="pulse" text="Verifying Credentials..." />
     </div>
  );

  return (
    <div className="pb-20">
      <div className="max-w-7xl mx-auto py-8">
        
        <ElitePageHeader
            title="My Certificates"
            subtitle="Your verified academic achievements and credentials."
            badge="Credentials"
        >
             <div className="mt-6 flex justify-end">
                <div className="relative w-full max-w-sm">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search certificates..."
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                    />
                </div>
            </div>
        </ElitePageHeader>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <EliteStatCard
                label="Total Certificates"
                value={certificates.length}
                icon={Award}
                color="amber"
            />
            <EliteStatCard
                label="Skills Certified"
                value={aiSummary?.skillProfile?.totalSkills || 0}
                icon={Star}
                color="green"
            />
             <EliteStatCard
                label="Avg. Score"
                value={`${aiSummary?.skillProfile?.avgScore || 0}%`}
                icon={TrendingUp}
                color="blue"
            />
            <EliteStatCard
                label="Scholar Level"
                value={aiSummary?.skillProfile?.level || 'Rising Star'}
                icon={Trophy}
                color="amber" // Using amber as purple is mapped to red effectively in our EliteCard logic fallback or we rely on default blue
            />
        </div>

        {/* AI Summary Section */}
        {aiSummary && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <EliteCard className="bg-gradient-to-r from-violet-600/5 via-fuchsia-600/5 to-indigo-600/5 border-violet-500/10">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20">
                            <Sparkles size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                             <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-sm font-black text-text-primary uppercase tracking-wider">AI Achievement Analysis</h3>
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 border border-violet-500/20">BETA</span>
                            </div>
                            <p className="text-sm text-text-secondary leading-relaxed mb-4 max-w-3xl">{aiSummary.summary}</p>
                            
                            <div className="flex flex-wrap gap-4">
                                <div>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Top Skills</p>
                                    <div className="flex gap-2">
                                        {aiSummary.skillProfile?.topSkills?.map(skill => (
                                            <span key={skill} className="px-2.5 py-1 rounded-lg bg-surface border border-border text-[10px] font-bold text-violet-600 flex items-center gap-1">
                                                <Star size={10} className="fill-violet-600 text-violet-600" /> {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="hidden md:block w-px bg-border mx-2"></div>
                                <div>
                                     <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Recommendation</p>
                                     <p className="text-xs text-text-secondary italic">"{aiSummary.recommendations?.[0]}"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </EliteCard>
             </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCerts.length > 0 ? (
                filteredCerts.map((cert, i) => (
                    <CertificateCard key={cert.id} cert={cert} index={i} onShare={handleShare} onDownload={handleDownload} />
                ))
            ) : (
                <div className="col-span-full">
                     <EliteCard className="text-center py-16 dashed-border">
                        <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-4">
                            <Award className="text-text-muted/40 w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-text-primary mb-2">
                            {searchQuery ? 'No certificates found' : 'No Certificates Earned Yet'}
                        </h3>
                        <p className="text-sm text-text-muted max-w-md mx-auto mb-6">
                            {searchQuery ? 'Try adjusting your search terms.' : 'Complete courses to earn verified credentials that showcase your expertise.'}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => navigate('/courses')}
                                className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-500/30"
                            >
                                Browse Courses
                            </button>
                        )}
                     </EliteCard>
                </div>
            )}
        </div>

        {certificates.length > 0 && (
             <div className="mt-8 flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10">
                    <Shield size={14} className="text-emerald-600" />
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Securely Verified on Blockchain</span>
                </div>
             </div>
        )}

      </div>
    </div>
  );
};

export default MyCertificates;
