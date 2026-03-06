import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Star, ArrowRight, ChevronLeft, ChevronRight, MapPin, DollarSign, Sparkles } from 'lucide-react';
import { talentService } from '../../../services/talentService';
import { useAuthContext } from '../../../contexts/AuthContext';
import Image from '../../../components/AppImage';
import AILoader from '../../../components/ui/AILoader';

const RecommendedTalentSection = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const [talents, setTalents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scrollState, setScrollState] = useState({ canScrollLeft: false, canScrollRight: false });

    useEffect(() => {
        loadTalents();
    }, [user]);

    const loadTalents = async () => {
        try {
            setLoading(true);
            const data = await talentService.discoverTalents({
                pageSize: 10,
                sort: 'rating'
            });
            setTalents(data?.data || data || []);
        } catch (error) {
            console.error('Error loading recommended talents:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkScrollState = () => {
        const container = scrollRef.current;
        if (!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;
        setScrollState({
            canScrollLeft: scrollLeft > 0,
            canScrollRight: scrollLeft < scrollWidth - clientWidth - 10
        });
    };

    const scroll = (direction) => {
        const container = scrollRef.current;
        if (!container) return;

        const scrollAmount = 400;
        container.scrollTo({
            left: direction === 'left' ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount,
            behavior: 'smooth'
        });
        setTimeout(checkScrollState, 300);
    };

    useEffect(() => {
        checkScrollState();
    }, [talents]);

    const renderTalentCard = (talent, index) => (
        <motion.div
            key={talent.id}
            className="glass-panel p-6 rounded-[2rem] border border-white/10 hover:border-workflow-primary/30 transition-all duration-500 group flex-shrink-0 w-[300px] bg-white/[0.02] relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -8 }}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-workflow-primary/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl border border-white/10 overflow-hidden bg-white/5">
                    {talent.profile_picture_url ? (
                        <img src={talent.profile_picture_url} className="w-full h-full object-cover" alt="" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-workflow-primary/20 to-workflow-accent/20 text-workflow-primary font-bold">
                            {talent.user?.name?.charAt(0) || 'T'}
                        </div>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <h4 className="text-text-primary font-black uppercase tracking-tight truncate group-hover:text-workflow-primary transition-colors" title={talent.user?.name || 'Top Talent'}>
                        {talent.user?.name || 'Top Talent'}
                    </h4>
                    <p className="text-text-muted text-[10px] truncate uppercase tracking-[0.2em] font-black opacity-60">
                        {talent.title || 'Professional'}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                    <Star size={12} className="fill-amber-400" />
                    <span className="text-sm font-bold">{talent.rating || '5.0'}</span>
                </div>
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
                    {talent.total_reviews || 0} Reviews
                </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {talent.skills?.slice(0, 3).map((skill, i) => (
                    <span key={i} className="text-[9px] uppercase tracking-[0.2em] font-black text-text-muted bg-surface-elevated px-2.5 py-1.5 rounded-lg border border-border shadow-sm">
                        {skill}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-border">
                <div className="flex items-center gap-1.5 text-emerald-500 font-black text-sm tracking-tighter">
                    <DollarSign size={16} />
                    {talent.hourly_rate}
                    <span className="text-[9px] uppercase tracking-widest opacity-60 text-text-muted ml-0.5">/hr</span>
                </div>
                <Link
                    to={`/talent/profile/${talent.user_id || talent.id}`}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-workflow-primary flex items-center gap-1.5 group/btn px-3 py-2 rounded-xl bg-workflow-primary/5 hover:bg-workflow-primary/10 transition-all border border-workflow-primary/10"
                >
                    Alpha Node <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );

    if (loading) {
        return (
            <div className="py-12 flex justify-center">
                <AILoader text="Finding elite talent..." />
            </div>
        );
    }

    if (talents.length === 0) return null;

    return (
        <section className="space-y-8 mt-16">
            <div className="flex items-end justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-workflow-accent/10 flex items-center justify-center border border-workflow-accent/20">
                        <Users className="w-6 h-6 text-workflow-accent" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-[1000] text-text-primary tracking-[-0.05em] font-display uppercase">Elite Marketplace Talent</h2>
                        <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mt-1 opacity-50">Recommended professionals matching top-tier requirements</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => scroll('left')}
                        className={`p-3 rounded-2xl border transition-all ${scrollState.canScrollLeft ? 'bg-surface-elevated border-border text-text-primary hover:bg-workflow-primary/10 hover:border-workflow-primary/30' : 'opacity-20 cursor-not-allowed border-border text-text-muted'}`}
                        disabled={!scrollState.canScrollLeft}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className={`p-3 rounded-2xl border transition-all ${scrollState.canScrollRight ? 'bg-surface-elevated border-border text-text-primary hover:bg-workflow-primary/10 hover:border-workflow-primary/30' : 'opacity-20 cursor-not-allowed border-border text-text-muted'}`}
                        disabled={!scrollState.canScrollRight}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                onScroll={checkScrollState}
                className="flex gap-6 overflow-x-auto pb-8 pt-2 -mx-4 px-4 scrollbar-hide snap-x"
            >
                {talents.map((talent, idx) => renderTalentCard(talent, idx))}

                {/* View All Card */}
                <motion.div
                    className="glass-panel p-6 rounded-[2.5rem] border border-border/50 hover:border-workflow-primary transition-all duration-700 group flex-shrink-0 w-[220px] flex flex-col items-center justify-center text-center cursor-pointer shadow-modal"
                    onClick={() => navigate('/talent/discover')}
                    whileHover={{ scale: 1.05, y: -10 }}
                >
                    <div className="w-16 h-16 rounded-3xl bg-workflow-primary/10 flex items-center justify-center mb-6 group-hover:rotate-[360deg] transition-transform duration-1000 shadow-primary-glow/20">
                        <Users className="w-8 h-8 text-workflow-primary" />
                    </div>
                    <h4 className="text-text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-3">Discover Alpha</h4>
                    <ArrowRight className="w-5 h-5 text-workflow-primary group-hover:translate-x-3 transition-transform" />
                </motion.div>
            </div>
        </section>
    );
};

export default RecommendedTalentSection;
