import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, MessageSquare, CheckCircle, ChevronDown, ChevronUp, Loader2, Video, Mic, StopCircle, User, Volume2, MicOff, Camera, History, Trash2, X, Command, Activity, Zap, ShieldAlert } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { useToast } from '../../components/ui/Toast';
import { EliteCard } from '../../components/ui/EliteCard';
import DojoLayout from '../../components/layout/DojoLayout';

const InterviewPrep = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeQuestion, setActiveQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const [mode, setMode] = useState('video'); // Changed default to video for cockpit feel
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const recognitionRef = useRef(null);

    const { success, error: showError } = useToast();

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setTranscript(prev => prev + ' ' + finalTranscript);
                    setUserAnswer(prev => prev + ' ' + finalTranscript);
                }
            };
        }
    }, []);

    useEffect(() => {
        if (mode === 'video' && activeQuestion !== null) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [mode, activeQuestion]);

    const startCamera = async () => {
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            }
        } catch (err) {
            showError("Could not access camera/microphone.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const startRecording = () => {
        setTranscript('');
        setUserAnswer('');
        setIsRecording(true);
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
            } catch (e) { }
        }
    };

    const stopRecording = () => {
        setIsRecording(false);
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const handleGenerateQuestions = async () => {
        if (!jobDescription.trim()) {
            showError('Please enter a job description');
            return;
        }

        setIsLoading(true);
        setQuestions([]);
        setActiveQuestion(null);
        setAnalysis(null);

        try {
            const response = await aiService.generateInterviewQuestions(jobDescription);
            if (response && response.questions) {
                setQuestions(response.questions);
                success(`Simulator Loaded: ${response.questions.length} Challenges.`);
            }
        } catch (err) {
            showError('Failed to generate questions.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnalyzeAnswer = async (question) => {
        const answerToAnalyze = mode === 'video' ? transcript || userAnswer : userAnswer;
        if (!answerToAnalyze.trim()) {
            showError('Please provide an answer first');
            return;
        }

        setIsAnalyzing(true);
        try {
            const result = await aiService.analyzeAnswer(question, answerToAnalyze, jobDescription);
            setAnalysis(result.analysis);
        } catch (err) {
            showError('Failed to analyze answer.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const [history, setHistory] = useState([]);
    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const res = await aiService.training.getHistory({ tool_type: 'interview' });
            if (res.data) setHistory(res.data);
        } catch (err) { }
    };

    const cockpitMain = (
        <div className="h-full flex flex-col p-6 space-y-6">
            {!questions.length ? (
                <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
                    <div className="w-full relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-3xl opacity-20 blur group-hover:opacity-40 transition" />
                        <div className="relative p-10 bg-[#0A0E27]/90 rounded-3xl border border-blue-500/20 shadow-2xl space-y-8">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <Brain className="w-8 h-8 text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">Initialize Cockpit</h2>
                                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Awaiting Simulation Parameters</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Target Objectives (Job Description)</label>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste job requirements to calibrate the neural simulator..."
                                    className="w-full h-48 p-6 rounded-2xl border border-white/5 bg-black/40 text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-800 text-sm font-medium resize-none"
                                />
                            </div>

                            <button
                                onClick={handleGenerateQuestions}
                                disabled={isLoading || !jobDescription.trim()}
                                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.4em] hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-4"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Activity size={18} /> Sync Neural Core</>}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
                    {/* Left: Cockpit Controls & HUD */}
                    <div className="lg:col-span-8 flex flex-col space-y-6 overflow-hidden">
                        {/* Immersive HUD Area */}
                        <div className="relative flex-1 bg-[#050714] rounded-[2rem] border border-blue-500/20 overflow-hidden shadow-2xl">
                            {/* HUD Overlays */}
                            <div className="absolute inset-x-8 top-8 flex justify-between items-start pointer-events-none z-10">
                                <div className="flex flex-col gap-2">
                                    <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                        Simulator Active
                                    </div>
                                    <div className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Neural Link: 100% stable</div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="px-4 py-2 bg-black/40 border border-white/10 rounded-full flex items-center gap-3 backdrop-blur-xl">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className={`w-1 h-3 rounded-full ${i <= 4 ? 'bg-blue-500' : 'bg-slate-800'}`} />
                                            ))}
                                        </div>
                                        <span className="text-[9px] font-black text-white uppercase">Audio Input</span>
                                    </div>
                                    <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-[9px] font-black text-red-500 uppercase tracking-widest backdrop-blur-xl">
                                        {isRecording ? 'Rec ON' : 'Standby'}
                                    </div>
                                </div>
                            </div>

                            {activeQuestion !== null ? (
                                <div className="absolute inset-0 flex flex-col">
                                    <div className="flex-1 relative">
                                        {mode === 'video' ? (
                                            <video ref={videoRef} autoPlay muted className="w-full h-full object-cover grayscale opacity-60 mix-blend-screen" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-t from-blue-900/10 to-transparent">
                                                <Brain size={120} className="text-blue-500/10" />
                                            </div>
                                        )}

                                        {/* Question Plate */}
                                        <div className="absolute inset-x-12 bottom-32 flex flex-col items-center">
                                            <motion.div
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="bg-black/60 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl text-center max-w-3xl"
                                            >
                                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">Challenge Alpha</p>
                                                <h3 className="text-2xl font-black text-white leading-tight tracking-tight italic">
                                                    "{questions[activeQuestion]}"
                                                </h3>
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Control Bar */}
                                    <div className="h-24 px-12 bg-[#0A0E27]/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <button
                                                onClick={() => setMode(mode === 'video' ? 'text' : 'video')}
                                                className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all"
                                            >
                                                {mode === 'video' ? <MessageSquare size={18} /> : <Video size={18} />}
                                            </button>
                                            <div className="w-px h-8 bg-white/10" />
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={toggleRecording}
                                                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-600 shadow-[0_0_25px_rgba(220,38,38,0.5)]' : 'bg-white text-black hover:scale-105'}`}
                                                >
                                                    {isRecording ? <StopCircle size={24} /> : <Mic size={24} />}
                                                </button>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{isRecording ? 'Recording Output' : 'Audio Input Off'}</span>
                                                    <span className="text-[8px] font-bold text-slate-500 uppercase">{isRecording ? 'Capturing Neural Response' : 'Click to begin transmission'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleAnalyzeAnswer(questions[activeQuestion])}
                                            disabled={isAnalyzing || (!transcript && !userAnswer)}
                                            className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-blue-500 transition-all disabled:opacity-30 disabled:grayscale flex items-center gap-3"
                                        >
                                            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShieldAlert size={14} /> Commit Response</>}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-6">
                                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-blue-500/30 flex items-center justify-center">
                                        <Zap className="text-blue-500/30" size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-500 uppercase tracking-widest">Challenge Pending</h3>
                                        <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest mt-2">Select a neural node on the right to begin</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Transcript Panel (Only if active) */}
                        {isRecording || transcript ? (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="h-40 bg-[#0A0E27]/50 rounded-3xl border border-white/5 p-6 relative group overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/20" />
                                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Activity size={10} /> Live Neural Reconstruction
                                </p>
                                <div className="text-sm text-slate-400 font-medium leading-relaxed overflow-y-auto h-20 custom-scrollbar pr-4 italic">
                                    "{transcript || userAnswer || '...'}"
                                </div>
                            </motion.div>
                        ) : null}
                    </div>

                    {/* Right: Neural Nodes (Questions) */}
                    <div className="lg:col-span-4 flex flex-col space-y-6 overflow-hidden">
                        <div className="flex-1 bg-[#0A0E27]/50 rounded-[2rem] border border-white/5 flex flex-col overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                    <Command size={14} /> Node Manifest
                                </h4>
                                <button onClick={() => setQuestions([])} className="p-2 hover:bg-red-500/10 text-slate-700 hover:text-red-500 transition-colors rounded-lg">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                {questions.map((q, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveQuestion(idx)}
                                        className={`w-full p-5 rounded-2xl border text-left transition-all group ${activeQuestion === idx ? 'bg-blue-600/10 border-blue-500/40' : 'bg-[#050714] border-white/5 hover:border-white/10'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${activeQuestion === idx ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-600'}`}>
                                                0{idx + 1}
                                            </div>
                                            <p className={`text-[11px] font-bold leading-tight ${activeQuestion === idx ? 'text-white' : 'text-slate-500 group-hover:text-slate-400'}`}>
                                                {q.substring(0, 60)}...
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Analysis Feedback HUD */}
                        <AnimatePresence>
                            {analysis && (
                                <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 20, opacity: 0 }}
                                    className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 p-6 opacity-10">
                                        <Brain size={100} />
                                    </div>
                                    <div className="relative z-10">
                                        <h4 className="text-[10px] font-black text-blue-200 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                                            <ShieldAlert size={14} /> Analysis Output
                                        </h4>
                                        <div className="text-xs text-white leading-relaxed font-bold italic prose prose-invert opacity-90 max-h-48 overflow-y-auto custom-scrollbar pr-4">
                                            {analysis}
                                        </div>
                                        <button
                                            onClick={() => setAnalysis(null)}
                                            className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                                        >
                                            Dismiss Log
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <DojoLayout
            title="Interview Simulator"
            subtitle="Cockpit Omega • Neural Training"
            headerActions={
                <div className="flex items-center gap-4">
                    <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase flex items-center gap-2">
                        <Activity size={12} className="animate-pulse" />
                        Live Sim Mode
                    </div>
                </div>
            }
            backPath="/career-training"
        >
            {cockpitMain}
        </DojoLayout>
    );
};

export default InterviewPrep;
