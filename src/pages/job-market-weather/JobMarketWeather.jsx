import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, Sun, Cloud, TrendingUp, Search, Loader2, MapPin, Briefcase, BarChart2 } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { useToast } from '../../components/ui/Toast';

const JobMarketWeather = () => {
    const [formData, setFormData] = useState({
        role: '',
        industry: '',
        location: ''
    });
    const [forecast, setForecast] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { error: showError } = useToast();

    const handleAnalyze = async () => {
        if (!formData.role || !formData.industry) {
            showError('Please enter both Role and Industry.');
            return;
        }

        setIsLoading(true);
        setForecast(null);

        const prompt = `
      Provide a "Job Market Weather Report" for:
      Role: ${formData.role}
      Industry: ${formData.industry}
      Location: ${formData.location || "Global/Remote"}

      Output strictly a JSON object:
      {
         "condition": "Sunny" (or Cloudy, Stormy),
         "temperature": 85 (0-100 score of market heat),
         "metrics": {
            "hiringVolume": "High",
            "salaryTrend": "+5% YoY",
            "competition": "Moderate"
         },
         "summary": "Demand is high due to...",
         "hotSkills": ["Skill 1", "Skill 2"],
         "forecast": "Expected to grow over the next quarter."
      }
    `;

        try {
            const response = await aiService.generateCompletion(prompt, {
                systemMessage: "You are a labor market economist. Output strictly JSON.",
                temperature: 0.6
            });

            // Attempt Parse
            let data;
            try {
                const jsonMatch = response.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    data = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error("No JSON found");
                }
            } catch (e) {
                console.warn("Parse Error", e);
                data = {
                    condition: "Cloudy",
                    temperature: 50,
                    metrics: { hiringVolume: "Unknown", salaryTrend: "Stable", competition: "Unknown" },
                    summary: "Market analysis unavailable for specific inputs.",
                    hotSkills: [],
                    forecast: "Try again with broader terms."
                };
            }
            setForecast(data);
        } catch (err) {
            console.error('Weather error:', err);
            showError('Failed to get forecast.');
        } finally {
            setIsLoading(false);
        }
    };

    const getWeatherIcon = (condition) => {
        switch (condition?.toLowerCase()) {
            case 'sunny': return <Sun className="w-24 h-24 text-yellow-500 animate-pulse" />;
            case 'program': return <Sun className="w-24 h-24 text-yellow-500" />;
            case 'stormy': return <CloudRain className="w-24 h-24 text-gray-600" />;
            default: return <Cloud className="w-24 h-24 text-gray-400" />;
        }
    };

    const getColor = (temp) => {
        if (temp >= 80) return 'text-red-500';
        if (temp >= 50) return 'text-yellow-500';
        return 'text-blue-500';
    };

    return (
        <div className="max-w-7xl mx-auto p-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-6">
                <div className="inline-flex p-4 rounded-full bg-white dark:bg-white/10 shadow-xl backdrop-blur-xl">
                    <CloudRain className="w-12 h-12 text-blue-500" />
                </div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    Market <span className="text-blue-500">Forecast</span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                    Don't get caught in the rain. Check the hiring climate before you apply.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Search Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/80 dark:bg-[#13182E]/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 space-y-6"
                    >
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Search className="w-5 h-5 text-blue-500" /> Regional Settings
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Role Title</label>
                                <div className="relative group">
                                    <Briefcase className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        placeholder="e.g. Product Manager"
                                        className="w-full pl-10 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0A0E27] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Industry Sector</label>
                                <div className="relative group">
                                    <BarChart2 className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={formData.industry}
                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                        placeholder="e.g. SaaS"
                                        className="w-full pl-10 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0A0E27] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Location</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="e.g. Remote"
                                        className="w-full pl-10 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0A0E27] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading || !formData.role || !formData.industry}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Scanning Satellites...
                                </>
                            ) : (
                                <>
                                    <Cloud className="w-5 h-5" /> Run Forecast
                                </>
                            )}
                        </button>
                    </motion.div>
                </div>

                {/* Right: Weather Dashboard */}
                <div className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                        {forecast ? (
                            <motion.div
                                key="forecast"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                {/* Main Card (Current Conditions) */}
                                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div className="text-center md:text-left">
                                            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                                <MapPin className="w-5 h-5 text-blue-200" />
                                                <span className="font-bold text-blue-100 uppercase tracking-widest text-xs">
                                                    {formData.location || "Global"}
                                                </span>
                                            </div>
                                            <h2 className="text-6xl font-black tracking-tighter mb-2">{forecast.temperature}°</h2>
                                            <p className="text-xl font-medium text-blue-100">{forecast.condition}</p>
                                        </div>

                                        <div className="flex-1 max-w-sm bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                            <p className="text-sm leading-relaxed text-blue-50 font-medium">
                                                "{forecast.summary}"
                                            </p>
                                        </div>

                                        <div className="w-32 h-32 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-inner">
                                            {getWeatherIcon(forecast.condition)}
                                        </div>
                                    </div>
                                </div>

                                {/* Metrics Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { label: "Volume", value: forecast.metrics.hiringVolume, icon: BarChart2, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
                                        { label: "Salaries", value: forecast.metrics.salaryTrend, icon: TrendingUp, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
                                        { label: "Competition", value: forecast.metrics.competition, icon: Briefcase, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" }
                                    ].map((m, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="bg-white dark:bg-[#13182E] p-6 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center group hover:scale-105 transition-transform"
                                        >
                                            <div className={`p-4 rounded-2xl ${m.bg} mb-4 group-hover:scale-110 transition-transform`}>
                                                <m.icon className={`w-6 h-6 ${m.color}`} />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{m.label}</span>
                                            <span className="text-lg font-black text-slate-900 dark:text-white">{m.value}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* 5-Day Forecast (Skills) */}
                                <div className="bg-white dark:bg-[#13182E] rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <Sun className="w-5 h-5 text-amber-500" /> Hot Skills Forecast
                                        </h3>
                                        <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full uppercase">Rising Trends</span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {forecast.hotSkills.map((skill, idx) => (
                                            <div key={idx} className="bg-slate-50 dark:bg-[#1A2139] p-4 rounded-2xl text-center border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                                                <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">{skill}</p>
                                                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                                                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.random() * 40 + 60}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full min-h-[500px] bg-white/50 dark:bg-[#13182E]/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center p-12 space-y-6"
                            >
                                <div className="w-32 h-32 bg-white dark:bg-[#1E2640] rounded-full flex items-center justify-center shadow-xl animate-float">
                                    <Cloud className="w-16 h-16 text-blue-300 dark:text-blue-500/50" />
                                </div>
                                <div className="max-w-md space-y-2">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Awaiting Satellite Data</h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                                        Our sensors are ready. Enter your innovative career parameters to receive a real-time market forecast.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default JobMarketWeather;
