import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Heart, Target, Loader2, PieChart, Building2, Check, AlertCircle } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { useToast } from '../../components/ui/Toast';

const CultureFit = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        jobDescription: '',
        values: {
            workLifeBalance: true,
            innovation: true,
            collaboration: true,
            diversity: false,
            fastPaced: false,
            stability: false
        }
    });
    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { error: showError } = useToast();

    const handleToggleValue = (key) => {
        setFormData(prev => ({
            ...prev,
            values: { ...prev.values, [key]: !prev.values[key] }
        }));
    };

    const handleAnalyze = async () => {
        if (!formData.companyName) {
            showError('Please enter a company name.');
            return;
        }

        setIsLoading(true);
        setReport(null);

        const selectedValues = Object.entries(formData.values)
            .filter(([_, v]) => v)
            .map(([k, _]) => k.replace(/([A-Z])/g, ' $1').trim());

        const prompt = `
      Analyze the company culture for: ${formData.companyName}.
      Job Description Context: ${formData.jobDescription || "General company profile"}
      
      My Top Values: ${selectedValues.join(', ')}.
      
      For each of my values, provide a compatibility score (0-100) and a brief reason based on public knowledge or the JD.
      Also provide an "Overall Fit Score".
      
      Format the output as valid JSON:
      {
         "overallScore": 85,
         "summary": "Short summary string...",
         "breakdown": [
            { "value": "Work Life Balance", "score": 70, "reason": "Accenture is known for high intensity..." },
            ...
         ]
      }
    `;

        try {
            const response = await aiService.generateCompletion(prompt, {
                systemMessage: "You are a corporate culture analyst. Output strict JSON only.",
                temperature: 0.5
            });

            // Attempt to parse JSON
            let data;
            try {
                const jsonMatch = response.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    data = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error("No JSON found");
                }
            } catch (e) {
                // Fallback mock if parsing fails
                console.error("JSON Parse error", e);
                data = {
                    overallScore: 0,
                    summary: "Could not parse detailed metrics, but here is the raw analysis: " + response.substring(0, 100) + "...",
                    breakdown: []
                };
            }

            setReport(data);
        } catch (err) {
            console.error('Analysis error:', err);
            showError('Failed to analyze culture.');
        } finally {
            setIsLoading(false);
        }
    };

    // Custom Radar Chart Component
    const RadarChart = ({ data }) => {
        const size = 300;
        const center = size / 2;
        const radius = size * 0.4;
        const points = data.map((item, i) => {
            const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
            const value = item.score / 100;
            const x = center + radius * value * Math.cos(angle);
            const y = center + radius * value * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');

        return (
            <div className="relative flex items-center justify-center py-6">
                <svg width={size} height={size} className="overflow-visible">
                    {/* Grid Circles */}
                    {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
                        <circle
                            key={i}
                            cx={center}
                            cy={center}
                            r={radius * scale}
                            fill="none"
                            stroke="currentColor"
                            className="text-gray-100 dark:text-gray-800"
                            strokeWidth="1"
                        />
                    ))}
                    {/* Axes */}
                    {data.map((_, i) => {
                        const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
                        const x = center + radius * Math.cos(angle);
                        const y = center + radius * Math.sin(angle);
                        return (
                            <line
                                key={i}
                                x1={center}
                                y1={center}
                                x2={x}
                                y2={y}
                                stroke="currentColor"
                                className="text-gray-100 dark:text-gray-800"
                                strokeWidth="1"
                            />
                        );
                    })}
                    {/* Data Polygon */}
                    <polygon
                        points={points}
                        fill="rgba(236, 72, 153, 0.2)"
                        stroke="#ec4899"
                        strokeWidth="3"
                    />
                    {/* Points & Labels */}
                    {data.map((item, i) => {
                        const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
                        const x = center + (radius + 20) * Math.cos(angle);
                        const y = center + (radius + 20) * Math.sin(angle);
                        return (
                            <g key={i}>
                                <text
                                    x={x}
                                    y={y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="text-[10px] font-bold fill-gray-500 uppercase tracking-wider"
                                >
                                    {item.value.split(" ").map(w => w[0]).join("")}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-[#0A0E27] p-6 pt-24 font-sans">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex p-4 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 shadow-lg shadow-pink-500/30"
                    >
                        <Heart className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
                        Culture <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Vibe Check</span>
                    </h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto font-medium">
                        Analyze compatibility beyond the job description. Find your tribe.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Inputs */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-5 space-y-6"
                    >
                        <div className="bg-white dark:bg-[#13182E] p-8 rounded-3xl shadow-xl border border-neutral-100 dark:border-neutral-800 space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                    <Building2 className="w-4 h-4" /> Target Company
                                </h3>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        placeholder="Company Name (e.g. Netflix)"
                                        className="w-full p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-[#0A0E27] text-neutral-900 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none transition-all font-bold text-lg placeholder:font-medium"
                                    />
                                    <textarea
                                        value={formData.jobDescription}
                                        onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                                        placeholder="Paste Mission Statement or Values (Optional)..."
                                        className="w-full h-24 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-[#0A0E27] text-neutral-900 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none resize-none text-sm font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                    <Target className="w-4 h-4" /> Your Values
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(formData.values).map(([key, isActive]) => (
                                        <button
                                            key={key}
                                            onClick={() => handleToggleValue(key)}
                                            className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between transition-all border-2 ${isActive
                                                ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-300 border-pink-500'
                                                : 'bg-neutral-50 dark:bg-[#0A0E27] text-neutral-500 dark:text-neutral-400 border-transparent hover:border-neutral-200'
                                                }`}
                                        >
                                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            {isActive && <div className="w-2 h-2 rounded-full bg-pink-500"></div>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={isLoading || !formData.companyName}
                                className="w-full py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Running Vibe Check...
                                    </>
                                ) : (
                                    <>
                                        <PieChart className="w-5 h-5" /> Analyze Fit
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>

                    {/* Results */}
                    <motion.div
                        className="lg:col-span-7"
                        layout
                    >
                        <AnimatePresence mode="wait">
                            {report ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white dark:bg-[#13182E] rounded-3xl shadow-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden"
                                >
                                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-[#0F1325] dark:to-[#1A2139] text-white">
                                        <div>
                                            <p className="text-pink-400 font-bold tracking-widest uppercase text-xs mb-2">Compatibility Score</p>
                                            <div className="flex items-baseline gap-2 mb-4">
                                                <span className="text-7xl font-black tracking-tighter">
                                                    {report.overallScore}%
                                                </span>
                                            </div>
                                            <p className="text-neutral-300 leading-relaxed font-medium">
                                                {report.summary}
                                            </p>
                                        </div>
                                        <div className="flex justify-center bg-white/5 rounded-2xl p-4 backdrop-blur-sm">
                                            <RadarChart data={report.breakdown} />
                                        </div>
                                    </div>

                                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50/50 dark:bg-[#0A0E27]/50">
                                        {report.breakdown.map((item, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="bg-white dark:bg-[#13182E] p-5 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800"
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="font-bold text-neutral-900 dark:text-white capitalize text-sm">{item.value}</h4>
                                                    <span className={`text-xs font-black px-2 py-1 rounded-md ${item.score >= 80 ? 'bg-green-100 text-green-700' :
                                                            item.score >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {item.score}/100
                                                    </span>
                                                </div>
                                                <div className="w-full bg-neutral-100 dark:bg-neutral-700 h-1.5 rounded-full mb-3 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${item.score}%` }}
                                                        className={`h-full rounded-full ${item.score >= 80 ? 'bg-green-500' :
                                                            item.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                    />
                                                </div>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                                                    {item.reason}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full min-h-[500px] bg-white dark:bg-[#13182E] rounded-3xl shadow-xl border border-neutral-100 dark:border-neutral-800 border-dashed flex flex-col items-center justify-center text-center p-12 space-y-6"
                                >
                                    <div className="w-24 h-24 bg-pink-50 dark:bg-pink-900/10 rounded-full flex items-center justify-center animate-pulse">
                                        <Users className="w-10 h-10 text-pink-300" />
                                    </div>
                                    <div className="max-w-md">
                                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Ready to Vibe Check?</h3>
                                        <p className="text-neutral-500 dark:text-neutral-400">
                                            Enter a company name and select your core values to generate a comprehensive cultural compatibility report.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default CultureFit;
