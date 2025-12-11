import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Code, Github, ExternalLink, Image as ImageIcon, Loader2, Palette, Monitor } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { useToast } from '../../components/ui/Toast';

const PortfolioBuilder = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        techStack: '',
        githubUrl: '',
        theme: 'modern' // modern, minimal, bold
    });
    const [generatedContent, setGeneratedContent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { error: showError } = useToast();

    const handleGenerate = async () => {
        if (!formData.title || !formData.description) {
            showError('Please provide a Project Title and Description.');
            return;
        }

        setIsLoading(true);
        setGeneratedContent(null);

        const prompt = `
      Enhance this project description for a developer portfolio.
      
      Project Title: ${formData.title}
      Raw Description: ${formData.description}
      Tech Stack: ${formData.techStack}
      
      Output strictly a JSON object:
      {
         "tagline": "A punchy, one-line summary",
         "enhancedDescription": "A professional, result-oriented paragraph (2-3 sentences) highlighting the problem and solution.",
         "keyFeatures": ["Feature 1", "Feature 2", "Feature 3"],
         "colorPalette": ["#hex1", "#hex2"]
      }
    `;

        try {
            const response = await aiService.generateCompletion(prompt, {
                systemMessage: "You are a UX copywriter and designer. Output strictly JSON.",
                temperature: 0.7
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
                    tagline: formData.title,
                    enhancedDescription: formData.description,
                    keyFeatures: ["User Interface", "Backend API"],
                    colorPalette: ["#3B82F6", "#10B981"]
                };
            }
            setGeneratedContent(data);
        } catch (err) {
            console.error('Portfolio error:', err);
            showError('Failed to generate portfolio content.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#0A0E27] p-6 pt-24 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex p-4 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30"
                    >
                        <Layers className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                        Portfolio <span className="text-indigo-600 dark:text-indigo-400">Architect</span>
                    </h1>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
                        Transform raw project data into a cinematic developer showcase card.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[800px]">

                    {/* Editor Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-4 flex flex-col h-full bg-white dark:bg-[#13182E] rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
                    >
                        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#1A2139]/50 backdrop-blur-sm sticky top-0 z-10">
                            <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                <Code className="w-5 h-5 text-indigo-500" /> Project Details
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Project Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Neural Net Visualizer"
                                    className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-[#0A0E27] text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none font-bold transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Tech Stack</label>
                                <input
                                    type="text"
                                    value={formData.techStack}
                                    onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                                    placeholder="React, Three.js, Python..."
                                    className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-[#0A0E27] text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Repo URL</label>
                                    <div className="relative group">
                                        <Github className="absolute left-4 top-4 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.githubUrl}
                                            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                            placeholder="github.com/username/repo"
                                            className="w-full pl-12 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-[#0A0E27] text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Aesthetic</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['modern', 'minimal', 'bold'].map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setFormData({ ...formData, theme: t })}
                                                className={`py-2 rounded-lg text-xs font-bold uppercase border-2 transition-all ${formData.theme === t
                                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                                    : 'border-transparent bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:border-zinc-300'
                                                    }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Raw Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Paste your rough notes or abstract here..."
                                    className="w-full h-40 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-[#0A0E27] text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-medium leading-relaxed"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-[#13182E]">
                            <button
                                onClick={handleGenerate}
                                disabled={isLoading || !formData.title}
                                className="w-full py-4 bg-zinc-900 dark:bg-white hover:scale-[1.02] active:scale-[0.98] text-white dark:text-zinc-900 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Architecting...
                                    </>
                                ) : (
                                    <>
                                        <Palette className="w-5 h-5" /> Generate Asset
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>

                    {/* Preview Panel */}
                    <div className="lg:col-span-8 h-full flex flex-col">
                        <div className="flex-1 bg-zinc-100 dark:bg-black/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center p-8 relative overflow-hidden group">
                            <div className="absolute inset-0 pattern-grid-lg opacity-5 pointer-events-none" />

                            <AnimatePresence mode="wait">
                                {generatedContent ? (
                                    <motion.div
                                        key="preview"
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ type: "spring", bounce: 0.4 }}
                                        className={`w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative z-10 group-hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] duration-500 ease-out ${formData.theme === 'bold'
                                            ? 'bg-zinc-900 text-white'
                                            : formData.theme === 'minimal'
                                                ? 'bg-white text-zinc-900 border border-zinc-200'
                                                : 'bg-white text-zinc-900'
                                            }`}
                                    >
                                        {/* Browser Toolbar Mockup */}
                                        <div className="h-8 bg-black/5 dark:bg-white/5 flex items-center px-4 gap-2 backdrop-blur-md">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                        </div>

                                        {/* Hero Image Area */}
                                        <div
                                            className="h-64 w-full relative overflow-hidden"
                                            style={{
                                                background: `linear-gradient(135deg, ${generatedContent.colorPalette?.[0] || '#6366f1'}, ${generatedContent.colorPalette?.[1] || '#a855f7'})`
                                            }}
                                        >
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <ImageIcon className="w-20 h-20 text-white/30" />
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <span className="inline-block px-3 py-1 bg-black/30 backdrop-blur-md rounded-lg text-xs font-bold text-white mb-2 border border-white/20">
                                                            LATEST BUILD
                                                        </span>
                                                        <h2 className="text-4xl font-black text-white tracking-tight">{formData.title}</h2>
                                                    </div>
                                                    {formData.githubUrl && (
                                                        <a href={formData.githubUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-lg">
                                                            <Github className="w-6 h-6" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8">
                                            <h3 className={`text-xl font-medium italic mb-6 ${formData.theme === 'bold' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                                "{generatedContent.tagline}"
                                            </h3>

                                            <div className="grid grid-cols-3 gap-8">
                                                <div className="col-span-2 space-y-6">
                                                    <p className={`leading-relaxed text-lg ${formData.theme === 'bold' ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                                        {generatedContent.enhancedDescription}
                                                    </p>

                                                    <div className="space-y-3">
                                                        <h4 className="text-xs font-bold uppercase tracking-widest opacity-50">Stack</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {formData.techStack.split(',').map((tech, idx) => (
                                                                <span key={idx} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${formData.theme === 'bold'
                                                                    ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                                                                    : 'bg-zinc-100 text-zinc-600'
                                                                    }`}>
                                                                    {tech.trim()}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={`p-6 rounded-2xl ${formData.theme === 'bold' ? 'bg-zinc-800/50' : 'bg-zinc-50'}`}>
                                                    <h4 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Highlights</h4>
                                                    <ul className="space-y-3">
                                                        {generatedContent.keyFeatures.map((feat, idx) => (
                                                            <li key={idx} className="flex items-start gap-2 text-sm font-medium">
                                                                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${formData.theme === 'bold' ? 'bg-indigo-400' : 'bg-indigo-600'}`} />
                                                                <span className="opacity-80">{feat}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="text-center space-y-4 max-w-sm">
                                        <div className="w-24 h-24 bg-white dark:bg-[#1E2640] rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
                                            <Monitor className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Live Preview</h3>
                                        <p className="text-zinc-500 dark:text-zinc-400">
                                            Your enhanced portfolio card will appear here in real-time. Configure the details on the left to start building.
                                        </p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PortfolioBuilder;
