import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, MessageSquare, CheckCircle, ChevronDown, ChevronUp, Loader2, Video, Mic, StopCircle, User, Volume2, MicOff, Camera } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { useToast } from '../../components/ui/Toast';

const InterviewPrep = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeQuestion, setActiveQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Video & Speech State
    const [mode, setMode] = useState('text'); // 'text' or 'video'
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const recognitionRef = useRef(null);

    const { success, error: showError } = useToast();

    // Initialize Speech Recognition
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

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                if (isRecording) { // If supposed to be recording but errored, try restarting or notify
                    if (event.error === 'no-speech') return;
                    showError('Speech recognition error: ' + event.error);
                }
            };
        }
    }, [isRecording]); // Re-init if needed, but mostly static ref

    // Handle Video Stream
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
            console.error("Camera access error:", err);
            showError("Could not access camera/microphone. Please check permissions.");
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
        setUserAnswer(''); // Clear previous for new attempt
        setIsRecording(true);
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error("Recognition start error:", e);
            }
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
                success(`Generated ${response.questions.length} interview questions!`);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('Error generating questions:', err);
            showError('Failed to generate questions. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnalyzeAnswer = async (question) => {
        const answerToAnalyze = mode === 'video' ? transcript || userAnswer : userAnswer;

        if (!answerToAnalyze.trim()) {
            showError('Please write or record an answer first');
            return;
        }

        setIsAnalyzing(true);
        try {
            const result = await aiService.analyzeAnswer(question, answerToAnalyze, jobDescription);
            setAnalysis(result.analysis);
        } catch (err) {
            console.error('Error analyzing answer:', err);
            showError('Failed to analyze answer.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
            {/* Header */}
            <div className="text-center space-y-6">
                <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="inline-block p-4 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 relative shadow-xl"
                >
                    <Brain className="w-14 h-14 text-blue-600 dark:text-blue-400" />
                    <div className="absolute -top-1 -right-1 flex gap-1">
                        <span className="flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    </div>
                </motion.div>

                <div className="space-y-2">
                    <div className="flex items-center justify-center gap-3">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            AI Interview Coach
                        </h1>
                        <span className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-lg shadow-purple-500/30">
                            PRO
                        </span>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
                        Master your interview skills with real-time AI feedback.
                        Switch to <span className="text-blue-600 dark:text-blue-400 font-bold">Video Mode</span> for body language analysis.
                    </p>
                </div>

                {/* Premium Mode Switcher */}
                <div className="flex justify-center mt-6">
                    <div className="flex bg-white/50 dark:bg-gray-800/50 p-1.5 rounded-2xl backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-sm">
                        <button
                            onClick={() => setMode('text')}
                            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${mode === 'text'
                                ? 'bg-white dark:bg-[#1E2640] text-blue-600 dark:text-blue-400 shadow-lg scale-105'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            Text Practice
                        </button>
                        <button
                            onClick={() => setMode('video')}
                            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${mode === 'video'
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <Video className="w-4 h-4" />
                            Video Simulation
                        </button>
                    </div>
                </div>
            </div>

            {/* Input Section */}
            {!questions.length && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 dark:bg-[#13182E]/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50"
                >
                    <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Paste Job Description
                    </label>
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500"></div>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job requirements here to generate tailored questions..."
                            className="relative w-full h-64 p-6 rounded-xl border border-gray-200 dark:border-[#1E2640] bg-white dark:bg-[#0A0E27] text-gray-900 dark:text-white focus:ring-0 focus:outline-none focus:border-blue-500 transition-all text-lg resize-none shadow-inner"
                        />
                    </div>
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleGenerateQuestions}
                            disabled={isLoading || !jobDescription.trim()}
                            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <span className="relative flex items-center gap-3">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Analyzing Role...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Generate Interview Session
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Questions Interface */}
            <AnimatePresence>
                {questions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between px-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <MessageSquare className="w-6 h-6 text-blue-500" />
                                Your Personalized Interview
                            </h2>
                            <button
                                onClick={() => setQuestions([])}
                                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                            >
                                End Session
                            </button>
                        </div>

                        {questions.map((q, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`group rounded-2xl overflow-hidden transition-all duration-300 ${activeQuestion === idx
                                    ? 'bg-white dark:bg-[#13182E] shadow-2xl ring-2 ring-blue-500/50 scale-[1.02]'
                                    : 'bg-white/60 dark:bg-[#13182E]/60 hover:bg-white dark:hover:bg-[#13182E] border border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                                    }`}
                            >
                                <button
                                    onClick={() => {
                                        if (activeQuestion === idx) {
                                            setActiveQuestion(null);
                                            stopRecording();
                                            stopCamera();
                                        } else {
                                            setActiveQuestion(idx);
                                            setUserAnswer('');
                                            setAnalysis(null);
                                            setTranscript('');
                                            setIsRecording(false);
                                        }
                                    }}
                                    className="w-full text-left p-6 flex items-start justify-between"
                                >
                                    <div className="flex gap-5">
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-lg transition-colors ${activeQuestion === idx
                                            ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:text-blue-500'
                                            }`}>
                                            {idx + 1}
                                        </div>
                                        <span className={`text-lg font-semibold pt-1 transition-colors ${activeQuestion === idx ? 'text-blue-900 dark:text-blue-100' : 'text-gray-700 dark:text-gray-300'
                                            }`}>
                                            {q}
                                        </span>
                                    </div>
                                    {activeQuestion === idx ? (
                                        <ChevronUp className="w-6 h-6 text-blue-500" />
                                    ) : (
                                        <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
                                    )}
                                </button>

                                <AnimatePresence>
                                    {activeQuestion === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="border-t border-gray-100 dark:border-[#1E2640] bg-gray-50/50 dark:bg-[#0A0E27]/30"
                                        >
                                            <div className="p-8 space-y-8">
                                                {mode === 'video' ? (
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 group/video">
                                                            <video
                                                                ref={videoRef}
                                                                autoPlay
                                                                muted
                                                                className="w-full h-full object-cover transform scale-x-[-1]"
                                                            />
                                                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-6">
                                                                <button
                                                                    onClick={toggleRecording}
                                                                    className={`p-4 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl ${isRecording
                                                                        ? 'bg-red-500 hover:bg-red-600 ring-4 ring-red-500/30 animate-pulse'
                                                                        : 'bg-white hover:bg-gray-100 text-gray-900'
                                                                        }`}
                                                                >
                                                                    {isRecording ? <StopCircle className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8" />}
                                                                </button>
                                                            </div>
                                                            {isRecording && (
                                                                <div className="absolute top-4 right-4 px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse shadow-lg flex items-center gap-2">
                                                                    <span className="w-2 h-2 rounded-full bg-white"></span>
                                                                    LIVE REC
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col h-full bg-white dark:bg-[#13182E] rounded-2xl border border-gray-200 dark:border-[#1E2640] shadow-sm overflow-hidden">
                                                            <div className="p-4 border-b border-gray-100 dark:border-[#1E2640] bg-gray-50 dark:bg-[#1A2139] flex justify-between items-center">
                                                                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                                    <MessageSquare className="w-4 h-4 text-purple-500" />
                                                                    Live Transcript
                                                                </h4>
                                                                {transcript && <span className="text-xs text-green-500 font-medium">Active</span>}
                                                            </div>
                                                            <div className="flex-1 p-6 overflow-y-auto text-gray-600 dark:text-gray-300 space-y-2 text-sm leading-relaxed">
                                                                {transcript || userAnswer ? (
                                                                    <p>{transcript || userAnswer}</p>
                                                                ) : (
                                                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 opacity-60">
                                                                        <MicOff className="w-8 h-8" />
                                                                        <p>Start recording to begin transcript...</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="p-4 bg-gray-50 dark:bg-[#1A2139] border-t border-gray-100 dark:border-[#1E2640]">
                                                                <button
                                                                    onClick={() => handleAnalyzeAnswer(q)}
                                                                    disabled={isAnalyzing || (!transcript && !userAnswer)}
                                                                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                                                    Analyze My Answer
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-6">
                                                        <div className="relative">
                                                            <div className="absolute top-0 right-0 p-2">
                                                                <span className="text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                                                                    Markdown Supported
                                                                </span>
                                                            </div>
                                                            <textarea
                                                                value={userAnswer}
                                                                onChange={(e) => setUserAnswer(e.target.value)}
                                                                placeholder="Type your structured answer here. Use the STAR method..."
                                                                className="w-full h-56 p-6 rounded-2xl border border-gray-200 dark:border-[#1E2640] bg-white dark:bg-[#13182E] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow shadow-inner text-base leading-relaxed resize-none"
                                                            />
                                                        </div>
                                                        <div className="flex justify-end">
                                                            <button
                                                                onClick={() => handleAnalyzeAnswer(q)}
                                                                disabled={isAnalyzing || !userAnswer.trim()}
                                                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center gap-2 disabled:opacity-50"
                                                            >
                                                                {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                                                Analyze Answer
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Analysis Report Card */}
                                                {analysis && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl border border-green-100 dark:border-green-800/30 overflow-hidden shadow-lg"
                                                    >
                                                        <div className="p-6 border-b border-green-100 dark:border-green-800/30 flex items-center gap-4 bg-green-100/50 dark:bg-green-900/20">
                                                            <div className="p-3 bg-green-500 text-white rounded-xl shadow-md">
                                                                <CheckCircle className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-green-900 dark:text-green-100 text-lg">AI Feedback Report</h4>
                                                                <p className="text-xs text-green-700 dark:text-green-300 font-medium opacity-80">Generated by Coach AI</p>
                                                            </div>
                                                        </div>
                                                        <div className="p-8 prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-7">
                                                            {analysis}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InterviewPrep;
