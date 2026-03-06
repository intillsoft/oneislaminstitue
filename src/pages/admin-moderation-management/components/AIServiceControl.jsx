import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { EliteCard } from '../../../components/ui/EliteCard';

const AIServiceControl = () => {
    const [services, setServices] = useState([
        { id: 'matching_engine', name: 'Neural Job Matching', status: 'operational', load: 12, latency: '45ms', throughput: '1.2k/s' },
        { id: 'resume_synthesis', name: 'Deep Resume Synthesis', status: 'degraded', load: 88, latency: '1.2s', throughput: '45/s' },
        { id: 'bias_radar', name: 'Bias Detection Alpha', status: 'operational', load: 5, latency: '12ms', throughput: '800/s' },
        { id: 'career_oracle', name: 'Predictive Career Oracle', status: 'operational', load: 24, latency: '150ms', throughput: '300/s' },
    ]);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <EliteCard className="p-8 border-white/5 bg-blue-600 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                            <Icon name="Cpu" size={24} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-white/60 uppercase tracking-[0.2em] mb-1">Compute Load</h3>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">4.2 TFLOPs</h2>
                        </div>
                    </div>
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                        <div className="w-2/3 h-full bg-white shadow-[0_0_10px_#fff]" />
                    </div>
                </EliteCard>

                <EliteCard className="p-8 border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <Icon name="Activity" size={24} className="text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Global Latency</h3>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">142ms</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className={`flex-1 h-6 rounded-sm ${i > 7 ? 'bg-emerald-500' : 'bg-emerald-500/20'}`} />
                        ))}
                    </div>
                </EliteCard>

                <EliteCard className="p-8 border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                            <Icon name="Zap" size={24} className="text-purple-500" />
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Token Velocity</h3>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">8.5M/Hr</h2>
                        </div>
                    </div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                        Real-time processing active
                    </div>
                </EliteCard>
            </div>

            <EliteCard className="overflow-hidden border-white/5 bg-white/[0.01]">
                <div className="p-8 border-b border-white/5">
                    <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">AI Service Registry</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.02]">
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Service Identifier</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Current Status</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Pressure Load</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Latency Profile</th>
                                <th className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Governance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {services.map((service) => (
                                <tr key={service.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-black text-white uppercase tracking-tight">{service.name}</div>
                                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{service.id}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${service.status === 'operational'
                                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${service.status === 'operational' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                            {service.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-black text-white">{service.load}%</td>
                                    <td className="px-8 py-6 text-sm font-black text-slate-400">{service.latency}</td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-20 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 bg-white/5 rounded-lg border border-white/5 hover:text-blue-500"><Icon name="Settings" size={14} /></button>
                                            <button className="p-2 bg-white/5 rounded-lg border border-white/5 hover:text-rose-500"><Icon name="Power" size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </EliteCard>
        </div>
    );
};

export default AIServiceControl;
