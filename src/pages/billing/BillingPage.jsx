import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Shield, Crown, CreditCard, LayoutDashboard, AlertCircle, Loader2, ExternalLink, ArrowUpRight, Settings, FileText, Heart, Globe, BookOpen } from 'lucide-react';
import { ElitePageHeader, EliteCard } from '../../components/ui/EliteCard';
import { useAuthContext } from '../../contexts/AuthContext';
import { useDonation } from '../../contexts/DonationContext';
import { donationService } from '../../services/donationService';
import { useToast } from '../../components/ui/Toast';

const BillingPage = () => {
    const { user } = useAuthContext();
    const { error: showError } = useToast();
    const { isProcessing } = useDonation();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await donationService.getDonationHistory(user?.id);
                setHistory(data);
            } catch (err) {
                showError("Could not load impact history");
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchHistory();
    }, [user]);

    const stats = {
        totalDonated: history.reduce((acc, curr) => acc + curr.amount, 0),
        impactUnits: Math.floor(history.reduce((acc, curr) => acc + curr.amount, 0) / 20),
        activePlans: history.filter(h => h.type === 'monthly').length
    };

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 min-h-screen pb-32">
            <ElitePageHeader
                title="Impact & Support"
                subtitle="Track your eternal legacy, manage recurring contributions, and view your impact portfolio."
                icon={Heart}
                action={
                    <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-2xl border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
                        <Shield size={14} className="fill-emerald-500/20" />
                        <span>Encrypted Donation Layer Active</span>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Current Impact Card */}
                <div className="lg:col-span-12">
                    <EliteCard className="p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/10 transition-all duration-700" />

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="flex gap-6 items-center">
                                <div className="w-20 h-20 rounded-[2.5rem] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                                    <Crown className="text-white w-10 h-10" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h2 className="text-3xl font-black text-slate-900 dark:text-white capitalize tracking-tighter">
                                            Patron of Knowledge
                                        </h2>
                                        <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20">
                                            Legacy Member
                                        </span>
                                    </div>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] opacity-60">
                                        Last Activity: {history[0]?.date || 'No history yet'} • Verified Digital Waqf
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 w-full md:w-auto">
                                <button
                                    className="flex-1 md:flex-none px-8 py-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                                >
                                    <Settings size={14} />
                                    Manage Methods
                                </button>
                                <button className="flex-1 md:flex-none px-8 py-4 rounded-2xl bg-slate-900 dark:bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3">
                                    <ExternalLink size={14} />
                                    Download Tax Receipt
                                </button>
                            </div>
                        </div>

                        {/* Impact Details */}
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-100 dark:border-white/5">
                            <UsageDetail
                                label="Total Contributions"
                                used={stats.totalDonated}
                                limit={-1}
                                icon={CreditCard}
                                suffix="$"
                            />
                            <UsageDetail
                                label="People Empowered"
                                used={stats.impactUnits}
                                limit={-1}
                                icon={Globe}
                            />
                            <UsageDetail
                                label="Active Monthly Plans"
                                used={stats.activePlans}
                                limit={-1}
                                icon={Zap}
                            />
                        </div>
                    </EliteCard>
                </div>

                {/* Donation History List */}
                <div className="lg:col-span-12">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black uppercase tracking-tight text-slate-800 dark:text-white">Transaction Registry</h3>
                        <button className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline">View All</button>
                    </div>
                    
                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="animate-spin text-emerald-500" size={32} />
                            </div>
                        ) : history.length > 0 ? (
                            history.map((item) => (
                                <EliteCard key={item.id} className="p-5 flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-emerald-500">
                                            <Shield size={20} />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 dark:text-white tracking-tight uppercase text-sm">${item.amount} {item.type} Donation</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.date} • {item.status}</p>
                                        </div>
                                    </div>
                                    <button className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 opacity-0 group-hover:opacity-100 transition-all">
                                        <ArrowUpRight size={18} />
                                    </button>
                                </EliteCard>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-slate-50 dark:bg-white/5 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10">
                                <Heart size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No donations found in your portfolio</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const UsageDetail = ({ label, used, limit, icon: Icon, suffix = "" }) => {
    const isUnlimited = limit === -1;
    const percentage = isUnlimited ? 100 : Math.min((used / limit) * 100, 100);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-xl border border-white/5">
                        <Icon className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
                </div>
                <span className="text-xs font-black font-mono text-slate-900 dark:text-white">
                    {suffix}{used}<span className="text-slate-500 mx-1">/</span>{isUnlimited ? '∞' : limit}
                </span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5 }}
                    className="h-full bg-emerald-500"
                />
            </div>
        </div>
    );
};

export default BillingPage;

