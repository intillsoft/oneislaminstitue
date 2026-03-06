import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from 'components/AppIcon';
import { apiService } from '../../../lib/api';
import { EliteCard } from '../../../components/ui/EliteCard';

const MessageImprovement = ({ originalMessage, onImproved, onClose }) => {
    const [improving, setImproving] = useState(false);
    const [result, setResult] = useState('');

    const handleImprove = async (type) => {
        setImproving(true);
        try {
            const response = await apiService.messages.improveMessage(originalMessage, type);
            if (response.data && response.data.improved) {
                setResult(response.data.improved);
            }
        } catch (error) {
            console.error('Failed to improve message:', error);
        } finally {
            setImproving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#00040A]/80 backdrop-blur-2xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-2xl"
            >
                <EliteCard className="overflow-hidden border-blue-500/20 bg-[#0D1929]/90">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                                <Icon name="Sparkles" className="text-blue-500" size={24} />
                                Neural Enhancement
                            </h3>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Refining semantic precision via LLM protocol</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                            <Icon name="X" size={20} />
                        </button>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Original */}
                        <div>
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3 block">Input Protocol</label>
                            <div className="p-5 bg-white/5 border border-white/5 rounded-2xl text-slate-400 text-sm italic">
                                "{originalMessage}"
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { id: 'professional', label: 'CORPORATE', icon: 'Briefcase', color: 'text-blue-400' },
                                { id: 'friendly', label: 'SOCIAL', icon: 'Smile', color: 'text-emerald-400' },
                                { id: 'concise', label: 'EFFICIENT', icon: 'Zap', color: 'text-amber-400' },
                                { id: 'clear', label: 'DIRECT', icon: 'Target', color: 'text-rose-400' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleImprove(opt.id)}
                                    disabled={improving}
                                    className="flex flex-col items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-blue-600/10 hover:border-blue-500/30 transition-all group"
                                >
                                    <Icon name={opt.icon} size={20} className={`${opt.color} group-hover:scale-110 transition-transform`} />
                                    <span className="text-[9px] font-black tracking-widest text-slate-500 group-hover:text-white">{opt.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Result */}
                        {(improving || result) && (
                            <div className="pt-8 border-t border-white/5 animate-in fade-in slide-in-from-bottom-4">
                                <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-3 block">Enhanced Output</label>
                                <div className={`p-6 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-blue-50 text-base leading-relaxed relative ${improving ? 'animate-pulse' : ''}`}>
                                    {improving ? 'Neural processor at work...' : result}
                                    {!improving && result && (
                                        <button
                                            onClick={() => onImproved(result)}
                                            className="absolute -bottom-6 right-0 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                                        >
                                            Commit Change
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </EliteCard>
            </motion.div>
        </div>
    );
};

export default MessageImprovement;
