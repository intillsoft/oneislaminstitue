import React from 'react';
import Icon from 'components/AppIcon';
import { EliteCard } from '../../../components/ui/EliteCard';

const FinancialIntelligence = () => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <EliteCard className="p-8 border-white/5 bg-white/[0.02]">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Gross Endowment</h3>
                    <p className="text-3xl font-bold text-white mb-2">$842,500.00</p>
                    <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                        <Icon name="TrendingUp" size={12} />
                        +14.2% Growth
                    </div>
                </EliteCard>

                <EliteCard className="p-8 border-white/5 bg-white/[0.02]">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Active Scholarships</h3>
                    <p className="text-3xl font-bold text-white mb-2">$124,200.00</p>
                    <div className="flex items-center gap-2 text-blue-500 text-[10px] font-bold uppercase tracking-widest">
                        <Icon name="Users" size={12} />
                        1.4k Active Seats
                    </div>
                </EliteCard>

                <EliteCard className="p-8 border-white/5 bg-white/[0.02]">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Retention Index</h3>
                    <p className="text-3xl font-bold text-white mb-2">98.4%</p>
                    <div className="flex items-center gap-2 text-rose-500 text-[10px] font-bold uppercase tracking-widest">
                        <Icon name="TrendingDown" size={12} />
                        -0.2% Churn Pulse
                    </div>
                </EliteCard>

                <EliteCard className="p-8 border-white/5 bg-emerald-600 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                    <h3 className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mb-4">Academic Capital</h3>
                    <p className="text-3xl font-bold text-white mb-2">$2.4M</p>
                    <button className="mt-4 w-full py-2 bg-white/20 rounded-xl text-[9px] font-bold uppercase tracking-[0.3em] text-white hover:bg-white/30 transition-all">
                        Endowment Registry
                    </button>
                </EliteCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <EliteCard className="p-8 border-white/5 bg-white/[0.01]">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-sm font-bold text-white uppercase tracking-[0.3em]">Knowledge Yield</h2>
                        <Icon name="Activity" size={16} className="text-slate-700" />
                    </div>
                    <div className="h-64 flex items-end gap-2 px-4">
                        {[40, 70, 45, 90, 65, 80, 50, 60, 95, 85, 40, 60].map((h, i) => (
                            <div key={i} className="flex-1 group relative">
                                <div
                                    className="w-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-all rounded-t-lg"
                                    style={{ height: `${h}%` }}
                                />
                                <div className="absolute -bottom-6 left-0 w-full text-center text-[8px] font-bold text-slate-600 uppercase">
                                    M{i + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </EliteCard>

                <EliteCard className="p-8 border-white/5 bg-white/[0.01]">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-sm font-bold text-white uppercase tracking-[0.3em]">Institutional Overheads</h2>
                        <button className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest hover:text-white transition-colors">Optimize Registry</button>
                    </div>
                    <div className="space-y-6">
                        {[
                            { label: 'Cloud Infrastructure', value: 42, color: 'bg-blue-500' },
                            { label: 'AI Scholarly Models', value: 28, color: 'bg-purple-500' },
                            { label: 'Content Propagation', value: 15, color: 'bg-emerald-500' },
                            { label: 'Corporate Stewardship', value: 15, color: 'bg-slate-500' },
                        ].map((item) => (
                            <div key={item.label} className="space-y-2">
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-slate-500">{item.label}</span>
                                    <span className="text-white">{item.value}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </EliteCard>
            </div>
        </div>
    );
};

export default FinancialIntelligence;
