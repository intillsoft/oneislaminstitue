import React from 'react';
import { motion } from 'framer-motion';
import { Search, Zap, CheckCircle2, Clock } from 'lucide-react';

const AutoApplyStages = ({ status = 'idle', currentStage = 0 }) => {
    const stages = [
        { id: 'search', title: 'Searching', icon: Search, description: 'Finding new jobs matching your criteria' },
        { id: 'match', title: 'AI Matching', icon: Zap, description: 'Scoring jobs based on your profile' },
        { id: 'apply', title: 'Applying', icon: CheckCircle2, description: 'Submitting personalized applications' },
        { id: 'verify', title: 'Verifying', icon: Clock, description: 'Confirming application status' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {stages.map((stage, index) => {
                const isActive = index === currentStage && status === 'running';
                const isCompleted = index < currentStage || (status === 'completed' && index === stages.length - 1);
                const Icon = stage.icon;

                return (
                    <motion.div
                        key={stage.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative p-6 rounded-2xl border transition-all duration-300 ${isActive
                                ? 'bg-workflow-primary/10 border-workflow-primary/50 shadow-[0_0_20px_rgba(0,70,255,0.1)]'
                                : isCompleted
                                    ? 'bg-emerald-500/10 border-emerald-500/30'
                                    : 'bg-white/5 border-white/10'
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${isActive
                                    ? 'bg-workflow-primary text-white animate-pulse'
                                    : isCompleted
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-slate-800 text-slate-500'
                                }`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <h4 className={`font-semibold ${isActive || isCompleted ? 'text-white' : 'text-slate-400'}`}>
                                {stage.title}
                            </h4>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            {stage.description}
                        </p>

                        {isActive && (
                            <div className="absolute bottom-0 left-0 h-1 bg-workflow-primary animate-[shimmer_2s_infinite]" style={{ width: '100%' }} />
                        )}
                        {isCompleted && (
                            <div className="absolute top-2 right-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </div>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
};

export default AutoApplyStages;
