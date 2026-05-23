import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../components/AppIcon';
import { useAuthContext } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { ElitePageHeader, EliteCard } from '../../components/ui/EliteCard';
import { useToast } from '../../components/ui/Toast';
import { progressService } from '../../services/progressService';
import { certificateService } from '../../services/certificateService';
import AILoader from '../../components/ui/AILoader';

const AchievementsPage = () => {
    const { user } = useAuthContext();
    const { error: showError } = useToast();
    const [badges, setBadges] = useState([]);
    const [userBadges, setUserBadges] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [stats, setStats] = useState({ coins: 0, xp: 0 });
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('badges'); // badges, certificates
    const [filter, setFilter] = useState('all'); // all, unlocked, locked

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user]);

    const loadData = async () => {
        try {
            setLoading(true);
            
            // 1. Fetch User Stats
            const [
                { data: userData, error: userErr },
                progressStats // This will contain the result from progressService.getStats()
            ] = await Promise.all([
                supabase
                    .from('users')
                    .select('coin_balance, coins, total_xp')
                    .eq('id', user.id)
                    .single(),
                progressService.getStats().catch(e => {
                    console.warn('Failed to load progress stats for achievements', e);
                    return { completedCourses: 0, inProgressCourses: 0 };
                })
            ]);
            let xp = userData?.total_xp || 0;
            let coins = userData?.coin_balance || userData?.coins || 0;

            if (xp === 0) {
                xp = (progressStats.completedCourses * 500) + (progressStats.inProgressCourses * 100);
            }
            if (coins === 0) {
                coins = (progressStats.completedCourses * 50) + (progressStats.inProgressCourses * 10);
            }

            // If the public.users row isn't present (common in Supabase setups),
            // fallback to summing actual coin transactions so the UI uses real data.
            try {
                const { data: txRows, error: txErr } = await supabase
                    .from('coin_transactions')
                    .select('amount')
                    .eq('user_id', user.id);

                if (!txErr && Array.isArray(txRows) && txRows.length > 0) {
                    const computed = txRows.reduce((sum, r) => sum + (r.amount || 0), 0);
                    if (computed > 0) coins = computed;
                }
            } catch (e) {
                // Non-fatal; keep existing coins value
            }

            setStats({ coins, xp });

            // 2. Fetch All Badges
            const { data: allBadges } = await supabase
                .from('badges')
                .select('*')
            ;

            // 3. Fetch Unlocked Badges
            const { data: unlocked } = await supabase
                .from('user_badges')
                .select('badge_id, earned_at')
                .eq('user_id', user.id);

            // Normalize schema differences (criteria_* vs requirement_*)
            const normalizedBadges = (allBadges || []).map(b => ({
                ...b,
                requirement_type: b.requirement_type || b.criteria_type,
                requirement_value: b.requirement_value ?? b.criteria_value
            })).sort((a, b) => (a.requirement_value || 0) - (b.requirement_value || 0));

            // 4. Fetch Certificates (Course-level only as per user requirement)
            try {
                const certs = await certificateService.getAll();
                setCertificates((certs || []).filter(c => !c.lesson_id));
            } catch (certErr) {
                console.warn('Failed to load certificates', certErr);
            }

            setBadges(normalizedBadges);
            setUserBadges(unlocked || []);
        } catch (error) {
            console.error('Error loading data:', error);
            showError('Failed to synchronize achievement matrix');
        } finally {
            setLoading(false);
        }
    };

    const isUnlocked = (badgeId) => userBadges.some(ub => ub.badge_id === badgeId);

    const filteredBadges = badges.filter(badge => {
        if (filter === 'unlocked') return isUnlocked(badge.id);
        if (filter === 'locked') return !isUnlocked(badge.id);
        return true;
    });

    const rarityColors = {
        common: 'text-slate-400 border-slate-400/20 bg-slate-400/5',
        rare: 'text-blue-400 border-blue-400/20 bg-blue-400/5',
        epic: 'text-purple-400 border-purple-400/20 bg-purple-400/5',
        legendary: 'text-amber-400 border-amber-400/20 bg-amber-400/5',
        divine: 'text-rose-400 border-rose-400/20 bg-rose-400/5'
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <AILoader variant="pulse" text="Synchronizing Achievement Matrix..." />
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            <ElitePageHeader
                title="Scholar Registry: Achievements"
                description="Your intellectual milestones and academic status within the Hope Dawah Institute."
                badge="Knowledge Rewards"
            />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <EliteCard className="bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent border-[var(--color-primary)]/20">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/20 flex items-center justify-center border border-[var(--color-primary)]/30">
                            <Icon name="Zap" className="text-[var(--color-primary)]" size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)]">Total Scholarly XP</p>
                            <h3 className="text-2xl font-black text-[var(--foreground)]">{stats.xp.toLocaleString()}</h3>
                        </div>
                    </div>
                </EliteCard>

                <EliteCard className="bg-gradient-to-br from-amber-600/10 to-transparent border-amber-500/20">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                            <Icon name="DollarSign" className="text-amber-500" size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)]">One Coins</p>
                            <h3 className="text-2xl font-black text-[var(--foreground)]">{stats.coins.toLocaleString()}</h3>
                        </div>
                    </div>
                </EliteCard>

                <EliteCard className="bg-gradient-to-br from-purple-600/10 to-transparent border-purple-500/20">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                            <Icon name="Award" className="text-purple-500" size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)]">Unlocked Badges</p>
                            <h3 className="text-2xl font-black text-[var(--foreground)]">{userBadges.length} / {badges.length}</h3>
                        </div>
                    </div>
                </EliteCard>
            </div>

            {/* Section Tabs */}
            <div className="flex justify-center mb-6">
                <div className="native-segmented-control max-w-md w-full">
                    <button
                        onClick={() => setActiveSection('badges')}
                        className={`native-segmented-tab ${activeSection === 'badges' ? 'native-segmented-tab-active' : ''}`}
                    >
                        <Icon name="Shield" size={14} />
                        Divine Badges
                    </button>
                    <button
                        onClick={() => setActiveSection('certificates')}
                        className={`native-segmented-tab ${activeSection === 'certificates' ? 'native-segmented-tab-active' : ''}`}
                    >
                        <Icon name="Award" size={14} />
                        Academic Certificates
                    </button>
                </div>
            </div>

            {/* Filters */}
            {activeSection === 'badges' && (
                <div className="flex items-center justify-center gap-2 p-1 bg-[var(--secondary)] rounded-xl border border-[var(--border)] max-w-xs mx-auto mb-6">
                    {['all', 'unlocked', 'locked'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                                filter === f 
                                ? 'bg-[var(--primary)] text-white shadow-sm' 
                                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            )}

            {/* Content Grid */}
            <div className="relative">
                <AnimatePresence mode="wait">
                    {activeSection === 'badges' ? (
                        <motion.div
                            key="badges-grid"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {filteredBadges.map((badge) => {
                                const unlocked = isUnlocked(badge.id);
                                return (
                                    <EliteCard 
                                        key={badge.id}
                                        className={`relative group h-full transition-all duration-300 ${
                                            !unlocked ? 'opacity-50 grayscale' : 'hover:border-[var(--color-primary)]/40 hover:shadow-2xl hover:shadow-emerald-500/10'
                                        }`}
                                    >
                                        <div className="flex flex-col items-center text-center">
                                            <div className="relative mb-6">
                                                <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 ${
                                                    unlocked ? 'bg-[var(--secondary)] border-[var(--color-primary)]/30' : 'bg-[var(--secondary)] border-[var(--border)]'
                                                }`}>
                                                    <Icon 
                                                        name={unlocked ? "Shield" : "Lock"} 
                                                        className={unlocked ? "text-[var(--color-primary)]" : "text-[var(--muted-foreground)]"} 
                                                        size={32} 
                                                    />
                                                </div>
                                                {unlocked && (
                                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-[var(--color-primary)] rounded-full flex items-center justify-center border-2 border-[var(--card)]">
                                                        <Icon name="Check" size={12} className="text-white" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className={`text-[8px] font-black uppercase tracking-widest mb-2 px-3 py-1 rounded-full border ${rarityColors[badge.rarity]}`}>
                                                {badge.rarity}
                                            </div>
                                            <h4 className="text-sm font-black text-[var(--foreground)] uppercase tracking-tight mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                                                {badge.name}
                                            </h4>
                                            <p className="text-[10px] font-medium text-[var(--muted-foreground)] leading-relaxed mb-4">
                                                {badge.description}
                                            </p>

                                            <div className="w-full mt-auto pt-4 border-t border-[var(--border)]">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[9px] font-black text-[var(--muted-foreground)] uppercase tracking-widest">Requirement</span>
                                                    <span className="text-[9px] font-black text-[var(--color-primary)] uppercase tracking-widest">
                                                        {badge.requirement_value || 0} {(badge.requirement_type || 'unknown').toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="h-1 bg-[var(--secondary)] rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full bg-[var(--color-primary)] transition-all duration-1000 ${unlocked ? 'w-full' : 'w-0'}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </EliteCard>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="certs-grid"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            {certificates.length === 0 ? (
                                <div className="col-span-full py-20 text-center border-2 border-dashed border-[var(--border)] rounded-[3rem]">
                                    <Icon name="Award" size={48} className="mx-auto text-[var(--muted-foreground)] mb-6 opacity-30" />
                                    <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--muted-foreground)]">No Certificates Earned Yet</p>
                                    <p className="text-[10px] text-[var(--muted-foreground)] mt-2 font-bold">Complete lessons or courses to unlock your scrolls.</p>
                                </div>
                            ) : (
                                certificates.map((cert) => (
                                    <EliteCard 
                                        key={cert.id}
                                        className="group p-8 bg-[var(--secondary)] border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/[0.02] transition-all h-full flex flex-col"
                                    >
                                        <div className="flex items-start justify-between mb-8">
                                            <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center border border-[var(--color-primary)]/20 group-hover:scale-110 transition-transform">
                                                <Icon name="FileCheck" className="text-[var(--color-primary)]" size={28} />
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-[var(--color-primary)] uppercase tracking-widest mb-1">{cert.certificate_number}</p>
                                                <p className="text-[9px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">Issued: {new Date(cert.issued_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${cert.lesson_id ? 'bg-blue-500/10 text-blue-400' : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'}`}>
                                                    {cert.lesson_id ? 'Lesson Milestone' : 'Course Mastery'}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-black text-[var(--foreground)] mb-2 leading-tight">
                                                {cert.title || cert.course?.title}
                                            </h3>
                                            <p className="text-[11px] font-medium text-[var(--muted-foreground)] line-clamp-2">
                                                {cert.lesson_id ? 'This achievement marks successful completion of a core module.' : cert.course?.description}
                                            </p>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-[var(--border)] flex items-center justify-between">
                                            <div className="flex gap-4">
                                                <div className="text-center">
                                                    <p className="text-[8px] font-black text-[var(--muted-foreground)] uppercase tracking-widest mb-1">Grade</p>
                                                    <p className="text-sm font-black text-[var(--foreground)]">{cert.grade || 'Pass'}</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[8px] font-black text-[var(--muted-foreground)] uppercase tracking-widest mb-1">Score</p>
                                                    <p className="text-sm font-black text-[var(--color-primary)]">{cert.score}%</p>
                                                </div>
                                            </div>
                                            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)] text-[9px] font-black uppercase tracking-widest hover:bg-[var(--color-primary)] hover:text-white hover:border-transparent transition-all">
                                                View Scroll <Icon name="ExternalLink" size={12} />
                                            </button>
                                        </div>
                                    </EliteCard>
                                ))
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AchievementsPage;
