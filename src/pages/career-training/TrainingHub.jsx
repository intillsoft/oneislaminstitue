import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users, DollarSign, FileText, Target, Zap,
    ArrowRight, MessageSquare, Video, Brain, Award
} from 'lucide-react';
import { ElitePageHeader, EliteCard } from '../../components/ui/EliteCard';

const TrainingHub = () => {
    const navigate = useNavigate();

    const tools = [
        {
            id: 'viva',
            title: 'Academic Viva & Thesis Coach',
            description: 'Hyper-realistic simulations for thesis defense, grant proposals, and academic vivas with AI examiners.',
            icon: Users,
            color: 'from-blue-500 to-indigo-600',
            route: '/dashboard/interview-prep',
            features: ['Thesis Defense Analysis', 'Grant Pitch Simulation', 'Rhetoric & Logic Scoring']
        },
        {
            id: 'stipend',
            title: 'Stipend & Scholarship Negotiator',
            description: 'Pratice high-stakes scholarship and stipend discussions with an AI financial aid strategist.',
            icon: DollarSign,
            color: 'from-emerald-500 to-green-600',
            route: '/dashboard/negotiation',
            features: ['Tuition Grant Intelligence', 'Stipend Counter-offers', 'Funding Confidence Training']
        },
        {
            id: 'roast',
            title: 'Academic Portfolio Critique',
            description: 'Brutally honest, deep-dive analysis of your academic portfolio and research trajectory.',
            icon: FileText,
            color: 'from-orange-500 to-red-600',
            route: '/portfolio/critique',
            features: ['Publication Impact core', 'Academic Red Flag Scanner', 'Scholarship Readiness']
        },
        {
            id: 'path',
            title: 'Academic Path Strategist',
            description: 'Long-term academic mapping and specialization strategy based on global scholarly trends.',
            icon: Target,
            color: 'from-violet-500 to-purple-600',
            route: '/dashboard/career-advisor',
            features: ['Specialization Mapping', 'Knowledge Gap Analysis', 'Curator Team Transitioning']
        },
        {
            id: 'research',
            title: 'Research & Technical Drill',
            description: 'Adaptive technical assessments generated dynamically for your specific research field.',
            icon: Zap,
            color: 'from-pink-500 to-rose-600',
            route: '/dashboard/skill-bridge',
            features: ['Methodology Challenges', 'Abstract Critiques', 'Real-time Grading']
        }
    ];

    return (
        <div className="bg-private pb-20 w-full relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mb-6 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
                >
                    <ArrowRight className="rotate-180" size={16} />
                    Back to Dashboard
                </button>

                <ElitePageHeader
                    title="Elite Training Headquarters"
                    description="Advanced AI-powered simulators to prepare you for high-stakes career moments."
                    badge="Top Level Intelligence"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {tools.map((tool, index) => (
                        <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => navigate(tool.route)}
                            className="group relative cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative h-full bg-[#13182E]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 overflow-hidden hover:border-white/10 hover:transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                                {/* Decorator Gradient */}
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tool.color} opacity-10 blur-[50px] rounded-full transform translate-x-10 -translate-y-10`} />

                                <div className="flex items-start justify-between mb-6">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg group-hover:shadow-${tool.color.split('-')[1]}-500/30 transition-shadow`}>
                                        <tool.icon className="text-white w-7 h-7" />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
                                    {tool.title}
                                </h3>
                                <p className="text-sm text-slate-400 leading-relaxed mb-6 font-medium">
                                    {tool.description}
                                </p>

                                <div className="space-y-3 pt-6 border-t border-white/5">
                                    {tool.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${tool.color}`} />
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-400 transition-colors">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats / Progress Section */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <EliteCard variant="glass" className="p-8 flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <Video className="w-8 h-8 text-blue-500" />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white">0</div>
                            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Mock Interviews</div>
                        </div>
                    </EliteCard>
                    <EliteCard variant="glass" className="p-8 flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                            <DollarSign className="w-8 h-8 text-green-500" />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white">$0k</div>
                            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Salary Negotiated</div>
                        </div>
                    </EliteCard>
                    <EliteCard variant="glass" className="p-8 flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center">
                            <Award className="w-8 h-8 text-purple-500" />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white">Lvl 1</div>
                            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Readiness Score</div>
                        </div>
                    </EliteCard>
                </div>
            </div>
        </div>
    );
};

export default TrainingHub;
