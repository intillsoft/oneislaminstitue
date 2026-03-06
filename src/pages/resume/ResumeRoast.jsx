import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, AlertTriangle, FileText, CheckCircle2, ChevronRight, Loader2, RefreshCw, History, Trash2, Info, X, ShieldAlert, Scan, Target } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { trainingService } from '../../services/trainingService';
import { useToast } from '../../components/ui/Toast';
import DojoLayout from '../../components/layout/DojoLayout';

const ResumeRoast = () => {
    const [resumeText, setResumeText] = useState('');
    const [isRoasting, setIsRoasting] = useState(false);
    const [roastResult, setRoastResult] = useState(null);
    const [history, setHistory] = useState([]);
    const { success, error: showError } = useToast();

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const res = await trainingService.getHistory({ tool_type: 'roast' });
            if (res.data) setHistory(res.data);
        } catch (err) { }
    };

    const handleRoast = async () => {
        if (!resumeText.trim()) {
            showError('Awaiting Input Transmission.');
            return;
        }

        setIsRoasting(true);
        try {
            const prompt = `
            Act as a brutal, high-stakes Silicon Valley hiring manager. 
            Roast this resume. Be critical, direct, and slightly mean but constructive.
            Identify red flags, generic buzzwords, and weak impact.
            
            Resume Content:
            ${resumeText.slice(0, 4000)}
            
            Return JSON ONLY:
            {
                "score": (0-100),
                "roast_summary": "One sentence savage summary.",
                "red_flags": ["Critical flaw 1", "Critical flaw 2"],
                "generic_buzzwords_found": ["Synergy", "Result-oriented", ...],
                "improvements": ["Specific fix 1", "Specific fix 2"]
            }
            `;

            const response = await aiService.generateCompletion(prompt, {
                systemMessage: 'You are a ruthless Career Auditor. Output valid JSON only.',
                temperature: 0.7
            });

            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const result = JSON.parse(jsonMatch[0]);
                setRoastResult(result);

                await trainingService.saveSession({
                    tool_type: 'roast',
                    score: result.score,
                    title: `Audit: ${resumeText.slice(0, 20)}...`,
                    metadata: {
                        summary: result.roast_summary,
                        red_flags: result.red_flags,
                        resume_snippet: resumeText.slice(0, 200) + '...',
                        improvements: result.improvements
                    }
                });

                success('Audit Complete. Fatalities detected.');
                loadHistory();
            } else {
                throw new Error('Failed to parse roast');
            }
        } catch (err) {
            showError('Audit Error: Neural Link Severed.');
        } finally {
            setIsRoasting(false);
        }
    };

    const AuditReport = (
        <div className="h-full flex flex-col items-center py-12 px-6 overflow-y-auto custom-scrollbar">
            <div className="w-full max-w-3xl space-y-10">
                {/* Header Section */}
                <div className="flex flex-col items-start gap-4">
                    <div className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.3em]">
                        Document Auditor • V2.0
                    </div>
                    <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
                        Resume <br /><span className="text-red-600">Audit Log</span>
                    </h2>
                </div>

                {!roastResult ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        <div className="p-8 bg-black border-4 border-white relative group">
                            <div className="absolute -top-3 -left-3 px-3 py-1 bg-white text-black text-[10px] font-black uppercase">
                                Input Matrix
                            </div>
                            <textarea
                                value={resumeText}
                                onChange={e => setResumeText(e.target.value)}
                                className="w-full h-80 bg-transparent text-white focus:outline-none resize-none font-mono text-sm leading-relaxed placeholder:text-slate-800"
                                placeholder="PASTE RESUME CONTENT HERE FOR DEEP AUDIT..."
                            />
                            <div className="absolute bottom-4 right-4 flex items-center gap-4">
                                <span className="text-[10px] font-black text-slate-700 uppercase">{resumeText.length} CHARS</span>
                                <button
                                    onClick={handleRoast}
                                    disabled={isRoasting || !resumeText}
                                    className="px-8 py-3 bg-red-600 text-white font-black text-[12px] uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-3 active:translate-y-1"
                                >
                                    {isRoasting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
                                    {isRoasting ? 'Scanning...' : 'Execute Audit'}
                                </button>
                            </div>
                        </div>

                        {/* History Feed - Brutalist Style */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Previous File Scans</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {history.map(session => (
                                    <div
                                        key={session.id}
                                        onClick={() => session.metadata && setRoastResult({
                                            score: session.score,
                                            roast_summary: session.metadata.summary,
                                            red_flags: session.metadata.red_flags || [],
                                            improvements: session.metadata.improvements || []
                                        })}
                                        className="p-4 bg-zinc-900 border-2 border-white/10 hover:border-red-600 cursor-pointer transition-colors group flex justify-between items-center"
                                    >
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] font-black text-white uppercase truncate">{session.title}</p>
                                            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{new Date(session.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className={`text-xl font-black ${session.score < 50 ? 'text-red-600' : 'text-emerald-500'}`}>
                                            {session.score}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-10"
                    >
                        {/* Summary Block */}
                        <div className="relative p-10 bg-red-600 text-white border-4 border-white shadow-[12px_12px_0_0_rgba(255,255,255,0.1)]">
                            <button
                                onClick={() => setRoastResult(null)}
                                className="absolute top-4 right-4 p-2 hover:bg-white hover:text-red-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
                                <div className="space-y-4 max-w-xl">
                                    <div className="text-[12px] font-black uppercase tracking-[0.5em] opacity-80">Vitality Rating</div>
                                    <h3 className="text-4xl font-black italic uppercase leading-tight tracking-tight">
                                        "{roastResult.roast_summary}"
                                    </h3>
                                </div>
                                <div className="text-9xl font-black italic opacity-40 leading-none select-none">
                                    {roastResult.score}
                                </div>
                            </div>
                        </div>

                        {/* Red Flags & Heatmap */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-red-600 flex items-center gap-3">
                                    <ShieldAlert size={16} /> Fatal Errors Detected
                                </h4>
                                <div className="divide-y-2 divide-white/10 bg-black border-4 border-white">
                                    {roastResult.red_flags.map((flag, i) => (
                                        <div key={i} className="p-6 group hover:bg-red-600 transition-colors">
                                            <div className="text-[10px] font-black text-red-600 group-hover:text-white mb-2 uppercase tracking-widest">ERROR.0{i + 1}</div>
                                            <p className="text-sm font-bold text-white uppercase group-hover:text-white tracking-tight">{flag}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-3">
                                    <Target size={16} /> Priority Fixes
                                </h4>
                                <div className="divide-y-2 divide-white/10 bg-black border-4 border-white">
                                    {roastResult.improvements.map((imp, i) => (
                                        <div key={i} className="p-6 group hover:bg-emerald-600 transition-colors">
                                            <div className="text-[10px] font-black text-emerald-500 group-hover:text-white mb-2 uppercase tracking-widest">RECOVERY.0{i + 1}</div>
                                            <p className="text-sm font-bold text-white uppercase group-hover:text-white tracking-tight">{imp}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Reset Call */}
                        <div className="flex justify-center pt-8 border-t-4 border-white/5">
                            <button
                                onClick={() => { setRoastResult(null); setResumeText(''); }}
                                className="px-12 py-5 border-4 border-white text-white font-black uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all active:translate-y-2"
                            >
                                Re-Initialize Scan
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );

    return (
        <DojoLayout
            title="Resume Audit"
            subtitle="Secure Document Scrutiny"
            headerActions={
                <div className="flex items-center gap-4">
                    <div className="px-4 py-1.5 bg-red-600 rounded-lg text-white text-[10px] font-black uppercase tracking-widest">
                        System Online
                    </div>
                </div>
            }
            backPath="/career-training"
        >
            {AuditReport}
        </DojoLayout>
    );
};

export default ResumeRoast;
