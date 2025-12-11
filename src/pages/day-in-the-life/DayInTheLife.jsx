import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Sun, Moon, Coffee, Briefcase, Users, Laptop, Loader2, Calendar } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { useToast } from '../../components/ui/Toast';

const DayInTheLife = () => {
    const [formData, setFormData] = useState({
        jobTitle: '',
        company: '',
        industry: ''
    });
    const [schedule, setSchedule] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { error: showError } = useToast();

    const handleGenerate = async () => {
        if (!formData.jobTitle) {
            showError('Please enter a Job Title.');
            return;
        }

        setIsLoading(true);
        setSchedule(null);

        const prompt = `
      Generate a realistic "Day in the Life" hourly schedule for a:
      Job Title: ${formData.jobTitle}
      Company/Type: ${formData.company || "Generic Tech Company"}
      Industry: ${formData.industry || "Technology"}
      
      Start from 8:00 AM to 6:00 PM.
      Include meetings, deep work, breaks, and specific tasks relevant to the role.
      
      Format strictly as a JSON array of objects:
      [
        { "time": "8:00 AM", "activity": "Arrival & Coffee", "icon": "coffee", "type": "personal", "description": "Checking emails..." },
        ...
      ]
      Available icons: coffee, meeting, deepwork, email, lunch, commute.
    `;

        try {
            const response = await aiService.generateCompletion(prompt, {
                systemMessage: "You are a career simulator. Output strictly JSON.",
                temperature: 0.7
            });

            // Parse JSON
            let data;
            try {
                const jsonMatch = response.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    data = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error("No JSON found");
                }
            } catch (e) {
                console.warn("Parsing failed, mocking fallback", e);
                // Fallback manual structure if AI fails to format perfectly
                data = [
                    { time: "9:00 AM", activity: "Standup Meeting", icon: "meeting", description: "Daily synchronization with the team." },
                    { time: "10:00 AM", activity: "Deep Work", icon: "deepwork", description: "Focusing on core project tasks." },
                    { time: "12:00 PM", activity: "Lunch Break", icon: "lunch", description: "Recharging." },
                    { time: "1:00 PM", activity: "Project Review", icon: "meeting", description: "Reviewing metrics and progress." },
                    { time: "5:00 PM", activity: "Wrap Up", icon: "email", description: "Planning for tomorrow." }
                ];
            }

            setSchedule(data);
        } catch (err) {
            console.error('Generation error:', err);
            showError('Failed to generate schedule.');
        } finally {
            setIsLoading(false);
        }
    };

    const getIcon = (iconName) => {
        switch (iconName?.toLowerCase()) {
            case 'coffee': return <Coffee className="w-5 h-5 text-amber-600" />;
            case 'meeting': return <Users className="w-5 h-5 text-blue-600" />;
            case 'deepwork': return <Laptop className="w-5 h-5 text-purple-600" />;
            case 'briefcase': return <Briefcase className="w-5 h-5 text-gray-600" />;
            case 'sun': return <Sun className="w-5 h-5 text-orange-500" />;
            case 'moon': return <Moon className="w-5 h-5 text-indigo-500" />;
            default: return <Clock className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0A0E27] p-6 pt-24 font-sans">
            <div className="max-w-5xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex p-4 rounded-3xl bg-orange-100 dark:bg-orange-900/30"
                    >
                        <Sun className="w-12 h-12 text-orange-500" />
                    </motion.div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Day in the <span className="text-orange-500">Life</span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Step into the shoes of your future role. Experience the daily rhythm, responsibilities, and reality.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Inputs */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="md:col-span-4 space-y-6"
                    >
                        <div className="bg-white dark:bg-[#13182E] p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 space-y-6 sticky top-24">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-lg">
                                <Briefcase className="w-5 h-5 text-orange-500" /> Role Configuration
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Job Title</label>
                                    <input
                                        type="text"
                                        value={formData.jobTitle}
                                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                        placeholder="e.g. Senior Product Designer"
                                        className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0A0E27] text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Company Name (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        placeholder="e.g. Spotify"
                                        className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0A0E27] text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Industry</label>
                                    <select
                                        value={formData.industry}
                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                        className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0A0E27] text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none font-medium appearance-none"
                                    >
                                        <option value="">Select Industry...</option>
                                        <option value="tech">Technology & SaaS</option>
                                        <option value="finance">Finance & Banking</option>
                                        <option value="healthcare">Healthcare</option>
                                        <option value="creative">Creative & Media</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={isLoading || !formData.jobTitle}
                                className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Simulating Day...
                                    </>
                                ) : (
                                    <>
                                        <Calendar className="w-5 h-5" /> Generate Schedule
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>

                    {/* Timeline Output */}
                    <motion.div
                        className="md:col-span-8 space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <AnimatePresence mode="wait">
                            {schedule ? (
                                <motion.div
                                    key="schedule"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="relative"
                                >
                                    {/* Center Line */}
                                    <div className="absolute left-[27px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-orange-200 via-orange-400 to-orange-200 dark:from-orange-900 dark:via-orange-700 dark:to-orange-900 opacity-50"></div>

                                    <div className="space-y-8 pl-2">
                                        {schedule.map((item, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="relative flex gap-6 group"
                                            >
                                                {/* Icon Node */}
                                                <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-2xl bg-white dark:bg-[#1E2640] border-4 border-slate-50 dark:border-[#0A0E27] shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                    {getIcon(item.icon)}
                                                </div>

                                                {/* Content Card */}
                                                <div className="flex-1 bg-white dark:bg-[#13182E] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all hover:-translate-y-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">{item.activity}</h4>
                                                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-full">
                                                            {item.time}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                    {item.type && (
                                                        <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                            {item.type}
                                                        </span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}

                                        <div className="flex justify-center pt-8">
                                            <button className="px-6 py-2 bg-slate-200 dark:bg-slate-800 rounded-full text-slate-500 font-bold text-sm hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                                                End of Day
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-full bg-slate-50 dark:bg-[#13182E]/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center p-12 space-y-6 min-h-[500px]">
                                    <div className="w-24 h-24 bg-white dark:bg-[#1E2640] rounded-full flex items-center justify-center shadow-sm">
                                        <Clock className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                    </div>
                                    <div className="max-w-xs">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Build Your Day</h3>
                                        <p className="text-slate-500 dark:text-slate-400">
                                            Enter a job title to generate a realistic, hour-by-hour schedule simulation.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

            </div>
        </div>
    );
};

export default DayInTheLife;
